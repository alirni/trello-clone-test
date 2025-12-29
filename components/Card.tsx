'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/types';
import { useBoardStore } from '@/store/useBoardStore';
import { MessageSquare, Trash2 } from 'lucide-react';
import CardDetails from './CardDetails';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import '../styles/components/card.scss';

interface CardProps {
  card: Card;
  listId: string;
}

const CardComponent: React.FC<CardProps> = ({ card, listId }) => {
  const { deleteCard } = useBoardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    active,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      cardId: card.id,
      listId: listId,
    },
  });

  const isActuallyDragging = isDragging || (active?.id === card.id);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isActuallyDragging ? 0.3 : 1,
  };

  const handleDelete = () => {
    setIsConfirmOpen(false);
    deleteCard(listId, card.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.delete-card-btn')) {
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="card-item"
        onClick={handleCardClick}
        {...attributes}
        {...listeners}
      >
        <div className="card-title">{card.title}</div>
        <div className="card-badges">
          {card.comments.length > 0 && (
            <div className="badge">
              <MessageSquare size={12} />
              <span>{card.comments.length}</span>
            </div>
          )}
          <button
            className="delete-card-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsConfirmOpen(true);
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <CardDetails
            card={card}
            listId={listId}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Card"
        message={`Are you sure you want to delete the card "${card.title}"?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
};

export default CardComponent;

