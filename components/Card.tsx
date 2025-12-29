'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/types';
import { useBoardStore } from '@/store/useBoardStore';
import { MessageSquare, Trash2 } from 'lucide-react';
import CardDetails from './CardDetails';
import Modal from './Modal';
import '../styles/components/card.scss';

interface CardProps {
  card: Card;
  listId: string;
}

const CardComponent: React.FC<CardProps> = ({ card, listId }) => {
  const { deleteCard } = useBoardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      cardId: card.id,
      listId: listId,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
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
              if (confirm('Are you sure you want to delete this card?')) {
                deleteCard(listId, card.id);
              }
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
    </>
  );
};

export default CardComponent;

