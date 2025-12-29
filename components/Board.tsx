'use client';

import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBoardStore } from '@/store/useBoardStore';
import ListComponent from './List';
import CardComponent from './Card';
import AddList from './AddList';
import EditableTitle from './EditableTitle';
import { useBoardDnd } from '@/hooks/useBoardDnd';
import '../styles/components/board.scss';

const BoardComponent: React.FC = () => {
  const { board, updateBoardTitle } = useBoardStore();
  const {
    activeId,
    activeType,
    sensors,
    collisionDetectionStrategy,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDnd();

  const renderDragOverlay = () => {
    if (!activeId || !activeType) return null;

    if (activeType === 'List') {
      const list = board.lists.find((l) => l.id === activeId);
      if (!list) return null;
      return (
        <div className="list-overlay">
          <ListComponent list={list} />
        </div>
      );
    }

    if (activeType === 'Card') {
      let activeCard = null;
      let activeListId = '';
      
      for (const list of board.lists) {
        const card = list.cards.find((c) => c.id === activeId);
        if (card) {
          activeCard = card;
          activeListId = list.id;
          break;
        }
      }

      if (!activeCard) return null;
      
      return (
        <div className="card-overlay">
          <CardComponent card={activeCard} listId={activeListId} />
        </div>
      );
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
          collisionDetection={collisionDetectionStrategy}
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

