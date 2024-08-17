'use server';

import { connectDb } from "@db";
import Campaign from "@db/models/campaign.model";
import User from "@db/models/user.model";
import { logger } from "@utils/helpers/log";
import { createActivity } from "./recentActivity.action";
import Employee from "@db/models/employee.model";
import mongoose from "mongoose";
import { getCampaignMetrics } from "./report.action";
import { verifyActionPerformer } from "./verifyActionPerformer";
import { revalidatePath } from "next/cache";
import { routes } from "@lib/routes";

export const createCampaign = async (campaignData, performerId) => {
  try {
    const { companyId, isAdmin, performer } = await verifyActionPerformer(performerId);

    // Create a new campaign in the database
    const newCampaign = await Campaign.create({
      ...campaignData,
      creatorId: performerId,
      companyId: companyId,
      createdByAdmin: isAdmin,
    });

    // create an activity object
    const activity = {
      performedBy: {
        userId: performerId,
        userName: performer.firstName + ' ' + performer.lastName,
      },
      type: 'Campaign',
      purpose: 'Sent a compaign email message to users',
      companyId: companyId,
    };

    await createActivity(activity);

    return JSON.parse(JSON.stringify(newCampaign))
  } catch (error) {
    return logger(error.message);
  }
};


export const createMultipleCampaigns = async (campaignsData, creatorId) => {
  try {
    // Connect to the db
    await connectDb();

    // Find creator by id, either in User or Employee collection
    const creator = await User.findOne({ _id: creatorId }) || await Employee.findOne({ _id: creatorId });

    if (!creator) {
      throw new Error("Unauthorized access");
    }

    let isAdmin = false;
    let companyId;

    if (creator instanceof User) {
      isAdmin = true;
      companyId = creator.company._id;
    } else if (creator instanceof Employee) {
      // Find the company of the employee
      const company = await User.findOne({ 'company._id': creator.companyId });

      if (!company || company.company._id !== creator.companyId) {
        throw new Error("Unauthorized access");
      }

      // Check if the employee ID is in the company's employees
      const isEmployeeIncluded = company.employees.some(emp => emp.equals(creator._id));

      if (!isEmployeeIncluded) {
        throw new Error("Unauthorized access");
      }

      companyId = company._id;
    }

    // Add additional data to each campaign
    const campaignsToCreate = campaignsData.map(campaignData => ({
      ...campaignData,
      creatorId: creatorId,
      companyId: companyId,
      createdByAdmin: isAdmin,
    }));

    // Create campaigns in the database
    const createdCampaigns = await Campaign.insertMany(campaignsToCreate);

    // Create activity logs
    const activities = createdCampaigns.map(campaign => ({
      performedBy: {
        userId: creatorId,
        userName: creator.firstName + ' ' + creator.lastName,
      },
      type: 'Campaign',
      purpose: `Sent a campaign email message to users (Campaign ID: ${campaign._id})`,
      companyId: companyId,
    }));

    await Promise.all(activities.map(activity => createActivity(activity)));

    return { status: 200, message: `${createdCampaigns.length} campaigns created successfully` };
  } catch (error) {
    return logger(error.message);
  }
};


export const fetchCampaigns = async (filters = {}, options = {}, companyId) => {
  try {
    // Connect to the database
    await connectDb();

    // Destructure the filters and options
    const { name, startDate, endDate, subject, content, createdAt } = filters;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    // Build the filter query
    const query = {};

    if (name) query.name = new RegExp(name, 'i'); // Case-insensitive regex search
    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.endDate = { $lte: new Date(endDate) };
    if (subject) query.subject = new RegExp(subject, 'i');
    if (content) query.content = new RegExp(content, 'i');
    if (companyId) query.companyId = new mongoose.Types.ObjectId(companyId);
    if (createdAt) query.createdAt = { $gte: new Date(createdAt) };

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Fetch the campaigns based on the query, sort, and pagination
    const campaigns = await Campaign.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    // Get the total number of campaigns that match the query (for pagination)
    const totalCampaigns = await Campaign.countDocuments(query);

    const campaignsMetrics = await getCampaignMetrics(companyId, filters);

    return JSON.parse(JSON.stringify({
      campaigns,
      totalCampaigns,
      currentPage: page,
      totalPages: Math.ceil(totalCampaigns / limit),
      campaignsMetrics
    }));
  } catch (error) {
    return logger(error.message);
  }
};

export const deleteCampaignFromDb = async (id, performerId) => {
  try {
    await verifyActionPerformer(performerId);

    const campaignToDelete = await Campaign.findById(id)

    if (!campaignToDelete) {
      throw new Error('Campaign not found')
    }

    await Campaign.deleteOne({ _id: id });

    revalidatePath(routes.home)
    revalidatePath(routes.campaigns)
    return { status: 200 };
  } catch (error) {
    return logger(error.message);
  }
};