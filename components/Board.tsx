'use client';

import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBoardStore } from '@/store/useBoardStore';
import ListComponent from './List';
import CardComponent from './Card';
import AddList from './AddList';
import EditableTitle from './EditableTitle';
import '../styles/components/board.scss';

type DragData = {
  type: 'List' | 'Card';
  listId: string;
  cardId?: string;
};

const BoardComponent: React.FC = () => {
  const { board, updateBoardTitle, moveList, moveCard } = useBoardStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeType, setActiveType] = React.useState<'List' | 'Card' | null>(null);
  const [activeData, setActiveData] = React.useState<DragData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as DragData | undefined;
    setActiveId(active.id as string);
    setActiveType(data?.type ?? null);
    setActiveData(data ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeData = active.data.current as DragData | undefined;
    const overData = over.data.current as DragData | undefined;

    if (!activeData || !overData) return;

    // Card moving logic (only for cross-list movement in handleDragOver)
    if (activeData.type === 'Card' && (overData.type === 'Card' || overData.type === 'List')) {
      const activeListId = activeData.listId;
      const overListId = overData.type === 'List' ? overId : overData.listId;

      if (activeListId !== overListId) {
        moveCard(activeId, overId, activeListId, overListId);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);
    setActiveData(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeData = active.data.current as DragData | undefined;
    const overData = over.data.current as DragData | undefined;

    if (!activeData || !overData) return;

    if (activeData.type === 'List' && overData.type === 'List') {
      if (activeId !== overId) {
        moveList(activeId, overId);
      }
    } else if (activeData.type === 'Card') {
      const activeListId = activeData.listId;
      const overListId = overData.type === 'List' ? overId : overData.listId;
      
      moveCard(activeId, overId, activeListId, overListId);
    }
  };

  const renderDragOverlay = () => {
    if (!activeId || !activeType) return null;

    if (activeType === 'List') {
      const list = board.lists.find((l) => l.id === activeId);
      if (!list) return null;
      return <ListComponent list={list} />;
    }

    if (activeType === 'Card') {
      const list = board.lists.find((l) => l.id === activeData?.listId);
      const card = list?.cards.find((c) => c.id === activeId);
      if (!card || !list) return null;
      return <CardComponent card={card} listId={list.id} />;
    }

    return null;
  };

  return (
    <div className="board">
      <header className="board-header">
        <EditableTitle
          title={board.title}
          onSave={updateBoardTitle}
          className="board-title"
        />
      </header>

      <div className="board-content">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={board.lists.map((l) => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="lists-container">
              {board.lists.map((list) => (
                <ListComponent key={list.id} list={list} />
              ))}
              <AddList />
            </div>
          </SortableContext>
          
          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}>
            {renderDragOverlay()}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default BoardComponent;

