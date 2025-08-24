import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../../../shared';
import CardComponent from './CardComponent';
import Box from '../Box';

interface SortableCardProps {
  card: Card;
  onAddExtraData: (cardId: string, item: string) => void;
  onToggleFold?: (cardId: string) => void;
  isFolded: boolean;
  showExtraDataInput: boolean;
  onShowExtraDataInput: (cardId: string) => void;
  onHideExtraDataInput: () => void;
  isReorderMode: boolean;
}

export const SortableCard: React.FC<SortableCardProps> = ({
  card,
  onAddExtraData,
  onToggleFold,
  isFolded,
  showExtraDataInput,
  onShowExtraDataInput,
  onHideExtraDataInput,
  isReorderMode,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: !isReorderMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isReorderMode ? { ...attributes, ...listeners } : {})}
      className={`transition-all duration-200 ${
        isReorderMode
          ? 'cursor-grab active:cursor-grabbing touch-none'
          : ''
      } ${
        isDragging
          ? 'opacity-60 scale-95 ring-2 ring-blue-300 ring-dashed shadow-lg'
          : ''
      } ${
        isReorderMode ? 'hover:shadow-md' : ''
      }`}
      data-card-id={card.id}
    >
      <Box>
        <CardComponent
          card={card}
          onAddExtraData={onAddExtraData}
          onToggleFold={onToggleFold}
          isFolded={isFolded}
          showExtraDataInput={showExtraDataInput}
          onShowExtraDataInput={onShowExtraDataInput}
          onHideExtraDataInput={onHideExtraDataInput}
          isReorderMode={isReorderMode}
        />
      </Box>
    </div>
  );
};

export default SortableCard;