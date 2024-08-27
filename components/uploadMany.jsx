'use client'
import React from 'react';
import { faker } from '@faker-js/faker';
import { createMultipleCampaigns } from '@server_actions/campaign.action';
import { useSelector } from 'react-redux';
import { createMultipleLeads } from '@server_actions/lead.action';
import { countries, leadSources, leadStatuses, opportunityStages } from '@lib/constants/optionValues';
import { createMultipleCustomers } from '@server_actions/customer.action';
import { createMultipleOpportunities } from '@server_actions/opportunity.action';
import { createMultipleTasks } from '@server_actions/task.action';


const taskTitles = [
    'Finalize Project Timeline',
    'Budget Report Review',
    'Client Meeting Preparation',
    'Customer Feedback Analysis',
    'Product Launch Organization',
    'Marketing Strategy Development',
    'Technical Documentation Completion',
    'Product Performance Discussion',
    'Team Building Workshop',
    'Website Usability Testing',
    'Internal Audit Planning',
    'Quarterly Financial Review',
    'Sales Data Analysis',
    'Brand Awareness Campaign',
    'Risk Management Strategy',
    'Supply Chain Optimization',
    'Employee Training Session',
    'Annual Performance Evaluation',
    'IT Security Assessment',
    'New Product Development',
];

const taskDescriptions = [
    'Coordinate with the team to finalize the project timeline.',
    'Review the latest budget report and provide feedback.',
    'Prepare materials for the upcoming client meeting.',
    'Analyze customer feedback to improve service quality.',
    'Organize the product launch event with the marketing team.',
    'Develop a comprehensive marketing strategy for the next quarter.',
    'Complete the technical documentation for the new feature.',
    'Discuss potential improvements to enhance product performance.',
    'Plan and conduct a team building workshop to boost morale.',
    'Perform usability testing on the company website.',
    'Prepare for the upcoming internal audit.',
    "Review the company`s financial performance for the quarter.",
    'Analyze sales data to identify trends and opportunities.',
    'Create and implement a brand awareness campaign.',
    'Develop a risk management strategy for the company.',
    'Optimize the supply chain for increased efficiency.',
    'Conduct a training session for new employees.',
    'Evaluate employee performance for the annual review.',
    'Assess IT security protocols and suggest improvements.',
    'Develop a plan for the introduction of a new product.',
];


// Function to generate a single campaign


const generateCampaign = () => ({
    name: faker.company.catchPhrase(),
    startDate: faker.date.future(),
    endDate: faker.date.future(),
    subject: faker.company.bsBuzz(),
    content: `
Dear Customer,

We are excited to introduce our latest campaign aimed at enhancing your experience with our services. Our goal is to provide you with exceptional value and support. 

Here are a few highlights of what we have in store for you:
- ${faker.company.bsAdjective()} ${faker.company.bsNoun()}
- ${faker.company.bsAdjective()} ${faker.company.bsNoun()}
- ${faker.company.bsAdjective()} ${faker.company.bsNoun()}

We believe these new features will significantly improve how you interact with us and help us serve you better. 

Thank you for being a valued customer.

Best regards,
The CRM Team
`,
    sent_count: faker.datatype.number({ min: 0, max: 100 }),
    open_count: faker.datatype.number({ min: 0, max: 100 }),
    click_count: faker.datatype.number({ min: 0, max: 100 }),
    createdAt: faker.date.past()
});

// function generateGhanaPhoneNumber() {
//     const prefixes = ['24', '26', '27', '50', '54', '55', '56', '57', '59', '20', '23', '28', '29'];
//     const randomPrefix = faker.helpers.arrayElement(prefixes); // Select a random prefix
//     const randomDigits = faker.random.numeric(7); // Generate 7 random digits
//     return `0${randomPrefix}${randomDigits}`;
// }

// const generateCampaign = (img) => ({
//     firstName: faker.name.firstName(),
//     lastName: faker.name.lastName(),
//     email: faker.internet.email(),
//     image: faker.image.avatar(),
//     image_id: faker.datatype.uuid(),
//     phoneNumber: generateGhanaPhoneNumber(),
//     status: faker.helpers.arrayElement(leadStatuses),
//     source: faker.helpers.arrayElement(leadSources),
//     notes: faker.lorem.sentence(),
//     createdAt: faker.date.past()
// });


