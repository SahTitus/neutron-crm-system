'use server';

import { connectDb } from "@db";
import RecentActivity from "@db/models/recentActivity.model";
import { logger } from "@utils/helpers/log";

export const createActivity = async (activity) => {
  try {
    // Connect to the db
    await connectDb();

    // Create a new activity in the db
    const data = await RecentActivity.create(activity);

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    logger('Something went wrong');
    return { status: 500, message: error.message };
  }
};

export const fetchRecentActivities = async (role, userId, companyId) => {
  try {
    // Connect to the database
    await connectDb();

    let filter = { companyId: companyId };

    if (role !== 'admin') {
      filter.userId = userId;
    }

    // Fetch activities based on the filter
    const activities = await RecentActivity.find(filter).sort({ createdAt: -1 }).limit(20);


    return JSON.parse(JSON.stringify(activities));
  } catch (error) {
    logger(error.message);
    return { status: 500, message: error.message };
  }
};