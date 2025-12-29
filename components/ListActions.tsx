'use client';

import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/components/list-actions.scss';

interface ListActionsProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteList: () => void;
  onDeleteAllCards: () => void;
  hasCards: boolean;
}

const ListActions: React.FC<ListActionsProps> = ({
  isOpen,
  onClose,
  onDeleteList,
  onDeleteAllCards,
  hasCards,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="list-actions-popover" ref={menuRef}>
      <header className="actions-header">
        <span>List Actions</span>
        <button className="close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </header>
      <div className="actions-content">
        <button
          className="action-item"
          onClick={() => {
            onDeleteList();
            onClose();
          }}
        >
          Delete List
        </button>
        <button
          className="action-item"
          disabled={!hasCards}
          onClick={() => {
            onDeleteAllCards();
            onClose();
          }}
        >
          Delete All Cards
        </button>
      </div>
    </div>
  );
};

export default ListActions;

