import { useState, useCallback } from 'react';
import { Card } from '../../shared';

interface UseCardStateResult {
  unfoldedCardIds: Set<string>;
  extraDataInputCardId: string | null;
  isCardFolded: (card: Card) => boolean;
  handleToggleFold: (cardId: string) => void;
  handleShowExtraDataInput: (cardId: string) => void;
  handleHideExtraDataInput: () => void;
}

export function useCardState(isReorderMode: boolean = false): UseCardStateResult {
  const [unfoldedCardIds, setUnfoldedCardIds] = useState<Set<string>>(new Set());
  const [extraDataInputCardId, setExtraDataInputCardId] = useState<string | null>(null);

  const handleToggleFold = useCallback((cardId: string) => {
    setUnfoldedCardIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  }, []);

  const handleShowExtraDataInput = useCallback((cardId: string) => {
    if (isReorderMode) return;
    setExtraDataInputCardId(cardId);
  }, [isReorderMode]);

  const handleHideExtraDataInput = useCallback(() => {
    setExtraDataInputCardId(null);
  }, []);

  const isCardFolded = useCallback((card: Card) => {
    const hasExtraData = card.extraData && card.extraData.length > 0;
    if (!hasExtraData) return false;
    return !unfoldedCardIds.has(card.id);
  }, [unfoldedCardIds]);

  return {
    unfoldedCardIds,
    extraDataInputCardId,
    isCardFolded,
    handleToggleFold,
    handleShowExtraDataInput,
    handleHideExtraDataInput,
  };
}