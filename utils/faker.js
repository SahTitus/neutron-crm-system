import { faker } from '@faker-js/faker';

// 1. **Campaign Data**
export const generateCampaign = () => ({
  name: faker.company.catchPhrase(),
  startDate: faker.date.future(),
  endDate: faker.date.future(),
  subject: faker.lorem.sentence(),
  content: faker.lorem.paragraph(),
  sent_count: faker.datatype.number({ min: 0, max: 10000 }),
  open_count: faker.datatype.number({ min: 0, max: 10000 }),
  click_count: faker.datatype.number({ min: 0, max: 10000 }),
  createdAt: faker.date.past()
});

console.log(generateCampaign());

// 2. **Customer Data**

export const generateCustomer = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  gender: faker.helpers.randomize(['Male', 'Female']),
  status: faker.helpers.randomize(['Active', 'Inactive']),
  image: faker.image.avatar(),
  image_id: faker.datatype.uuid(),
  companyId: faker.datatype.uuid(),
  city: faker.address.city(),
  source: faker.helpers.randomize(['Referral', 'Advertisement', 'Organic']),
  country: faker.address.country(),
  phoneNumber: faker.phone.phoneNumber('##########'),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent()
});

console.log(generateCustomer());

// 3. **Employee Data**

export const generateEmployee = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  country: faker.address.country(),
  city: faker.address.city(),
  image: faker.image.avatar(),
  image_id: faker.datatype.uuid(),
  phoneNumber: faker.phone.phoneNumber('##########'),
  gender: faker.helpers.randomize(['Male', 'Female']),
  password: faker.internet.password(),
  jobTitle: faker.name.jobTitle(),
  role: faker.helpers.randomize(['admin', 'user']),
  companyId: faker.datatype.uuid()
});

console.log(generateEmployee());

// 4. **Lead Data**

export const generateLead = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  image: faker.image.avatar(),
  image_id: faker.datatype.uuid(),
  phoneNumber: faker.phone.phoneNumber('##########'),
  status: faker.helpers.randomize(['New', 'Contacted', 'Qualified', 'Lost']),
  source: faker.helpers.randomize(['Referral', 'Advertisement', 'Organic']),
  notes: faker.lorem.sentence(),
  companyId: faker.datatype.uuid(),
  createdAt: faker.date.past()
});

console.log(generateLead());

// 5. **Opportunity Data**

export const generateOpportunity = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  amount: faker.datatype.number({ min: 1000, max: 100000 }),
  probability: faker.datatype.number({ min: 0, max: 100 }),
  stage: faker.helpers.randomize(['Prospecting', 'Qualification', 'Proposal', 'Closed']),
  image: faker.image.avatar(),
  image_id: faker.datatype.uuid(),
  closeDate: faker.date.future(),
  companyId: faker.datatype.uuid(),
  phoneNumber: faker.phone.phoneNumber('##########'),
  notes: faker.lorem.sentence(),
  createdAt: faker.date.past()
});

console.log(generateOpportunity());

// 6. **Recent Activity Data**

export const generateRecentActivity = () => ({
  performedBy: {
    userId: faker.datatype.uuid(),
    userName: `${faker.name.firstName()} ${faker.name.lastName()}`
  },
  type: faker.helpers.randomize(['Employee', 'Lead', 'Opportunity', 'Customer']),
  purpose: faker.lorem.sentence(),
  companyId: faker.datatype.uuid(),
  createdAt: faker.date.recent()
});

console.log(generateRecentActivity());

// 7. **Task Data**

export const generateTask = () => ({
  date: faker.date.future().toISOString().split('T')[0],
  time: faker.time.recent(),
  title: faker.lorem.words(),
  description: faker.lorem.sentence(),
  assignTo: faker.name.firstName(),
  companyId: faker.datatype.uuid(),
  createdAt: faker.date.past()
});

console.log(generateTask());

// 8. **Ticket Data**

export const generateTicket = () => ({
  customer_id: faker.datatype.uuid(),
  title: faker.lorem.words(),
  description: faker.lorem.sentence(),
  status: faker.helpers.randomize(['Open', 'In Progress', 'Closed']),
  priority: faker.helpers.randomize(['Low', 'Medium', 'High']),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  dueDate: faker.date.future(),
  companyId: faker.datatype.uuid(),
  comments: [
    {
      text: faker.lorem.sentence(),
      author: faker.datatype.uuid(),
      createdAt: faker.date.past()
    }
  ]
});

console.log(generateTicket());

// 9. **User Data**

export const generateUser = () => ({
  firstName: faker.name.firstName(),
  middleName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  image: faker.image.avatar(),
  image_id: faker.datatype.uuid(),
  phoneNumber: faker.phone.phoneNumber('##########'),
  jobTitle: faker.name.jobTitle(),
  role: faker.helpers.randomize(['admin', 'user']),
  company: {
    companyName: faker.company.companyName(),
    industry: faker.commerce.department(),
    country: faker.address.country(),
    region: faker.address.state(),
    town: faker.address.city(),
    employees: [faker.datatype.uuid()]
  },
  createdAt: faker.date.past()
});

console.log(generateUser());


const generateCampaigns = (count) => {
    const campaigns = [];
    for (let i = 0; i < count; i++) {
      campaigns.push(generateCampaign());
    }
    return campaigns;
  };