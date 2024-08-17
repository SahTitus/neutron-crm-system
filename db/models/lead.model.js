import { Schema, model, models } from 'mongoose';
import { leadSources, leadStatuses } from '@lib/constants/optionValues';

const leadSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    image_id: { type: String, required: false },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required.'],
        match: [/^\d{10}$/, 'must be 10 digits and contain only numbers.']
    },
    status: { type: String, enum: leadStatuses, default: 'New' },
    source: { type: String, enum: leadSources },
    notes: { type: String, required: false },
    companyId: { type: Schema.Types.ObjectId, required: true },
    createdByAdmin: { type: Boolean, required: true },
    creatorId: { type: Schema.Types.ObjectId, }, // Reference to the User or Employee who created the campaign, its determine by creatorByAdmin bool
    createdAt: { type: Date, default: Date.now }
});

// Virtual to conditionally reference User or Employee
// a virtual field named creator for the leadSchema
leadSchema.virtual('creator', {
    ref: (doc) => doc.isAdmin ? 'User' : 'Employee',
localField: 'creatorId',
    foreignField: '_id',
    justOne: true
});

const Lead = models.Lead || model('Lead', leadSchema);

export default Lead;