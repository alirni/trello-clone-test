'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import '../styles/components/add-card.scss';

interface AddCardProps {
  onAdd: (title: string) => void;
}

const AddCard: React.FC<AddCardProps> = ({ onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isAdding && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAdding]);

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isAdding) {
    return (
      <div className="add-card-form">
        <textarea
          ref={textareaRef}
          placeholder="Enter a title for this card..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
        />
        <div className="add-card-actions">
          <button className="add-btn" onClick={handleAdd}>
            Add card
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button className="add-card-btn" onClick={() => setIsAdding(true)}>
      <Plus size={16} />
      <span>Add a card</span>
    </button>
  );
};

export default AddCard;

