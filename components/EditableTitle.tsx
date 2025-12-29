'use client';

import React, { useState, useEffect, useRef } from 'react';

interface EditableTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
  className?: string;
  isTextarea?: boolean;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  title,
  onSave,
  className,
  isTextarea = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [prevTitle, setPrevTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  if (title !== prevTitle) {
    setPrevTitle(title);
    setValue(title);
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() && value !== title) {
      onSave(value.trim());
    } else {
      setValue(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isTextarea && !e.shiftKey) {
        e.preventDefault();
        handleBlur();
      } else if (!isTextarea) {
        handleBlur();
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setValue(title);
    }
  };

  if (isEditing) {
    const editClassName = `${className} is-editing`;
    return isTextarea ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={editClassName}
        rows={3}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={editClassName}
      />
    );
  }

  return (
    <div className={className} onClick={() => setIsEditing(true)}>
      {title}
    </div>
  );
};

export default EditableTitle;

