'use server';

import { connectDb } from "@db";
import { logger } from "@utils/helpers/log";
import { createActivity } from "./recentActivity.action";
import Task from "@db/models/task.model";
import User from "@db/models/user.model";
import mongoose from "mongoose";

export const createTask = async (taskData, adminId) => {
    try {
        // Connect to the db
        await connectDb();

        // Find admin by id
        const admin = await User.findOne({ _id: adminId });

        if (!admin) {
            throw new Error("Unauthorized access");
        }

        // Create a new Task in db
        const taskResult = await Task.create({
            ...taskData,
            companyId: admin.company._id,
        });

        // create an activity object
        const activity = {
            performedBy: {
                userId: adminId,
                userName: admin.firstName + ' ' + admin.lastName,
            },
            type: 'Task',
            purpose: `Created a new Task: ${taskData.title}`,
            companyId: admin.company._id,
        };

        const activityResult = await createActivity(activity);

        return JSON.parse(JSON.stringify({ data: taskResult, activity: activityResult }));
    } catch (error) {
        return logger(error.message);
    }
};



export const createMultipleTasks = async (tasksData, adminId) => {

    try {
        // Connect to the db
        await connectDb();

        // Find admin by id
        const admin = await User.findOne({ _id: adminId });

        if (!admin) {
            throw new Error("Unauthorized access");
        }


        const tasksToCreate = tasksData.map(taskData => ({
            ...taskData,
            companyId: admin.company._id,
        }));

        const taskResult = await Task.insertMany(tasksToCreate);

        const activities = tasksData.map(taskData => ({
            performedBy: {
                userId: adminId,
                userName: admin.firstName + ' ' + admin.lastName,
            },
            type: 'Task',
            purpose: `Created a new Task: ${taskData.title}`,
            companyId: admin.company._id,

        }));

        await createActivity(activities);


        return JSON.parse(JSON.stringify({ data: taskResult, activity: activityResult }));
    } catch (error) {
        return logger(error.message);
    }
};

export const fetchTasks = async (companyId) => {
    try {
        // Connect to the db
        await connectDb();

        // Get the current date
        const currentDate = new Date();

        // Calculate the date for 2 weeks from now
        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(currentDate.getDate() + 14);

        // Convert dates to strings in the format YYYY-MM-DD for comparison
        const currentDateString = currentDate.toISOString().split('T')[0];
        const twoWeeksFromNowString = twoWeeksFromNow.toISOString().split('T')[0];

        // Fetch tasks for the next 2 weeks
        const tasks = await Task.find({
            companyId: new mongoose.Types.ObjectId(companyId),
            date: { $gte: currentDateString, $lte: twoWeeksFromNowString }
        });

        // Populate the `assignTo` field with the user's or employee's name
        const populatedTasks = await Promise.all(
            tasks.map(async (task) => {
                let assignee = await User.findOne({ email: task.assignTo });
                if (!assignee) {
                    assignee = await Employee.findOne({ email: task.assignTo });
                }

                if (assignee) {
                    task.assignTo = `${assignee.firstName} ${assignee.lastName}`;
                } else {
                    task.assignTo = 'Unknown Assignee'; // In case no user or employee is found
                }

                return task;
            })
        );

        return JSON.parse(JSON.stringify(populatedTasks));
    } catch (error) {
        return logger(error.message);
    }
};