'use client'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone';
import Image from 'next/image'
import { useFormikContext } from 'formik';
import { useStateContext } from '@redux/StateProvider';
import { logger } from '@utils/helpers/log';
import { convertImageToBase64, isFileSizeValid } from '@utils/helpers';
import { CloudUpload } from '@mui/icons-material';
import { uploadImageToCloudinary } from '@lib/services/uploadImageToCloudinary';
import { Button } from '@components/common/Button';
import { deleteCloudinaryImg } from '@server_actions/cloudinary.action';
import { avatars } from '@utils/helpers/generateAvatar';
import { Avatar } from '@mui/material';

export const Dropzone = ({ values, height, isSignUp }) => {
    const formik = useFormikContext();
    const [error, setError] = useState('');

    const { setShowLoaderOverlay, base64String, setBase64String } = useStateContext();

    const onDrop = async (acceptedFiles) => {
        setError('');
        formik.setValues({
            ...formik.values,
            image: '',
            image_id: '',
        });

        try {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];

            // a helper function to check if file size exceeds 500kb
            isFileSizeValid(file.size)

            const base64String = await convertImageToBase64(file);
            setBase64String(base64String)
        } catch (error) {
            setError(error.message)
        }
    };

    const uploadImage = async () => {
        setShowLoaderOverlay(true)

        try {
            setShowLoaderOverlay(true)
            const data = await uploadImageToCloudinary({ selectedImage: base64String });
            formik.setValues({
                ...formik.values,
                image: data.image,
                image_id: data.image_id,
            });

        } catch (error) {
            logger(error?.message);
        }

        setShowLoaderOverlay(false)
    };

    const deleteImgFromCloudinary = async () => {
        setShowLoaderOverlay(true)
        if (!!values.image_id) {
            await deleteCloudinaryImg(values?.image_id);
            formik.setValues({
                ...formik.values,
                image: '',
                image_id: '',
            });
        }
        setShowLoaderOverlay(false)
        setBase64String('')
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop,
    });

    return (
        <div className='flex flex-col justify-center items-center overflow-hidden'>
            {/* display selected image if base64String has value else render dropzone component */}
            {!!base64String ? <>
                <div className={`h-[150px] w-[150px]`}>
                    <Image
                        className={`rounded-full w-[150px] h-[150px] object-cover`}
                        src={base64String}
                        alt={`image to be uploaded`}
                        width={150}
                        height={150}
                        priority
                    />
                </div>

                <div className='flex justify-between items-center gap-4'>
                    {!values?.image_id &&
                        <Button
                            type="button"
                            className='bg-green-500 text-white py-2 my-4 w-fit px-4 rounded-md mx-auto'
                            label='Upload'
                            aria-label='Upload image'
                            onClick={uploadImage}
                            disabled={false}
                        />
                    }

                    <Button
                        type="button"
                        className='bg-red-500 text-white py-2 my-4 w-fit px-4 rounded-md mx-auto'
                        label='  Delete'
                        aria-label='Delete image'
                        onClick={deleteImgFromCloudinary}
                        disabled={false}
                    />
                </div>
            </>
                :
                <>
                    <div className={`flex flex-col items-center rounded-md text-black justify-center text-center px-4 bg-slate-200 ${isSignUp ? '' : 'dark:bg-slate-700 darl:shadow-lg dark:text-gray-300'}  ${height} cursor-pointer`} {...getRootProps()}>
                        <input {...getInputProps()} />
                        <CloudUpload className='text-gray text-4xl' />
                        <p>Drag 'n' drop an image here, or click to select an image</p>
                    </div>
                    <p className={`text-${!!error.length ? 'red' : 'gray'}-500 text-sm mt-2`}>
                        {!!error.length ? error : "File size must not exceeds 500KB."}
                    </p>
                </>
            }

            <div className='flex items-center justify-evenly w-full mt-8'>
                <hr className='h-[1px] w-full my-4 mx-auto  border-none bg-gray-400 dark:bg-gray-600' />
                <p className='min-w-fit mx-3 text-gray-400'>or choose an avatar </p>
                <hr className='h-[1px] w-full my-4 mx-auto  border-none bg-gray-400 dark:bg-gray-600' />
            </div>

            <div className='flex items-center gap-2 overflow-x-auto w-full py-3 my-6 custom-scrollbar'>
                {avatars?.map((avatar, index) => (
                    <Avatar
                        className={`${values?.image === avatar ? 'h-14 w-14 bg-gray-50' : ''} cursor-pointer mr-6`}
                        onClick={() => {
                            formik.setValues({
                                ...formik.values,
                                image: avatar,
                                image_id: avatar,
                            });
                            setBase64String(avatar)
                        }}
                        key={index}
                        alt="Avatar"
                        src={avatar}
                    />
                ))}
            </div>
        </div>
    );
};