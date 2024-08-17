import { createTask } from "@server_actions/task.action";
import { createEmployee } from "@server_actions/employee.action";
import { createOpportunity, updateOpportunity } from "@server_actions/opportunity.action";
import { createLead, updateLead } from "@server_actions/lead.action";
import { createCampaign } from "@server_actions/campaign.action";
import { addTask } from "@redux/features/taskSlice";
import { addCampaign } from "@redux/features/campaignSlice";
import { addOpportunity, saveOpportunityUpdate } from "@redux/features/opportunitySlice";
import { addLead, saveLeadUpdate } from "@redux/features/leadSlice";
import { addEmployee } from "@redux/features/employeeSlice";
import { addCustomer, saveCustomerUpdate } from "@redux/features/customerSlice";
import {
    countries,
    employeeRoles,
    industries,
    leadSources,
    leadStatuses,
    opportunityStages
} from "./optionValues";
import {
    campaignInitialState,
    customerInitialState,
    employeeInitialState,
    leadInitialState,
    opportunityInitialState,
    taskInitialState
}
    from "./initialValues";
import {
    campaignValidationSchema,
    customerValidationSchema,
    employeeValidationSchema,
    leadValidationSchema,
    opportunityValidationSchema,
    taskValidationSchema
} from "@utils/yupSchemas";
import { createCustomer, updateCustomer } from "@server_actions/customer.action";

