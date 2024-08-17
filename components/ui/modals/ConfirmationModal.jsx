import React from 'react';

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, bgStyle, confirmText = "Confirm", cancelText = "Cancel" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <p className="text-gray-800 text-lg">{message}</p>
                {/* <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`${bgStyle} text-white px-4 py-2 rounded `}
                    >
                        {confirmText}
                    </button> */}
                {/* </div> */}
            </div>
        </div>
    );
};