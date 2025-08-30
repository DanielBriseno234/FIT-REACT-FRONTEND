import Modal from './Modal';
import { NormalButton } from '../Buttons/NormalButton';
import { CancelButton } from '../Buttons/CancelButton';
import { FaTimes } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string
    iconConfirm?: React.ReactNode
    cancelText?: string
    iconCancel?: React.ReactNode
}

const ConfirmationModal = ({
    isOpen,
    isLoading = false,
    onClose,
    onConfirm,
    title = "Confirmar acción",
    message = "¿Estás seguro de realizar esta acción?",
    confirmText = "Confirmar",
    iconConfirm = <FiTrash2 />,
    cancelText = "Cancelar",
    iconCancel = <FaTimes />
}: ConfirmationModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size='lg'
        >
            <div className="space-y-6">
                <p className="text-gray-700">{message}</p>

                <div className="flex justify-between md:justify-end space-x-3">
                    <CancelButton
                        onClick={onClose}
                        tooltip={cancelText}
                    >
                        {iconCancel}
                        {cancelText}
                    </CancelButton>
                    <NormalButton
                        onClick={() => {
                            onConfirm();
                        }}
                        tooltip={confirmText}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            iconConfirm
                        )}
                        {confirmText}
                    </NormalButton>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;