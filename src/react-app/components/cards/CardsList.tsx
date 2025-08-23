import React, { useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
} from '@dnd-kit/sortable';
import { Card } from '../../../shared';
import SortableCard from './SortableCard';
import { useCardDragDrop } from '../../hooks/useCardDragDrop';
import { useCardState } from '../../hooks/useCardState';

interface CardsListProps {
  cards: Card[];
  onReorderCard?: (cardId: string, newIndex: number) => void;
  onAddCardExtraData?: (cardId: string, item: string) => void;
  isReorderMode?: boolean;
}


export const CardsList: React.FC<CardsListProps> = ({
  cards,
  onReorderCard,
  onAddCardExtraData,
  isReorderMode = false
}) => {
  const { activeId, dndContextProps, sortableContextProps } = useCardDragDrop({
    cards,
    onReorderCard,
    isReorderMode
  });

  const {
    extraDataInputCardId,
    isCardFolded,
    handleToggleFold,
    handleShowExtraDataInput,
    handleHideExtraDataInput,
  } = useCardState(isReorderMode);

  const handleAddExtraData = useCallback((cardId: string, item: string) => {
    onAddCardExtraData?.(cardId, item);
    // Don't change the fold state when adding extra data - preserve current state
  }, [onAddCardExtraData]);

  const handleBackgroundClick = useCallback(() => {
    if (extraDataInputCardId) {
      handleHideExtraDataInput();
    }
  }, [extraDataInputCardId, handleHideExtraDataInput]);

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No cards yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Create your first card to get started
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-4" onClick={handleBackgroundClick}>
      {activeId && isReorderMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium z-50 shadow-lg">
          Drag to reorder cards
        </div>
      )}

      <DndContext {...dndContextProps}>
        <SortableContext {...sortableContextProps}>
          {cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              onAddExtraData={handleAddExtraData}
              onToggleFold={handleToggleFold}
              isFolded={isCardFolded(card)}
              showExtraDataInput={extraDataInputCardId === card.id}
              onShowExtraDataInput={handleShowExtraDataInput}
              onHideExtraDataInput={handleHideExtraDataInput}
              isReorderMode={isReorderMode}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default CardsList;