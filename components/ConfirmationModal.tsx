import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
                onClick={isLoading ? undefined : onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200 p-6 text-center">
                {isLoading ? (
                    <div className="py-4 flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Processing...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-red-600 flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </div>

                        <h3 className="text-lg font-bold mb-2">{title}</h3>
                        <p className="text-gray-500 mb-6 text-sm">{message}</p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="bg-black text-white px-6 py-2 text-sm font-bold uppercase tracking-widest rounded hover:bg-red-600 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
