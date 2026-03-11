'use client';

import { routes } from '@lib/routes';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { login } from '@utils/helpers/login';
import { useSession } from 'next-auth/react';
import { Toast } from '@components/common/Toast';
import React, { useEffect, useState } from 'react';
import { Button } from '@components/common/Button';
import { registerUser, updateUser } from '@server_actions/user.action';
import { useStateContext } from '@redux/StateProvider';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '@components/ui/forms/InputField';
import sanitizeFormData from '@utils/helpers/sanitizeFormData';
import { signUpInitialValues } from '@lib/constants/initialValues';
import { SpinnerOverlay } from '@components/common/loaders/SpinnerOverlay';
import { isLoading, loginFailure, loginSuccess, stopLoading, updateProfile } from '@redux/features/authSlice';
import { signInValidationSchema, signUpValidationSchema } from '@utils/yupSchemas';
import { signInInputFields, signUpInputFields } from '@lib/constants/inputFieldsData';

export const AuthForm = ({ userId }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    const error = useSelector((state) => state.auth.error);
    const loading = useSelector((state) => state.auth.isLoading);

    const { setShowLoaderOverlay, setShowToast, setToastMsg, setToastPersist, setBase64String, isEditProfile, profileData, setEditProfile } = useStateContext();
    const [isSignUp, setIsSignUp] = useState(isEditProfile);
    const [initialState, setInitialState] = useState(signUpInitialValues)

    const session = useSession();

    const handleSubmit = async (values) => {
        dispatch(isLoading());

        try {
            //sanitize formData to avoid XSS attacks
            const exemptedKeys = ['image', 'image_id', '_id'];
            const sanitizedFormData = sanitizeFormData(values, exemptedKeys);

            const { email, password } = sanitizedFormData;

            if (isEditProfile && !!userId) {
                const updatedUser = await updateUser(values, userId)

                const updatedData = {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    companyId: updatedUser.company?._id.toString(),
                    firstName: updatedUser.firstName, // Add user Name to session
                    lastName: updatedUser.lastName, // Add user ID to session
                    role: updatedUser?.role, // Add user role to session
                    jobTitle: updatedUser?.jobTitle, // Add user role to session
                    image: updatedUser.image, // Add user image to session
                }

                //update users session
                dispatch(updateProfile(updatedData));
                setToastMsg(prevState => ({ ...prevState, message: `Profile updated successfully` }));
                setShowToast(true);
                router.push(routes.settings);
            } else if (isSignUp && !isEditProfile) {
                //if its sign up create a new user in db if successful login user
                const result = await registerUser(sanitizedFormData);

                if (result?.status === 200) {
                    // log user in
                    const loginResult = await login(email, password, loginFailure, dispatch);

                    if (loginResult?.ok) {
                        setShowToast(true);
                        setToastPersist(true);
                        setToastMsg({ isError: false, message: 'Account created successfully. Redirecting...' });
                        setRedirecting(true);
                        setShowLoaderOverlay(true);
                        setTimeout(() => {
                            setToastPersist(false);
                            router.push(routes.home);
                        }, 1200);
                    }
                }

                setBase64String('')
            } else {
                // log user in
                const loginResult = await login(email, password, loginFailure, dispatch);

                if (loginResult?.ok) {
                    setShowToast(true);
                    setToastPersist(true);
                    setToastMsg({ isError: false, message: 'Login successful. Redirecting...' });
                    setRedirecting(true);
                    setShowLoaderOverlay(true);
                    setTimeout(() => {
                        setToastPersist(false);
                        router.push(routes.home);
                    }, 1200);
                }
            };

        } catch (error) {
            setToastPersist(false);
            setToastMsg(({ isError: true, message: error.message }));
            setShowToast(true);
            dispatch(loginFailure(error.message));
        };
    };

    //a helper function to toggle login forms
    const toogleSignup = () => {
        setIsSignUp((prevState) => !prevState)
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    // Check if the user is authenticated and has a valid email in the session data,
    // then update user data and redirect to the home page.
    useEffect(() => {
        const { status, data } = session;

        if (status === "authenticated" && !!data?.user?.email && !isEditProfile) {
            dispatch(loginSuccess(data?.user));

            // Show a friendly toast before redirecting
            setShowToast(true);
            setToastPersist(true);
            setToastMsg({ isError: false, message: 'Login successful. Redirecting...' });
            setRedirecting(true);
            setShowLoaderOverlay(true);

            setTimeout(() => {
                setToastPersist(false);
                router.push(routes.home);
            }, 1200);
        }

        if (error) {
            setToastPersist(false);
            setToastMsg(({ isError: true, message: error }));
            setShowToast(true);
        }

        if (loading) {
            setShowLoaderOverlay(true);
        } else {
            setShowLoaderOverlay(false);
        }
    }, [session, error, loading]);

    const inputFields = isSignUp ? signUpInputFields : signInInputFields;
    const yupValidationSchema = isSignUp ? signUpValidationSchema : signInValidationSchema;


    useEffect(() => {
        if (isEditProfile && !!userId && !!profileData?._id) {
            const updatedProfile = {
                ...profileData,
                password: 'WrongPasswordWillBeUpdatedWithOriginalPassword@@12',
                confirmedPassword: 'WrongPasswordWillBeUpdatedWithOriginalPassword@@12',
                fullName: `${profileData.firstName} ${profileData.lastName}`,
            };

            // Set the state with the updated form item
            setInitialState(updatedProfile);
            setBase64String(updatedProfile?.image);
        }
    }, [userId, isEditProfile])

    let inputFieldsToDisplay = inputFields;

    if (isEditProfile) {
        inputFieldsToDisplay = inputFields.filter(field => field?.type !== 'password');
    }


    return (
        <div className={`${isSignUp ? 'justify-start' : 'justify-start'} relative w-1/2 bg-white flex flex-col  overflow-y-auto pb-10`}>
            <Toast />

            <Formik
                onSubmit={handleSubmit}
                initialValues={initialState}
                validationSchema={yupValidationSchema}
                enableReinitialize={true}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col w-full  px-28 pt-8 z-10">
                        <h2 className="text-2xl font-bold mb-4 text-[#192037]">{isSignUp ? 'Sign up to Neutron' : 'Log in to Neutron'}</h2>

                        <div className="grid grid-cols-2 gap-4">
                            {inputFieldsToDisplay?.map((field) => (
                                <div key={`${field.fieldName}multi`} className={`${field.layout === 'row' ? 'col-span-2' : 'col-span-1'}`}>
                                    <InputField
                                        key={field.fieldName}
                                        fieldName={field.fieldName}
                                        className='bg-slate-200 appearance-none border rounded border-slate-500 w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                        label={field.label}
                                        name={`${!!field?.objectLabel?.length ? field?.objectLabel + '.' : ''}${field.fieldName}`}
                                        type={field.type}
                                        isSignUp={true}
                                        labelStyles='block text-gray-500 dark:text-gray-700 mb-1'
                                        placeholder={field.placeholder}
                                        options={field.options}
                                        isRequired={field.required}
                                        showPassword={showPassword}
                                        togglePasswordVisibility={togglePasswordVisibility}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button
                            type="submit"
                            className={`w-2/5 ml-auto bg-green-500 text-white mt-4  py-3 px-6 rounded-full font-medium hover:bg-green-600 transition duration-300 ${isSubmitting || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            label={isSubmitting ? `${isEditProfile ? 'Updating...' : 'Submitting...'}` : `${isEditProfile ? 'Save Changes' : 'Submit'}`}
                            ariaLabel={isSubmitting ? `${isEditProfile ? 'Updating...' : 'Submitting...'}` : `${isEditProfile ? 'Save Changes' : 'Submit'}`}
                        />

                        <hr className='h-[1px] w-full my-4 mx-auto  border-none bg-gray-400 dark:bg-gray-300' />
                        <div className={`flex text-gray-${isSignUp ? '200' : '400'} items-center gap-4 md:w-[70%] max-w-xl`}>
                            {isSignUp ? <p>Already have an Account?</p> : <p>New here?</p>}
                            <p onClick={toogleSignup} className={`text-green-500 flex items-center justify-center text-base font-bold   cursor-pointer`}>{isSignUp ? 'Sign in' : 'Sign up'}</p>
                        </div>
                    </Form>
                )}
            </Formik>
            <svg className="fixed bottom-0 h-[300px] w-full">
                <path fill="#192037" fillOpacity="1" d="M0,224L48,192C96,160,192,96,288,106.7C384,117,480,203,576,218.7C672,235,768,181,864,154.7C960,128,1056,128,1152,117.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <SpinnerOverlay />
        </div>
    );
};