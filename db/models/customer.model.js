import { leadSources } from '@lib/constants/optionValues';
import { Schema, model, models } from 'mongoose';

const customerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  status: { type: String, enum: ['Active', 'Inactive'], required: true },
  image: { type: String, required: false },
  image_id: { type: String, required: false },
  companyId: { type: Schema.Types.ObjectId, required: true },
  city: { type: String, required: true },
  source: { type: String, enum: leadSources },
  country: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required.'],
    match: [/^\d{10}$/, 'must be 10 digits and contain only numbers.']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create a customer model schema
const Customer = models.Customer || model('Customer', customerSchema);

export default Customer;