import { userRoles } from '@lib/constants/optionValues';
import { Schema, model, models } from 'mongoose';

// employee Schema
const employeeSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    image: { type: String, required: false },
    image_id: { type: String, required: false },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required.'],
        match: [/^\d{10}$/, 'must be 10 digits and contain only numbers.']
    },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    password: { type: String, required: true },
    jobTitle: { type: String, required: true },
    role: { type: String, enum: userRoles, },
    companyId: { type: Schema.Types.ObjectId, ref: 'User.company', required: true } // Reference to company's _id inside User
});

// Model
const Employee = models.Employee || model('Employee', employeeSchema);

export default Employee;