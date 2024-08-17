export const signUpInitialValues = {
    fullName: '',
    email: '',
    password: '',
    confirmedPassword: '',
    phoneNumber: '',
    jobTitle: '',
    image: null,
    image_id: '',
    company: {
        companyName: '',
        industry: '',
        country: '',
        region: '',
        town: ''
    }
};

export const leadInitialState = {
    firstName: '',
    lastName: '',
    email: '',
    // gender: '',
    phoneNumber: '',
    // country: '',
    status: '',
    source: '',
    notes: '',
};

export const campaignInitialState = {
    name: '',
    startDate: null,
    endDate: null,
    subject: '',
    content: '',
};

export const customerInitialState = {
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    status: '',
    phoneNumber: '',
    image: null,
    country: '',
    city: '',
    company: '',
    source: '',
};

export const employeeInitialState = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    role: '',
    password: '',
    confirmedPassword: '',
    country: '',
    city: '',
    image: null,
};

export const opportunityInitialState = {
    firstName: '',
    lastName: '',
    amount: '',
    probability: '',
    phoneNumber: '',
    stage: '',
    closeDate: '20-06-2030T09:38:01.137Z',
    // country: '',
    notes: '',
};

export const taskInitialState = {
    title: '',
    date: null,
    time: '',
    assignTo: '',
    description: '',
};