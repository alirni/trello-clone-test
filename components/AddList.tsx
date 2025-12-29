'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { Plus, X } from 'lucide-react';
import '../styles/components/add-list.scss';

const AddList: React.FC = () => {
  const { addList } = useBoardStore();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAdd = () => {
    if (title.trim()) {
      addList(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setTitle('');
    }
  };

  if (isAdding) {
    return (
      <div className="add-list-form">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter list title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="add-list-actions">
          <button className="add-btn" onClick={handleAdd}>
            Add list
          </button>
          <button className="cancel-btn" onClick={() => setIsAdding(false)}>
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button className="add-list-btn" onClick={() => setIsAdding(true)}>
      <Plus size={16} />
      <span>Add another list</span>
    </button>
  );
};

export default AddList;

