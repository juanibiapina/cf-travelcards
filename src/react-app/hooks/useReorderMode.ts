import { useState, useCallback, useMemo } from 'react';
import { Card } from '../../shared';

interface UseReorderModeProps {
  cards?: Card[];
}

export const useReorderMode = ({ cards = [] }: UseReorderModeProps) => {
  const [isReorderMode, setIsReorderMode] = useState(false);

  const canReorder = useMemo(() => cards.length >= 2, [cards.length]);

  const toggleReorderMode = useCallback(() => {
    if (canReorder) {
      setIsReorderMode(!isReorderMode);
    }
  }, [canReorder, isReorderMode]);

  const exitReorderMode = useCallback(() => {
    setIsReorderMode(false);
  }, []);

  return {
    isReorderMode,
    canReorder,
    toggleReorderMode,
    exitReorderMode,
  };
};