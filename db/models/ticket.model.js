const { ticketStatuses, ticketPriorities } = require('@lib/constants/optionValues');
import { Schema, model, models } from 'mongoose';

const ticketSchema = new Schema({
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ticketStatuses, default: 'Open' },
    priority: { type: String, enum: ticketPriorities, default: 'Medium' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true, },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: Schema.Types.ObjectId, required: true },
    comments: [{
        text: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }]
});

const Ticket = models.Ticket || model('Ticket', ticketSchema);

export default Ticket;