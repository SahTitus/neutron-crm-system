'use client';
import React from 'react';
import { Dialog, Slide } from '@mui/material';
import { Close } from '@mui/icons-material';
import { formModalStyles } from '@styles/styles';
import { useStateContext } from '@redux/StateProvider';
import { DynamicForm } from '../forms/DynamicForm';
import { Icon } from '@components/common/Icon';
import { SearchBox } from '../forms/SearchBox';
import { SearchResultsContainer } from '@components/pages/search/SearchResultsContainer';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide ref={ref} {...props} />;
});

const modalContent = {
    dynamicForm: {
        title: 'Add New Record',
        component: <DynamicForm />
    },
    searchResults: {
        title: 'Search Results',
        component: <SearchResultsContainer />
    },
};

const ModalHeader = ({ title, onClose, modalContentType }) => (
    <div className='absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 z-10 flex items-center justify-between w-full py-4 border-b border-gray-800'>
        {modalContentType === "searchResults" ?
            <div className='flex items-center justify-center w-full'>
                <SearchBox />
            </div>
            : <p className='text-black text-2xl ml-16 dark:text-gray-300 font-medium'>{title}</p>}

        <Icon className='flex items-center gap-2 border-none text-[#000] dark:text-gray-300 mr-6' onClick={onClose} ariaLabel='close modal button'>
            <Close />
        </Icon>
        <hr className='absolute bottom-0 border-none bg-gray h-[1px] w-full' />
    </div>
);

export const Modal = () => {
    const { toggleSideModal, modalContentType, isSideModalOpen } = useStateContext();
    const content = modalContent[modalContentType] || { title: '', component: null };

    const transitionDirection = modalContentType === "searchResults" ? "up" : "left";

    const styles = formModalStyles();

    return (
        <div className='flex flex-col'>
            <Dialog
                open={isSideModalOpen}
                TransitionComponent={Transition} 
                keepMounted
                onClose={toggleSideModal}
                id="drawer"
                fullScreen
                className="flex flex-col h-screen"
                sx={styles.dialogSx}
                PaperProps={{ sx: styles.paperProps }}
                aria-describedby="search box dialog"
                TransitionProps={{ direction: transitionDirection }} 
            >
                <div className='relative flex flex-col h-full dark:bg-gray-900'>
                    <ModalHeader
                        modalContentType={modalContentType}
                        title={content.title}
                        onClose={toggleSideModal}
                    />

                    <div className='pt-[5.5rem] flex-1 overflow-y-auto custom-scrollbar'>
                        {content.component}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};