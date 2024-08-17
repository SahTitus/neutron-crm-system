import { Schema, model, models } from 'mongoose';

const recentActivitySchema = new Schema({
  performedBy: {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
  },
  type: { type: String, required: true },
  purpose: { type: String, required: true },
  companyId: { type: Schema.Types.ObjectId, required: true },
  //automatically remove documents after the specified duration
  createdAt: { type: Date, required: true, default: Date.now, index: { expires: '14d' } },
});

const RecentActivity = models.RecentActivity || model('RecentActivity', recentActivitySchema);

export default RecentActivity;