export const signUpInputFields = [
    { fieldName: 'image', label: 'Profile image', type: 'file', placeholder: '', options: [], layout: 'row', required: true, multiselect: false, },
    { fieldName: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe', options: [], layout: 'row', required: true, multiselect: false },
    { fieldName: 'email', label: 'Email', type: 'text', placeholder: 'john.doe@example.com', options: [], layout: 'column', required: true, multiselect: false },
    { fieldName: 'phoneNumber', label: 'Phone Number', type: 'text', placeholder: '123-456-7890', options: [], layout: 'column', required: false, multiselect: false },
    { fieldName: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', options: [], layout: 'column', required: true, multiselect: false },
    { fieldName: 'confirmedPassword', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter your password', options: [], layout: 'column', required: true, multiselect: false },
    { fieldName: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Your Company', options: [], layout: 'row', objectLabel: 'company', required: false, multiselect: false },
    { fieldName: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Your Job Title', options: [], layout: 'column', required: false, multiselect: false },
    { fieldName: 'industry', label: 'Industry', type: 'text', placeholder: 'Select your industry', options: industries, objectLabel: 'company', layout: 'column', required: true, multiselect: false },
    { fieldName: 'country', label: 'Country', objectLabel: 'company', type: 'text', placeholder: 'Select your country', options: countries, layout: 'column', required: true, multiselect: false },
    { fieldName: 'region', label: 'State/Region', type: 'text', placeholder: 'Your State/Region', options: [], layout: 'column', objectLabel: 'company', required: true, multiselect: false },
    { fieldName: 'town', label: 'City/Town', type: 'text', placeholder: 'Your City/Town', options: [], objectLabel: 'company', layout: 'row', required: true, multiselect: false },
];

export const signInInputFields = [
    { fieldName: 'email', label: 'Email', type: 'text', placeholder: 'Enter your email', options: [], layout: 'row', required: true, multiselect: false },
    { fieldName: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', options: [], layout: 'row', required: true, multiselect: false },
    // { fieldName: 'isEmployee', label: 'Are you an employee?', type: 'checkbox', placeholder: '', options: [], layout: 'row', required: true, multiselect: false },
];

export const leadInputFields = [
    { fieldName: 'firstName', label: 'First Name', type: 'text', options: [], placeholder: 'John', layout: 'column', required: true },
    { fieldName: 'lastName', label: 'Last Name', type: 'text', options: [], placeholder: 'Doe', layout: 'column', required: true },
    { fieldName: 'email', label: 'Email', type: 'text', options: [], placeholder: 'john.doe@example.com', layout: 'column', required: true },
    { fieldName: 'phoneNumber', label: 'Phone', type: 'text', options: [], placeholder: '123-456-7890', layout: 'column', required: false },
    // { fieldName: 'gender', label: 'Gender', type: 'text', options: ['Male', 'Female'], placeholder: 'Select gender', layout: 'column', required: true },
    // { fieldName: 'country', label: 'Country', type: 'text', options: countries, placeholder: 'Country Name', layout: 'column', required: true },
    { fieldName: 'status', label: 'Status', type: 'text', options: leadStatuses, placeholder: 'Select a status', layout: 'column', required: false },
    { fieldName: 'source', label: 'Source', type: 'text', options: leadSources, placeholder: 'Select source', layout: 'column', required: false },
    { fieldName: 'image', label: 'Image', type: 'file', options: [], placeholder: '', layout: 'row', required: true },
    { fieldName: 'notes', label: 'Notes', type: 'textarea', options: [], placeholder: 'Additional information', layout: 'row', required: false },
];

export const campaignInputFields = [
    { fieldName: 'name', label: 'Name', type: 'text', options: [], placeholder: 'Campaign Name', layout: 'row', required: true },
    { fieldName: 'startDate', label: 'Start Date', type: 'date', options: [], placeholder: '', layout: 'column', required: true },
    { fieldName: 'endDate', label: 'End Date', type: 'date', options: [], placeholder: '', layout: 'column', required: true },
    { fieldName: 'subject', label: 'Subject', type: 'text', options: [], placeholder: 'Campaign Subject', layout: 'row', required: true },
    { fieldName: 'content', label: 'Content', type: 'textEditor', options: [], placeholder: 'Campaign Content', layout: 'row', required: true },
];

export const customerInputFields = [
    { fieldName: 'firstName', label: 'First Name', type: 'text', options: [], placeholder: 'John', layout: 'column', required: true },
    { fieldName: 'lastName', label: 'Last Name', type: 'text', options: [], placeholder: 'Doe', layout: 'column', required: true },
    { fieldName: 'email', label: 'Email', type: 'text', options: [], placeholder: 'john.doe@example.com', layout: 'column', required: true },
    { fieldName: 'gender', label: 'Gender', type: 'text', options: ['Male', 'Female'], placeholder: 'Select gender', layout: 'column', required: true },
    { fieldName: 'status', label: 'Status', type: 'text', options: ['Active', 'Inactive'], placeholder: 'Select status', layout: 'column', required: true },
    { fieldName: 'phoneNumber', label: 'Phone', type: 'text', options: [], placeholder: '123-456-7890', layout: 'column', required: true },
    { fieldName: 'image', label: 'Image', type: 'file', options: [], placeholder: '', layout: 'row', required: true },
    { fieldName: 'country', label: 'Country', type: 'text', options: countries, placeholder: 'Country Name', layout: 'column', required: true },
    { fieldName: 'city', label: 'City', type: 'text', options: [], placeholder: 'City Name', layout: 'column', required: true },
    { fieldName: 'company', label: 'Company', type: 'text', options: [], placeholder: 'Company Name', layout: 'column', required: false },
    { fieldName: 'source', label: 'Source', type: 'text', options: leadSources, placeholder: 'Select source', layout: 'column', required: true },
];

export const employeeInputFields = [
    { fieldName: 'firstName', label: 'First Name', type: 'text', options: [], placeholder: 'John', layout: 'column', required: true },
    { fieldName: 'lastName', label: 'Last Name', type: 'text', options: [], placeholder: 'Doe', layout: 'column', required: true },
    { fieldName: 'email', label: 'Email', type: 'text', options: [], placeholder: 'john.doe@example.com', layout: 'column', required: true },
    { fieldName: 'phoneNumber', label: 'Phone', type: 'text', options: [], placeholder: '123-456-7890', layout: 'column', required: true },
    { fieldName: 'gender', label: 'Gender', type: 'text', options: ['Male', 'Female'], placeholder: 'Select gender', layout: 'column', required: true },
    { fieldName: 'role', label: 'Role', type: 'text', options: [employeeRoles[0]], placeholder: 'Assign a role', layout: 'column', required: true },
    { fieldName: 'password', label: 'Password', type: 'password', placeholder: "Create employee's password", options: [], layout: 'column', required: true, multiselect: false },
    { fieldName: 'confirmedPassword', label: 'Confirm Password', type: 'password', placeholder: "Re-enter employee's password", options: [], layout: 'column', required: true, multiselect: false },
    { fieldName: 'country', label: 'Country', type: 'text', options: countries, placeholder: 'Country Name', layout: 'column', required: true },
    { fieldName: 'city', label: 'City', type: 'text', options: [], placeholder: 'City Name', layout: 'column', required: true },
    { fieldName: 'image', label: 'Image', type: 'file', options: [], placeholder: '', layout: 'row', required: true },
];

export const opportunityInputFields = [
    { fieldName: 'firstName', label: 'First Name', type: 'text', options: [], placeholder: 'John', layout: 'column', required: true },
    { fieldName: 'lastName', label: 'Last Name', type: 'text', options: [], placeholder: 'Doe', layout: 'column', required: true },
    { fieldName: 'email', label: 'Email', type: 'text', options: [], placeholder: 'john.doe@example.com', layout: 'column', required: true },
    { fieldName: 'phoneNumber', label: 'Phone', type: 'text', options: [], placeholder: '123-456-7890', layout: 'column', required: true },
    { fieldName: 'amount', label: 'Amount', type: 'number', options: [], placeholder: '1000', layout: 'column', required: true },
    { fieldName: 'probability', label: 'Probability', type: 'number', options: [], placeholder: '50', layout: 'column', required: true },
    { fieldName: 'stage', label: 'Stage', type: 'text', options: opportunityStages, placeholder: 'Select a stage', layout: 'column', required: false },
    { fieldName: 'closeDate', label: 'Close Date', type: 'date', options: [], placeholder: '', layout: 'column', required: false },
    // { fieldName: 'country', label: 'Country', type: 'text', options: countries, placeholder: 'Country Name', layout: 'column', required: true },
    { fieldName: 'image', label: 'Image', type: 'file', options: [], placeholder: '', layout: 'row', required: true },
    { fieldName: 'notes', label: 'Notes', type: 'textarea', options: [], placeholder: 'Additional notes', layout: 'row', required: true },
];

export const taskInputFields = [
    { fieldName: 'title', label: 'Title', type: 'text', placeholder: 'Task Title', layout: 'row', required: true, options: [] },
    { fieldName: 'date', label: 'Date', type: 'date', placeholder: '', layout: 'column', required: true, options: [] },
    { fieldName: 'time', label: 'Time', type: 'time', placeholder: '', layout: 'column', required: true, options: [] },
    { fieldName: 'assignTo', label: 'Assign To (assignee email)', type: 'text', placeholder: 'quayson@gmail.com', layout: 'row', required: true, options: [] },
    { fieldName: 'description', label: 'Description', type: 'textarea', placeholder: 'Task Description', layout: 'row', required: true, options: [] },
];

export const formFields = {
    customer: {
        title: 'Customer',
        fields: customerInputFields,
        validationSchema: customerValidationSchema,
        initialState: customerInitialState,
        action: (values, userId, isChanges) => isChanges ? updateCustomer(values, userId) : createCustomer(values, userId),
        dispatch: (data, isChanges) => isChanges ? saveCustomerUpdate(data) : addCustomer(data),
    },
    opportunity: {
        title: 'Opportunity',
        fields: opportunityInputFields,
        validationSchema: opportunityValidationSchema,
        initialState: opportunityInitialState,
        action: (values, userId, isChanges) => {
            return isChanges
                ? updateOpportunity(values, userId)
                : createOpportunity(values, userId);
        },
        dispatch: (data, isChanges) => {
            return isChanges ? saveOpportunityUpdate(data) : addOpportunity(data);
        },
    },
    lead: {
        title: 'Lead',
        fields: leadInputFields,
        validationSchema: leadValidationSchema,
        initialState: leadInitialState,
        action: (values, userId, isChanges) => isChanges ? updateLead(values, userId) : createLead(values, userId),
        dispatch: (data, isChanges) => isChanges ? saveLeadUpdate(data) : addLead(data),

    },
    campaign: {
        title: 'Campaign',
        fields: campaignInputFields,
        validationSchema: campaignValidationSchema,
        initialState: campaignInitialState,
        action: (values, userId) => createCampaign(values, userId),
        dispatch: (data) => addCampaign(data),
    },
    employee: {
        title: 'Employee',
        fields: employeeInputFields,
        validationSchema: employeeValidationSchema,
        initialState: employeeInitialState,
        action: (values, userId) => createEmployee(values, userId),
        dispatch: (data) => addEmployee(data),
    },
    task: {
        title: 'Task',
        fields: taskInputFields,
        validationSchema: taskValidationSchema,
        initialState: taskInitialState,
        action: (values, userId, isChanges) => { isChanges ? createTask(values, userId) : createTask(values, userId) },
        dispatch: (data) => addTask(data),
    },
};