'use client';

import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { List } from '@/types';
import { useBoardStore } from '@/store/useBoardStore';
import CardComponent from './Card';
import AddCard from './AddCard';
import EditableTitle from './EditableTitle';
import { Trash2 } from 'lucide-react';
import '../styles/components/list.scss';

interface ListProps {
  list: List;
}

const ListComponent: React.FC<ListProps> = ({ list }) => {
  const { updateListTitle, deleteList, addCard } = useBoardStore();
  
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
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="list-wrapper"
    >
      <div className="list-content">
        <div className="list-header" {...attributes} {...listeners}>
          <EditableTitle
            title={list.title}
            onSave={(newTitle) => updateListTitle(list.id, newTitle)}
            className="list-title"
          />
          <button
            className="delete-list-btn"
            onClick={() => {
              if (confirm('Are you sure you want to delete this list?')) {
                deleteList(list.id);
              }
            }}
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
    </div>
  );
};

export default ListComponent;