// const generateOpportunity = () => ({
//   firstName: faker.name.firstName(),
//   lastName: faker.name.lastName(),
//   email: faker.internet.email(),
//   amount: faker.commerce.price(1000, 50000, 2), // Random amount between 1000 and 50000
//   probability: faker.random.number({ min: 0, max: 100 }),
//   stage: faker.helpers.arrayElement(opportunityStages),
//   image: faker.image.avatar(),
//   image_id: faker.datatype.uuid(),
//   closeDate: faker.date.future(), // Random future date
//   companyId: new mongoose.Types.ObjectId(), // Generates a new ObjectId
//   phoneNumber: generateGhanaPhoneNumber(),
//   notes: faker.lorem.sentence(),
// });

const generateOpportunity = (img) => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    amount: parseFloat(faker.commerce.price(1000, 50000)), // Random amount between 1000 and 50000
    probability: faker.number.int({ min: 0, max: 100 }),
    stage: faker.helpers.arrayElement(opportunityStages),
    image: faker.image.avatar(),
    image_id: faker.datatype.uuid(),
    closeDate: faker.date.future(), // Random future date
    companyId: '6692a56c72e3572efd896afd', // Generates a new ObjectId
    phoneNumber: generateGhanaPhoneNumber(),
    notes: generateMeaningfulNote(),
});

// Function to generate a valid Ghanaian phone number
function generateGhanaPhoneNumber() {
    const prefixes = ['24', '26', '27', '50', '54', '55', '56', '57', '59', '20', '23', '28', '29'];
    const randomPrefix = faker.helpers.arrayElement(prefixes); // Select a random prefix
    const randomDigits = faker.random.numeric(7); // Generate 7 random digits
    return `0${randomPrefix}${randomDigits}`;
}

//   // Function to generate a meaningful note
// function generateMeaningfulNote() {
//     const actions = ['Discussed potential for collaboration with', 'Reviewed financial forecasts for', 'Evaluated strategic alignment with', 'Explored market opportunities for', 'Conducted initial needs assessment for'];
//     const targets = ['the client', 'the customer', 'the partner', 'the lead', 'the prospect'];
//     const outcomes = [
//       'and identified a strong alignment with their business goals.',
//       'with promising insights for further engagement.',
//       'which shows potential for a successful partnership.',
//       'indicating a positive outlook for future negotiations.',
//       'and determined next steps for proposal development.',
//     ];

//     // Construct a meaningful sentence by combining action, target, and outcome
//     return `${faker.helpers.arrayElement(actions)} ${faker.helpers.arrayElement(targets)} ${faker.helpers.arrayElement(outcomes)}`;
//   }


// // Function to generate a random task
// const generateTask = () => ({
//     date: generateRandomDate(),
//     time: faker.date.recent().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Random time of the day
//     title: faker.helpers.arrayElement(taskTitles),
//     description: faker.helpers.arrayElement(taskDescriptions),
//     assignTo: faker.helpers.arrayElement(['koobibinieric@gmail.com', 'sahtitus58@gmail.com']),
//     companyId: '6692a56c72e3572efd896afd', // Predefined companyId
// });

// Function to generate a random date between today and the end of 2026
function generateRandomDate() {
    const startDate = new Date();
    const endDate = new Date('2026-12-31');
    const randomDate = faker.date.between({ from: startDate, to: endDate });
    return randomDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
}


// Function to generate multiple campaigns
const generateCustomers = (count) => {
    const campaigns = [];
    for (let i = 0; i < count; i++) {
        campaigns.push(generateCampaign(`https://i.pravatar.cc/40?img=${i}`));
    }
    return campaigns;
};

const CampaignUploader = () => {
    const user = useSelector((state) => state.auth.user);
    const userId = user?.id;

    const handleUpload = async () => {
        const campaigns = generateCustomers(100);
        try {
            const response = await createMultipleCampaigns(campaigns, userId);

        } catch (error) {
            console.error('Error uploading campaigns:', error);
        }
    };

    return (
        <button
            aria-label='Generate and Upload many data'
            className='bg-red-500'
            onClick={handleUpload}>
            Generate and Upload Campaigns
        </button>
    );
};

export default CampaignUploader;
