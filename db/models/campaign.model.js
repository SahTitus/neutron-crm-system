import { Schema, model, models } from "mongoose";

const campaignSchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    sent_count: { type: Number, default: 0 },
    open_count: { type: Number, default: 0 },
    click_count: { type: Number, default: 0 },
    companyId: { type: Schema.Types.ObjectId, required: true },
    createdByAdmin: { type: Boolean, required: true },
    creatorId: { type: Schema.Types.ObjectId, }, // Reference to the User or Employee who created the campaign, its determine by creatorByAdmin
    createdAt: { type: Date, default: Date.now }
});

// Virtual to conditionally reference User or Employee
// a virtual field named creator for the campaignSchema
campaignSchema.virtual('creator', {
    ref: (doc) => doc.isAdmin ? 'User' : 'Employee',
    localField: 'creatorId',
    foreignField: '_id',
    justOne: true
});

const Campaign = models.Campaign || model('Campaign', campaignSchema);

export default Campaign;