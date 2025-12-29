'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import '../styles/components/modal.scss';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  isCentered?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  children, 
  onClose, 
  className = '', 
  isCentered = false 
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return createPortal(
    <div className={`modal-overlay ${isCentered ? 'is-centered' : ''}`} onClick={onClose}>
      <div className={`modal-content ${className}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;

