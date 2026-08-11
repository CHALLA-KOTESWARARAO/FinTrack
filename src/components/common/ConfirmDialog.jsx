import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirm-dialog-body">
        <div className="confirm-icon-wrapper">
          <AlertTriangle size={32} className="confirm-icon" />
        </div>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        .confirm-dialog-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }

        .confirm-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--badge-danger-bg);
          color: var(--accent-danger);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirm-message {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 360px;
        }
      `}</style>
    </Modal>
  );
};
