'use client';

import React, { useState } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDndContext } from '@dnd-kit/core';
import { List } from '@/types';
import { useBoardStore } from '@/store/useBoardStore';
import CardComponent from './Card';
import AddCard from './AddCard';
import EditableTitle from './EditableTitle';
import ConfirmDialog from './ConfirmDialog';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Trash2 } from 'lucide-react';
import '../styles/components/list.scss';

interface ListProps {
  list: List;
}

const ListComponent: React.FC<ListProps> = ({ list }) => {
  const { updateListTitle, deleteList, addCard } = useBoardStore();
  const { over, active } = useDndContext();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'List',
      listId: list.id,
    },
    disabled: isMobile,
  });

  const isCardOver = over && 
    (over.id === list.id || list.cards.some(c => c.id === over.id)) && 
    active?.data.current?.type === 'Card';

  const isActuallyDragging = isDragging || (active?.id === list.id);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isActuallyDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    setIsConfirmOpen(false);
    deleteList(list.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="list-wrapper"
    >
      <div className={`list-content ${isCardOver ? 'is-card-over' : ''}`}>
        <div 
          className="list-header" 
          {...(!isMobile ? attributes : {})} 
          {...(!isMobile ? listeners : {})}
        >
          <EditableTitle
            title={list.title}
            onSave={(newTitle) => updateListTitle(list.id, newTitle)}
            className="list-title"
          />
          <button
            className="delete-list-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsConfirmOpen(true);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="cards-container">
          <SortableContext
            items={list.cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {list.cards.map((card) => (
              <CardComponent key={card.id} card={card} listId={list.id} />
            ))}
          </SortableContext>
        </div>

        <div className="list-footer">
          <AddCard onAdd={(title) => addCard(list.id, title)} />
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete List"
        message={`Are you sure you want to delete the list "${list.title}"? All cards in this list will be lost.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default ListComponent;

