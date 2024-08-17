import { userRoles } from '@lib/constants/optionValues';
import { Schema, model, models } from 'mongoose';

// Company Schema
const companySchema = new Schema({
  companyName: { type: String },
  industry: { type: String, required: true },
  country: { type: String, required: true },
  region: { type: String, required: true },
  town: { type: String, required: true },
  // employee array with references to employee model
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
}, { _id: true });

// User Schema
const userSchema = new Schema({
  firstName: { type: String, required: [true, 'Full name is required.'] },
  middleName: { type: String, required: false },
  lastName: { type: String, required: [true, 'Full name is required.'] },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  image_id: { type: String, required: false },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required.'],
    match: [/^\d{10}$/, 'must be 10 digits and contain only numbers.']
  },
  jobTitle: { type: String, required: true },
  role: { type: String, enum: userRoles, default: 'admin' },
  company: companySchema,
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = models.User || model('User', userSchema);

export default User;