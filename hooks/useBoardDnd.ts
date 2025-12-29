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
  rectIntersection,
  getFirstCollision,
  CollisionDetection,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useCallback, useRef } from 'react';
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
  const lastOverId = useRef<string | null>(null);

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

  const findContainer = useCallback((id: string) => {
    if (board.lists.some(l => l.id === id)) return id;
    return board.lists.find(l => l.cards.some(c => c.id === id))?.id;
  }, [board.lists]);

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

      const pointerIntersections = rectIntersection(args);
      const intersections = pointerIntersections.length > 0 
        ? pointerIntersections 
        : closestCorners(args);
      
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        const isList = board.lists.some((l) => l.id === overId);
        
        if (isList) {
          const list = board.lists.find((l) => l.id === overId);
          if (list && list.cards.length > 0) {
            const cardIntersections = closestCorners({
              ...args,
              droppableContainers: args.droppableContainers.filter((container) =>
                list.cards.some((c) => c.id === container.id)
              ),
            });
            const closestCardId = getFirstCollision(cardIntersections, 'id');
            if (closestCardId != null) {
              overId = closestCardId;
            }
          }
        }

        lastOverId.current = overId as string;
        return [{ id: overId }];
      }

      return [];
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
    if (!activeData || activeData.type !== 'Card') return;

    const activeListId = findContainer(activeId);
    const overListId = findContainer(overId);

    if (!activeListId || !overListId || activeListId === overListId) return;

    moveCard(activeId, overId, activeListId, overListId);
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
    if (!activeData) return;

    if (activeData.type === 'List') {
      if (activeId !== overId) {
        moveList(activeId, overId);
      }
    } else if (activeData.type === 'Card') {
      const activeListId = findContainer(activeId);
      const overListId = findContainer(overId);

      if (activeListId && overListId) {
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
