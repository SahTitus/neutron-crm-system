'use client'
import { useState } from 'react';

export const useConfirmationModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        message: "",
        bgStyles: "bg-red-600 hover:bg-red-700",
        onConfirm: () => Promise.resolve(), // Default to a resolved promise
    });

    const toggleConfirmationModal = (message, onConfirm, bgStyles) => {
        setModalConfig({ message, onConfirm, bgStyles });
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => setIsModalOpen(false);

    const ConfirmationModal = () => {
        if (!isModalOpen) return null;

        return (
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`bg-white rounded-lg shadow-lg p-6 max-w-sm w-full transform transition-all duration-300 ${isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <p className="text-gray-800 text-lg">{modalConfig.message}</p>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={closeModal}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-300 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={async () => {
                                await modalConfig.onConfirm();
                                closeModal();
                            }}
                            className={`${modalConfig.bgStyles} text-white px-4 py-2 rounded cursor-pointer`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return {
        isModalOpen,
        toggleConfirmationModal,
        ConfirmationModal,
    };
};