import { leadSources } from '@lib/constants/optionValues';
import * as Yup from 'yup';

const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

export const signUpValidationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .matches(passwordRegExp, 'Password must contain at least 6 characters, one uppercase, one lowercase, and one number')
        .required('Password is required'),
    confirmedPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    phoneNumber: Yup.string().nullable(),
    jobTitle: Yup.string().nullable(),
    image: Yup.mixed().required('Profile image is required'),
    image_id: Yup.string().nullable(),
    company: Yup.object().shape({
        companyName: Yup.string().nullable(),
        industry: Yup.string().required('Industry is required'),
        country: Yup.string().required('Country is required'),
        region: Yup.string().required('State/Region is required'),
        town: Yup.string().required('City/Town is required')
    })
});

export const signInValidationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .matches(passwordRegExp, 'Password must contain at least 6 characters, one uppercase, one lowercase, and one number')
        .required('Password is required')
});

export const leadValidationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().nullable(),
    // gender: Yup.string().oneOf(['Male', 'Female'], 'Invalid gender').required('Gender is required'),
    // country: Yup.string().required('Country is required'),
    status: Yup.string().nullable(),
    source: Yup.string().nullable(),
    notes: Yup.string().nullable(),
});

// Custom validation for dates not in the past
const dateNotInPast = (message) => {
    return Yup.date().min(new Date(), message);
};

// Custom validation for time not in the past
const timeNotInPast = (message) => {
    return Yup.string().test('is-not-past-time', message, function (value) {
        const { path, parent } = this;
        const currentDate = new Date();
        const taskDate = new Date(parent.date);
        const [hours, minutes] = value.split(':').map(Number);
        taskDate.setHours(hours, minutes);

        return taskDate >= currentDate;
    });
};

export const campaignValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    startDate: dateNotInPast('Start Date cannot be in the past').required('Start Date is required'),
    endDate: Yup.date()
        .required('End Date is required')
        .test('is-greater', 'End Date cannot be before Start Date', function (value) {
            const { startDate } = this.parent;
            return !startDate || !value || new Date(value) >= new Date(startDate);
        }),
    subject: Yup.string().required('Subject is required'),
    content: Yup.string().required('Content is required'),
});

export const customerValidationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    gender: Yup.string().oneOf(['Male', 'Female'], 'Invalid gender').required('Gender is required'),
    status: Yup.string().oneOf(['Active', 'Inactive'], 'Invalid status').required('Status is required'),
    phoneNumber: Yup.string().nullable(),
    image: Yup.mixed().required('Image is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    company: Yup.string().nullable(),
    source: Yup.string().oneOf(leadSources).required('Source is required'),
});

export const employeeValidationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().nullable(),
    gender: Yup.string().oneOf(['Male', 'Female'], 'Invalid gender').required('Gender is required'),
    role: Yup.string().required('Role is required'),
    password: Yup.string()
        .matches(passwordRegExp, 'Password must contain at least 6 characters, one uppercase, one lowercase, and one number')
        .required('Password is required'),
    confirmedPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    image: Yup.mixed().required('Image is required'),
});

export const opportunityValidationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    probability: Yup.number().required('Probability is required').min(0, 'Probability must be at least 0').max(100, 'Probability cannot exceed 100'),
    stage: Yup.string().nullable(),
    closeDate: dateNotInPast('Close Date cannot be in the past').nullable(),
    // country: Yup.string().required('Country is required'),
    notes: Yup.string().nullable(),
});

export const taskValidationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    date: dateNotInPast('Date cannot be in the past').required('Date is required'),
    time: timeNotInPast('Time cannot be in the past').required('Time is required'),
    assignTo: Yup.string().email('Invalid email').required('Assign To (assignee email) is required'),
    description: Yup.string().required('Description is required'),
});
