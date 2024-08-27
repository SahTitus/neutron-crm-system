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
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Semi-transparent black background
            >
                <div className="flex flex-col justify-center bg-white rounded-lg shadow-lg py-4 px-6 max-w-sm h-[150px] ">
                    <p className="text-gray-800 text-lg">{modalConfig.message}</p>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={closeModal}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-300"
                            aria-label="Cancel process"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={async () => {
                                await modalConfig.onConfirm();
                                closeModal();
                            }}
                            className={`${modalConfig.bgStyles} text-white px-4 py-2 rounded`}
                            aria-label="Confirm process"
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
