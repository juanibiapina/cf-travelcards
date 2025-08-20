import React, { useState, useCallback } from 'react';
import { Card } from '../../../shared';
import CardComponent from './CardComponent';
import DropZone from './DropZone';
import Box from '../Box';

interface CardsListProps {
  cards: Card[];
  onReorderCard?: (cardId: string, newIndex: number) => void;
  onAddCardExtraData?: (cardId: string, item: string) => void;
}

export const CardsList: React.FC<CardsListProps> = ({ cards, onReorderCard, onAddCardExtraData }) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<number | null>(null);
  const [extraDataInputCardId, setExtraDataInputCardId] = useState<string | null>(null);

  const isSelectionMode = selectedCardId !== null;

  const handleLongPress = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
  }, []);

  const handleTouchCancel = useCallback(() => {
    setSelectedCardId(null);
    setActiveDropZone(null);
  }, []);

  const handleShowExtraDataInput = useCallback((cardId: string) => {
    if (isSelectionMode) return; // Don't show input during selection mode
    setExtraDataInputCardId(cardId);
  }, [isSelectionMode]);

  const handleHideExtraDataInput = useCallback(() => {
    setExtraDataInputCardId(null);
  }, []);

  const handleAddExtraData = useCallback((cardId: string, item: string) => {
    onAddCardExtraData?.(cardId, item);
  }, [onAddCardExtraData]);

  const handleDropZoneClick = useCallback((index: number) => {
    if (!selectedCardId) return;

    const currentIndex = cards.findIndex(card => card.id === selectedCardId);
    let newIndex = index;

    if (currentIndex !== -1 && currentIndex < index) {
      newIndex = index - 1;
    }

    onReorderCard?.(selectedCardId, newIndex);
    setSelectedCardId(null);
    setActiveDropZone(null);
  }, [selectedCardId, cards, onReorderCard]);

  const handleBackgroundClick = useCallback(() => {
    if (isSelectionMode) {
      handleTouchCancel();
    }
    if (extraDataInputCardId) {
      handleHideExtraDataInput();
    }
  }, [isSelectionMode, handleTouchCancel, extraDataInputCardId, handleHideExtraDataInput]);

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
      {isSelectionMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium z-50 shadow-lg animate-in slide-in-from-top-2 duration-300">
          Selection mode - tap where to place card
        </div>
      )}

      {/* Top drop zone */}
      <DropZone
        isVisible={isSelectionMode}
        isActive={activeDropZone === 0}
        onDrop={() => handleDropZoneClick(0)}
      />

      {cards.map((card, index) => (
        <React.Fragment key={card.id}>
          <Box>
            <CardComponent
              card={card}
              isSelected={selectedCardId === card.id}
              onLongPress={handleLongPress}
              onTouchCancel={handleTouchCancel}
              onAddExtraData={handleAddExtraData}
              showExtraDataInput={extraDataInputCardId === card.id}
              onShowExtraDataInput={handleShowExtraDataInput}
              onHideExtraDataInput={handleHideExtraDataInput}
            />
          </Box>

          {/* Drop zone after each card (except the selected one) */}
          {isSelectionMode && selectedCardId !== card.id && (
            <DropZone
              isVisible={true}
              isActive={activeDropZone === index + 1}
              onDrop={() => handleDropZoneClick(index + 1)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CardsList;