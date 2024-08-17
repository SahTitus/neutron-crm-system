import { Schema, model, models } from 'mongoose';

const taskSchema = new Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignTo: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Task = models.Task || model('Task', taskSchema);

export default Task;
