'use server'
import { connectDb } from "@db";
import User from "@db/models/user.model";
import { routes } from "@lib/routes";
import { extractNameParts, validateEmail } from "@utils/helpers";
import { logger } from "@utils/helpers/log";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { createActivity } from "./recentActivity.action";

export const registerUser = async (userData) => {
    const { fullName, email, password, confirmedPassword } = userData;

    try {
        const isEmailValid = validateEmail(email);

        // throw an error message if email is not valid
        if (!isEmailValid) {
            throw new Error(failsValidation);
        }

        // check if password and confirmed password matches
        const passMatched = !(await bcrypt.compare(password, confirmedPassword))

        // throw an error message if password and confirmed password don't matches
        if (!passMatched) {
            throw new Error("Unmatched password");
        }

        // connect to the db
        await connectDb();

        // Find user by email
        const userExists = await User.findOne({ email: email });

        if (userExists) {
            throw new Error("Email already exists");
        }

        // hash user password
        const hashedPassword = await bcrypt.hash(password, 5);

        // Extract firstName, middleName and lastName from full name
        const { firstName, middleName, lastName } = extractNameParts(fullName);

        // create a new user in database
        await User.create({
            firstName,
            middleName,
            lastName,
            ...userData,
            password: hashedPassword,
        })

        return JSON.parse(JSON.stringify({ status: 200 }));
    } catch (error) {
                console.log("😔😔😔",error)
        logger(error.message)
    }
};

export const fetchUser = async (id) => {
    try {
        await connectDb();

        const user = await User.findById(id);

        // prevent exposure of user's password
        user.password = null;

        revalidatePath(routes.home);
        revalidatePath(routes.settings);

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        logger(error.message)
    }
}

export const updateUser = async (updatesData, userId) => {
    await connectDb();

    const user = await User.findOne({ _id: userId });
    const isUser = userId.toString() !== user._id.toString()

    if (!user || isUser) {
        throw new Error("Unauthorized access");
    }

    const { firstName, middleName, lastName } = extractNameParts(updatesData.fullName);

    const newProfile = {
        ...updatesData,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        password: user.password,
        modifiedAt: new Date(),
    }


    const updatedUser = await User.findByIdAndUpdate(userId, newProfile, { new: true });

    // create an activity object
    const activity = {
        performedBy: {
            userId: userId,
            userName: `You`,
        },
        type: 'Updates',
        purpose: `You updated your profile`,
        companyId: user.company._id,
    };

    await createActivity(activity);

    revalidatePath(`${routes.home}`);

    return JSON.parse(JSON.stringify(updatedUser))
};