import { opportunityStages } from '@lib/constants/optionValues';
import { Schema, model, models } from 'mongoose';

const opportunitySchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }, email: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    probability: { type: Number, required: true, min: 0, max: 100 },
    stage: { type: String, enum: opportunityStages, default: 'Prospecting' },
    image: { type: String, required: false },
    image_id: { type: String, required: false },
    closeDate: { type: Date },
    companyId: { type: Schema.Types.ObjectId, required: true },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required.'],
        match: [/^\d{10}$/, 'must be 10 digits and contain only numbers.']
    },
    notes: { type: String }, // Optional notes field
    createdByAdmin: { type: Boolean, required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who created the opportunity
    createdAt: { type: Date, default: Date.now }
});

// Virtual to conditionally reference User or Employee
// a virtual field named creator for the opportunitySchema
opportunitySchema.virtual('creator', {
    ref: (doc) => doc.isAdmin ? 'User' : 'Employee',
    localField: 'creatorId',
    foreignField: '_id',
    justOne: true
});

const Opportunity = models.Opportunity || model('Opportunity', opportunitySchema);

export default Opportunity;