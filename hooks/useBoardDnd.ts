import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  closestCorners,
  CollisionDetection,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useCallback } from 'react';
import { useBoardStore } from '@/store/useBoardStore';

export type DragData = {
  type: 'List' | 'Card';
  listId: string;
  cardId?: string;
};

export const useBoardDnd = () => {
  const { moveList, moveCard, board } = useBoardStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'List' | 'Card' | null>(null);
  const [activeData, setActiveData] = useState<DragData | null>(null);

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

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeType === 'List') {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            board.lists.some((l) => l.id === container.id)
          ),
        });
      }

      return closestCorners(args);
    },
    [activeType, board.lists]
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
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeData = active.data.current as DragData | undefined;
    const overData = over.data.current as DragData | undefined;

    if (!activeData || !overData) return;

    // List reordering logic
    if (activeData.type === 'List' && overData.type === 'List') {
      if (activeId !== overId) {
        moveList(activeId, overId);
      }
      return;
    }

    if (activeData.type === 'Card') {
      const activeListId = activeData.listId;
      const overListId = overData.type === 'List' ? overId : overData.listId;

      if (activeListId !== overListId) {
        moveCard(activeId, overId, activeListId, overListId);

        setActiveData({
          ...activeData,
          listId: overListId,
        });
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
      
      if (activeId !== overId || activeListId !== overListId) {
        moveCard(activeId, overId, activeListId, overListId);
      }
    }
  };

  return {
    activeId,
    activeType,
    activeData,
    sensors,
    collisionDetectionStrategy,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

