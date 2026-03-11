'use client'

import InputField from './InputField';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { logger } from '@utils/helpers/log';
import { Button } from '@components/common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useStateContext } from '@redux/StateProvider';
import { formFields } from '@lib/constants/inputFieldsData';
import { createActivity } from '@redux/features/recentActivitySlice';
import { Toast } from '@components/common/Toast';
import { SpinnerOverlay } from '@components/common/loaders/SpinnerOverlay';
import { sendEmail } from '@lib/sendEmail';

export const DynamicForm = () => {
    const user = useSelector((state) => state.auth.user);

    const [showPassword, setShowPassword] = useState(false);
    const { recepientEmail, setRecepientEmail, setShowLoaderOverlay, formType, formItemToEdit, setFormType, setFormSubmitted, setToastMsg, setBase64String } = useStateContext();

    const dispatch = useDispatch();
    const router = useRouter();

    const userId = user?.id;
    const userCompanyId = user?.companyId;

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleFormType = (newFormType) => {
        setFormType(newFormType);
    };

    // dynamically change input fields based on form type slected
    const currentFields = formFields[formType];
    const [initialState, setInitialState] = useState(currentFields.initialState);


    const handleSubmit = async (values, { resetForm }) => {
        setShowLoaderOverlay(true);
        try {
            if (!!recepientEmail.length) {
                const emailData = {
                    ...values,
                    recepientEmail,
                    userCompanyId
                }

                await sendEmail(emailData)
            }

            const result = await currentFields.action(values, userId, !!formItemToEdit)

            dispatch(currentFields.dispatch({ ...result, userCompanyId }, !!formItemToEdit));

            dispatch(createActivity(result?.activity));
            setShowLoaderOverlay(false);

            // reset the form on successful submission
            resetForm({ values: initialState });
            setBase64String('');
            setRecepientEmail("");
            setFormSubmitted(true);
            setShowToast(true);
            setToastMsg(prevState => ({ ...prevState, message: `${formItemToEdit ? 'Update' : 'Post'} successful` }));

            // Refresh server data so lists update immediately without manual reload
            router.refresh();
        } catch (error) {
            setShowLoaderOverlay(false);
            setShowToast(true);
            setToastMsg(({ isError: true, message: `Fail to ${formItemToEdit ? 'update' : 'post'}` }));
            logger(error.message);
        }
    };

    useEffect(() => {
        if (formItemToEdit) {
            // Format the closeDate to 'yyyy-mm-dd' format
            const formattedCloseDate = formItemToEdit.closeDate?.split("T")[0];

            // Update the formItemToEdit with the formatted date
            const updatedFormItemToEdit = {
                ...formItemToEdit,
                closeDate: formattedCloseDate,
            };

            // Set the state with the updated form item
            setInitialState(updatedFormItemToEdit);
            setBase64String(updatedFormItemToEdit?.image);
        }
    }, [formItemToEdit])

    return (
        <div className='pb-10'>
            <Toast styles='fixed top-10 left-1/2 bg-red-500' />

            <div className='px-16 flex flex-col gap-3'>
                <div className='flex items-center gap-4'>
                    {['customer', 'lead', 'campaign'].map(type => (
                        <Button
                            key={type}
                            onClick={() => handleFormType(type)}
                            type="button"
                            className={`w-32 ${formType === type ? 'bg-green-600 hover:bg-green-500 text-white ' : 'bg-white border border-gray-400 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 dark:shadow-inner dark:shadow-slate-500'} text-base text-gray-800 dark:text-gray-300 py-2 rounded-lg transition duration-300 `}
                            label={type.charAt(0).toUpperCase() + type.slice(1)}
                            ariaLabel={`${type} form button`}
                            disabled={false}
                        />
                    ))}
                </div>

                <div className='flex items-center gap-4'>
                    {['opportunity', 'task'].map(type => (
                        <Button
                            key={type}
                            onClick={() => handleFormType(type)}
                            type="button"
                            className={`w-32 ${formType === type ? 'bg-green-600 hover:bg-green-500 text-white ' : 'bg-white border border-gray-400 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 dark:shadow-inner dark:shadow-slate-500'} text-base text-gray-800 dark:text-gray-300 py-2 rounded-lg transition duration-300 `}
                            label={type.charAt(0).toUpperCase() + type.slice(1)}
                            ariaLabel={`${type} form button`}
                            disabled={false}
                        />
                    ))}
                </div>
            </div>

            <Formik
                initialValues={initialState}
                validationSchema={currentFields.validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ isSubmitting, handleSubmit, setFieldValue }) => (
                    <Form className="flex flex-col w-full px-16 pt-8 z-10" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            {currentFields.fields.map((field) => (
                                <div key={`${field.fieldName} dynamic`} className={`${field.layout === 'row' ? 'col-span-2' : 'col-span-1'}`}>
                                    <InputField
                                        fieldName={field.fieldName}
                                        label={field.label}
                                        name={field.fieldName}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        options={field.options}
                                        isSignUp={false}
                                        isRequired={field.required}
                                        setFieldValue={setFieldValue}
                                        labelStyles='block text-gray-500 dark:text-gray-300 mb-1'
                                        className='bg-white dark:bg-slate-700 dark:text-gray-300 appearance-none border rounded border-slate-500 w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                        showPassword={showPassword}
                                        togglePasswordVisibility={togglePasswordVisibility}
                                    />
                                </div>
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className={`w-2/5 ml-auto bg-green-500 text-white mt-4 py-3 px-6 rounded-full font-medium hover:bg-green-600 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            label={isSubmitting ? `${formItemToEdit ? 'Saving...' : 'Submitting...'}` : `${formItemToEdit ? 'Save Changes' : 'Submit'}`}
                            ariaLabel={isSubmitting ? `${formItemToEdit ? 'Saving...' : 'Submitting...'}` : `${formItemToEdit ? 'Save Changes' : 'Submit'}`}
                        />
                    </Form>
                )}
            </Formik>

            <SpinnerOverlay />
        </div>
    );
};