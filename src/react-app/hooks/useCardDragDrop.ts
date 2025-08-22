import { useState, useCallback } from 'react';
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from '../../shared';

interface UseCardDragDropProps {
  cards: Card[];
  onReorderCard?: (cardId: string, newIndex: number) => void;
  isReorderMode?: boolean;
}

export const useCardDragDrop = ({
  cards,
  onReorderCard,
  isReorderMode = false
}: UseCardDragDropProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = cards.findIndex(card => card.id === active.id);
      const newIndex = cards.findIndex(card => card.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderCard?.(active.id as string, newIndex);
      }
    }

    setActiveId(null);
  }, [cards, onReorderCard]);

  const dndContextProps = {
    sensors,
    collisionDetection: closestCenter,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  };

  const sortableContextProps = {
    items: cards.map(card => card.id),
    strategy: verticalListSortingStrategy,
  };

  return {
    activeId,
    isReorderMode,
    dndContextProps,
    sortableContextProps,
  };
};