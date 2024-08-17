'use client'
import React from 'react';
import { useStateContext } from '@redux/StateProvider';
import { Modal } from '@components/ui/modals/Modal';
import { Button } from '@components/common/Button';
import { useSelector } from 'react-redux';
import { AvatarIcon } from '@components/common/Avatar';
import ThemeToggle from '@components/features/ThemeToggle';
import { SearchBox } from '@components/ui/forms/SearchBox';

export const Navbar = () => {
    const user = useSelector((state) => state.auth.user);

    const { hideSide, isSideModalOpen, toggleSideModal } = useStateContext();

    return (
        <nav id='#top' className={`${hideSide ? 'hidden' : 'flex'} sticky top-0 w-full items-center justify-between dark:bg-[#192037] bg-white rounded-b-2xl pl-5 py-5 z-30`}>
            <div className="flex items-center w-1/5">
                <AvatarIcon alt={user?.firstName} name={user?.firstName} email={user?.email} image={user?.image} />
            </div>

            <SearchBox />

            <div className="flex items-center pr-4">
                <ThemeToggle isSwitch={true} />
                <Button
                    onClick={() => toggleSideModal('dynamicForm')}
                    type="button"
                    className={`w-fit bg-green-500 text-base text-white py-[10px] px-7 rounded-full font-medium hover:bg-green-600 transition duration-300 `}
                    label={'Add a record'}
                    ariaLabel={'Add a record'}
                    disabled={false}
                />
            </div>
            {isSideModalOpen && <Modal />}
        </nav>
    );
};