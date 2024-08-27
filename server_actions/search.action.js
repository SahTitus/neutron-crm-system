"use server";

import { connectDb } from "@db";
import Campaign from "@db/models/campaign.model";
import Customer from "@db/models/customer.model";
import Lead from "@db/models/lead.model";
import Opportunity from "@db/models/opportunity.model";
import Task from "@db/models/task.model";
import { logger } from "@utils/helpers/log";

export const fetchBySearch = async (query, filters, companyId) => {
    try {
        await connectDb();
        const { campaign, customer, lead, opportunity, task } = filters;
        const results = [];

        // Campaigns
        if (campaign) {
            const campaignResults = await Campaign.find({
                companyId: companyId, // Filter by companyId
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { subject: { $regex: query, $options: 'i' } },
                    { content: { $regex: query, $options: 'i' } }
                ]
            }).lean();
            results.push(...campaignResults.map(item => ({ ...item, type: "campaign" })));
        }

        // Customers
        if (customer) {
            const customerResults = await Customer.find({
                companyId: companyId, // Filter by companyId
                $or: [
                    { firstName: { $regex: query, $options: 'i' } },
                    { lastName: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } },
                    { city: { $regex: query, $options: 'i' } },
                    { country: { $regex: query, $options: 'i' } }
                ]
            }).lean();
            results.push(...customerResults.map(item => ({ ...item, type: "customer" })));
        }

        // Leads
        if (lead) {
            const leadResults = await Lead.find({
                companyId: companyId, // Filter by companyId
                $or: [
                    { firstName: { $regex: query, $options: 'i' } },
                    { lastName: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } },
                    { notes: { $regex: query, $options: 'i' } }
                ]
            }).lean();
            results.push(...leadResults.map(item => ({ ...item, type: "lead" })));
        }

        // Opportunities
        if (opportunity) {
            const opportunityResults = await Opportunity.find({
                companyId: companyId, // Filter by companyId
                $or: [
                    { firstName: { $regex: query, $options: 'i' } },
                    { lastName: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } },
                    { notes: { $regex: query, $options: 'i' } }
                ]
            }).lean();
            results.push(...opportunityResults.map(item => ({ ...item, type: "opportunity" })));
        }

        // Tasks
        if (task) {
            const taskResults = await Task.find({
                companyId: companyId, // Filter by companyId
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { assignTo: { $regex: query, $options: 'i' } }
                ]
            }).lean();
            results.push(...taskResults.map(item => ({ ...item, type: "task" })));
        }

        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        logger(error.message);
        return [];
    }
};