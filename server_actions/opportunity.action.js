'use server';

import { connectDb } from "@db";
import Opportunity from "@db/models/opportunity.model";
import User from "@db/models/user.model";
import { logger } from "@utils/helpers/log";
import { createActivity } from "./recentActivity.action";
import Employee from "@db/models/employee.model";
import { getOpportunityMetrics } from "./report.action";
import { verifyActionPerformer } from "./verifyActionPerformer";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { routes } from "@lib/routes";

export const createOpportunity = async (opportunityData, performerId) => {
    try {
        const { performer, companyId, isAdmin } = await verifyActionPerformer(performerId);

        // Create a new opportunity in the database
        const opportunity = await Opportunity.create({
            ...opportunityData,
            creatorId: performer._id,
            companyId: companyId,
            createdByAdmin: isAdmin,
        });

        // create an activity object
        const activity = {
            performedBy: {
                userId: performerId,
                userName: performer.firstName + ' ' + performer.lastName,
            },
            type: 'New Contact',
            purpose: `Captured a new opportunity: ${opportunityData.firstName}`,
            companyId: companyId,
        };

        await createActivity(activity);

        return JSON.parse(JSON.stringify(opportunity))
    } catch (error) {
        return logger(error.message);
    }
};

export const createMultipleOpportunities = async (opportunitiesData, creatorId) => {
    try {
        await connectDb();

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
            const company = await User.findOne({ 'company._id': companyId });

            if (!company || company.company._id != creator.company.Id) {
                throw new Error("Unauthorized access");
            }

            const isEmployeeIncluded = company.employees.some(emp => emp.equals(creator._id));

            if (!isEmployeeIncluded) {
                throw new Error("Unauthorized access");
            }

            companyId = company._id;
        }

        const opportunitiesToCreate = opportunitiesData.map(opportunityData => ({
            ...opportunityData,
            creatorId: creatorId,
            companyId: companyId,
            createdByAdmin: isAdmin,
        }));

        await Opportunity.insertMany(opportunitiesToCreate);

        const activities = opportunitiesData.map(opportunityData => ({
            performedBy: {
                userId: creatorId,
                userName: `${creator.firstName} ${creator.lastName}`,
            },
            type: 'New Contact',
            purpose: `Captured a new opportunity: ${opportunityData.firstName}`,
            companyId: companyId,
        }));

        await createActivity(activities);

        return { status: 200, message: "Opportunities created successfully" };
    } catch (error) {
        return logger(error.message);
    }
};

export const fetchOpportunities = async (filters = {}, options = {}, companyId) => {
    try {
        // Connect to the database
        await connectDb();

        // Destructure the filters and options
        const { firstName, lastName, probability, amount, closeDate, stage, source, createdByAdmin, createdAt } = filters;

        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', } = options;

        // Build the filter query
        const query = {};

        if (firstName) query.firstName = new RegExp(firstName, 'i');
        if (lastName) query.lastName = new RegExp(lastName, 'i');
        if (source) query.source = source;
        if (amount) query.amount = amount;
        if (closeDate) query.closeDate = closeDate;
        if (stage) query.stage = stage;
        if (probability) query.probability = probability;
        if (companyId) query.companyId = new mongoose.Types.ObjectId(companyId);
        if (createdByAdmin !== undefined) query.createdByAdmin = createdByAdmin;
        if (createdAt) query.createdAt = { $gte: new Date(createdAt) };

        // Pagination calculation
        const skip = (page - 1) * limit;

        // Fetch the Opportunities based on the query, sort, and pagination
        const opportunities = await Opportunity.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        // Get the total number of Opportunities that match the query (for pagination)
        const totalOpportunities = await Opportunity.countDocuments(query);

        const stagesFilter = { includeStageCount: true, stages: ['Closed Won', 'Closed Lost',] }
        const opportunitiesStageCount = await getOpportunityMetrics(companyId, stagesFilter)

        return JSON.parse(JSON.stringify({
            opportunities,
            totalOpportunities,
            currentPage: page,
            totalPages: Math.ceil(totalOpportunities / limit),
            stagesCount: opportunitiesStageCount.stageCount,
        }));
    } catch (error) {
        console.error('Error fetching Opportunities:', error);
        throw new Error('Failed to fetch Opportunities');
    }
};

export const deleteOpportunityFromDb = async (id, performerId) => {
    try {
        const { performer, companyId } = await verifyActionPerformer(performerId);

        const opportunityToDelete = await Opportunity.findById(id)

        if (!opportunityToDelete) {
            throw new Error('Opportunity not found')
        }

        await Opportunity.deleteOne({ _id: id });

        const activities = {
            performedBy: {
                userId: performerId,
                userName: `${performer.firstName} ${performer.lastName}`,
            },
            type: 'Updates',
            purpose: `Deleted a Opportunity: ${performer.firstName}`,
            companyId: companyId,
        };

        await createActivity(activities);

        revalidatePath('/')
        revalidatePath('/opportunities')
        return { status: 200 };
    } catch (error) {
        return logger(error.message);
    }
};

export const updateOpportunity = async (updatesData, performerId) => {
    try {
        const { performer, companyId } = await verifyActionPerformer(performerId);

        const merToUpdate = await Opportunity.findById(updatesData._id);

        if (!merToUpdate) {
            throw new Error('Opportunity not found')
        }

        updatesData.modifiedAt = new Date();
        const updatedOpportunity = await Opportunity.findByIdAndUpdate(updatesData._id, updatesData, { new: true });

        // create an activity object
        const activity = {
            performedBy: {
                userId: performerId,
                userName: `${performer.firstName} ${performer.lastName}`,
            },
            type: 'Updates',
            purpose: `Updated : ${updatesData.firstName}'s details`,
            companyId: companyId,
        };

        await createActivity(activity);

        revalidatePath(`${routes.home}`);

        return JSON.parse(JSON.stringify(updatedOpportunity))
    } catch (error) {
        return logger(error.message);
    }
};