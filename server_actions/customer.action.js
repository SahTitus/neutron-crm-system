'use server';

import { connectDb } from "@db";
import { logger } from "@utils/helpers/log";
import { createActivity } from "./recentActivity.action";
import Customer from "@db/models/customer.model";
import mongoose from "mongoose";
import { getCustomerMetrics } from "./report.action";
import { verifyActionPerformer } from "./verifyActionPerformer";
import { revalidatePath } from "next/cache";
import { routes } from "@lib/routes";

export const createCustomer = async (customerData, adminId) => {
    try {
        const { performer, companyId } = await verifyActionPerformer(adminId);

        // Create a new customer in db
        const newCustomer = await Customer.create({
            ...customerData,
            companyId: companyId,
        });

        // create an activity object
        const activity = {
            performedBy: {
                userId: performer._id,
                userName: performer.firstName + ' ' + performer.lastName,
            },
            type: 'New Contact',
            purpose: `Added a new customer: ${customerData.firstName}`,
            companyId: companyId,
        };

        await createActivity(activity);

        return JSON.parse(JSON.stringify(newCustomer))
    } catch (error) {
        return { status: 500, message: 'Something went wrong' };
    }
};


export const createMultipleCustomers = async (customersData, creatorId) => {
    try {
        const { performer, isAdmin, companyId } = await verifyActionPerformer(creatorId);

        const customersToCreate = customersData.map(customerData => ({
            ...customerData,
            performerId: creatorId,
            companyId: companyId,
            createdByAdmin: isAdmin,
        }));

        await Customer.insertMany(customersToCreate);

        const activities = customersData.map(customerData => ({
            performedBy: {
                userId: creatorId,
                userName: `${performer.firstName} ${performer.lastName}`,
            },
            type: 'New Contact',
            purpose: `Captured a new Customer: ${customerData.firstName}`,
            companyId: companyId,
        }));

        await createActivity(activities);

        return { status: 200, message: "Customers created successfully" };
    } catch (error) {
        return logger(error.message);
    }
};

export const fetchCustomers = async (filters = {}, options = {}, companyId) => {
    try {
        // Connect to the database
        await connectDb();

        // Destructure the filters and options
        const { firstName, lastName, status, city, country, gender, source, createdByAdmin, createdAt } = filters;

        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', } = options;

        // Build the filter query
        const query = {};

        if (firstName) query.firstName = new RegExp(firstName, 'i');
        if (lastName) query.lastName = new RegExp(lastName, 'i');
        if (status) query.status = status;
        if (city) query.city = city;
        if (country) query.country = country;
        if (source) query.source = source;
        if (gender) query.gender = gender;
        if (companyId) query.companyId = new mongoose.Types.ObjectId(companyId);
        if (createdByAdmin !== undefined) query.createdByAdmin = createdByAdmin;
        if (createdAt) query.createdAt = { $gte: new Date(createdAt) };

        // Pagination calculation
        const skip = (page - 1) * limit;

        // Fetch the Customers based on the query, sort, and pagination
        const customers = await Customer.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        // Get the total number of Customers that match the query (for pagination)
        const totalCustomers = await Customer.countDocuments(query);

        const statusesFilter = { includeStatusCount: true, statuses: ['Active', 'Inactive'] }
        const customersStatusCount = await getCustomerMetrics(companyId, statusesFilter)

        return JSON.parse(JSON.stringify({
            customers,
            totalCustomers,
            currentPage: page,
            totalPages: Math.ceil(totalCustomers / limit),
            statusesCount: customersStatusCount.statusCount,
        }));
    } catch (error) {
        return logger(error.message);
    }
};

export const deleteCustomerFromDb = async (id, performerId) => {
    try {
        const { performer, companyId } = await verifyActionPerformer(performerId);

        const customerToDelete = await Customer.findById(id)

        if (!customerToDelete) {
            throw new Error('Customer not found')
        }

        await Customer.deleteOne({ _id: id });

        const activities = {
            performedBy: {
                userId: performerId,
                userName: `${performer.firstName} ${performer.lastName}`,
            },
            type: 'Updates',
            purpose: `Deleted a Customer: ${performer.firstName}`,
            companyId: companyId,
        };

        await createActivity(activities);

        revalidatePath('/')
        revalidatePath('/customers')
        return { status: 200 };
    } catch (error) {
        return logger(error.message);
    }
};

export const updateCustomer = async (updatesData, performerId) => {
    try {
        const { performer, companyId } = await verifyActionPerformer(performerId);

        const customerToUpdate = await Customer.findById(updatesData._id);

        if (!customerToUpdate) {
            throw new Error('Customer not found')
        }

        updatesData.modifiedAt = new Date();
        const updatedCustomer = await Customer.findByIdAndUpdate(updatesData._id, updatesData, { new: true });

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

        return JSON.parse(JSON.stringify(updatedCustomer))
    } catch (error) {
        return logger(error.message);
    }
};