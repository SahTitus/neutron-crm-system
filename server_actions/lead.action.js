'use server';

import { connectDb } from "@db";
import Lead from "@db/models/lead.model";
import User from "@db/models/user.model";
import { logger } from "@utils/helpers/log";
import { createActivity } from "./recentActivity.action";
import Employee from "@db/models/employee.model";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { verifyActionPerformer } from "./verifyActionPerformer";
import { getLeadMetrics } from "./report.action";
import { routes } from "@lib/routes";

export const createLead = async (leadData, performerId) => {
    try {
        const { performer, companyId, isAdmin } = await verifyActionPerformer(performerId);

        // Create a new Lead in the database
        const newLead = await Lead.create({
            ...leadData,
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
            type: 'New Contact',
            purpose: `Captured a new lead: ${leadData.firstName}`,
            companyId: companyId,
        };

        await createActivity(activity);

        return JSON.parse(JSON.stringify(newLead))
    } catch (error) {
        return logger(error.message);
    }
};


export const createMultipleLeads = async (leadsData, creatorId) => {
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

        const leadsToCreate = leadsData.map(leadData => ({
            ...leadData,
            creatorId: creatorId,
            companyId: companyId,
            createdByAdmin: isAdmin,
        }));

        await Lead.insertMany(leadsToCreate);

        const activities = leadsData.map(leadData => ({
            performedBy: {
                userId: creatorId,
                userName: `${creator.firstName} ${creator.lastName}`,
            },
            type: 'New Contact',
            purpose: `Captured a new lead: ${leadData.firstName}`,
            companyId: companyId,
        }));

        await createActivity(activities);

        return { status: 200, message: "Leads created successfully" };
    } catch (error) {
        return logger(error.message);
    }
};


export const fetchLeads = async (filters = {}, options = {}, companyId) => {
    try {
        // Connect to the database
        await connectDb();

        // Destructure the filters and options
        const { firstName, lastName, status, source, createdByAdmin, createdAt } = filters;

        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', } = options;

        // Build the filter query
        const query = {};

        if (firstName) query.firstName = new RegExp(firstName, 'i');
        if (lastName) query.lastName = new RegExp(lastName, 'i');
        if (status) query.status = status;
        if (source) query.source = source;
        if (companyId) query.companyId = new mongoose.Types.ObjectId(companyId);
        if (createdByAdmin !== undefined) query.createdByAdmin = createdByAdmin;
        if (createdAt) query.createdAt = { $gte: new Date(createdAt) };

        // Pagination calculation
        const skip = (page - 1) * limit;

        // Fetch the leads based on the query, sort, and pagination
        const leads = await Lead.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        // Get the total number of leads that match the query (for pagination)
        const totalLeads = await Lead.countDocuments(query);

        const statusesFilter = { includeStatusCount: true, statuses: ['Closed Won', 'Closed Lost',] }
        const leadsStatusesCount = await getLeadMetrics(companyId, statusesFilter);

        return JSON.parse(JSON.stringify({
            leads,
            totalLeads,
            currentPage: page,
            totalPages: Math.ceil(totalLeads / limit),
            statusesCount: leadsStatusesCount.statusCount,
        }));
    } catch (error) {
        return logger(error.message);
    }
};

export const deleteLeadFromDb = async (id, performerId) => {
    try {
        await verifyActionPerformer(performerId);

        const leadToDelete = await Lead.findById(id)

        if (!leadToDelete) {
            throw new Error('Lead not found')
        }

        await Lead.deleteOne({ _id: id });

        revalidatePath('/')
        revalidatePath('/sales')
        return { status: 200 };
    } catch (error) {
        return logger(error.message);
    }
};

export const updateLead = async (updatesData, performerId) => {
    try {
        const { performer, companyId } = await verifyActionPerformer(performerId);

        const leadToUpdate = await Lead.findById(updatesData._id);

        if (!leadToUpdate) {
            throw new Error('Lead not found')
        }

        updatesData.modifiedAt = new Date();

        const updatedLead = await Lead.findByIdAndUpdate(updatesData._id, updatesData, { new: true });

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

        return JSON.parse(JSON.stringify(updatedLead))
    } catch (error) {
        return logger(error.message);
    }
};