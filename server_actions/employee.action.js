'use server';

import { connectDb } from "@db";
import { logger } from "@utils/helpers/log";
import { createActivity } from "./recentActivity.action";
import User from "@db/models/user.model";
import Employee from "@db/models/employee.model";
import { validateEmail } from "@utils/helpers";
import bcrypt from "bcryptjs";

export const createEmployee = async (employeeData, adminId) => {
    const { email, password, confirmedPassword } = employeeData;

    try {
        const isEmailValid = validateEmail(email);

        // throw an error message if email is not valid
        if (!isEmailValid) {
            throw new Error(failsValidation);
        }

        // Connect to the db
        await connectDb();

        // Find admin by id
        const admin = await User.findOne({ _id: adminId });

        // Find employee by email
        const employeeExists = await Employee.findOne({ email: email });

        if (employeeExists) {
            throw new Error("Email already exists");
        }


        if (!admin) {
            throw new Error("Unauthorized access");
        }

        // check if password and confirmed password matches
        const passMatched = !(await bcrypt.compare(password, confirmedPassword))

        // throw an error message if password and confirmed password don't matches
        if (!passMatched) {
            throw new Error("Unmatched password");
        }

        // hash user password
        const hashedPassword = await bcrypt.hash(password, 5);

        // Convert employee Role to lowercase and replace spaces with underscores
        const formattedRole = employeeData.role.toLowerCase().replace(/\s+/g, '_');

        // Create a new Employee in db
        const newEmployee = await Employee.create({
            ...employeeData,
            companyId: admin.company._id,
            password: hashedPassword,
            jobTitle: employeeData.role,
            role: formattedRole,
        });


        // Add the new employee's ID to the admin's company employees array
        admin.company.employees.push(newEmployee._id);
        await admin.save();

        // create an activity object
        const activity = {
            performedBy: {
                userId: adminId,
                userName: admin.firstName + ' ' + admin.lastName,
            },
            type: 'Employee',
            purpose: `Added a new Employee: ${employeeData.firstName}`,
            companyId: admin.company._id,
        };

        await createActivity(activity);

        return JSON.parse(JSON.stringify(newEmployee))
    } catch (error) {
        logger(error.message);
        return { status: 500, message: 'Something went wrong' };
    }
};