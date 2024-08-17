import { connectDb } from "@db";
import Employee from "@db/models/employee.model";
import User from "@db/models/user.model";

export const verifyActionPerformer = async (performerId) => {
    await connectDb();

    const performer = await User.findOne({ _id: performerId }) || await Employee.findOne({ _id: performerId });

    if (!performer) {
        throw new Error("Unauthorized access");
    }

    let isAdmin = false;
    let companyId;

    if (performer instanceof User) {
        isAdmin = true;
        companyId = performer.company._id;
    } else if (performer instanceof Employee) {
        const company = await User.findOne({ 'company._id': performer.company._id });

        if (!company || company.company._id.toString() !== performer.company._id.toString()) {
            throw new Error("Unauthorized access");
        }

        const isEmployeeIncluded = company.employees.some(emp => emp.equals(performer._id));

        if (!isEmployeeIncluded) {
            throw new Error("Unauthorized access");
        }

        companyId = company._id;
    }

    return { performer, isAdmin, companyId };
};
