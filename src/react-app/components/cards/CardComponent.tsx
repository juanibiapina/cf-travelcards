import { useCallback } from 'react';
import { FiChevronDown, FiChevronRight, FiPlus } from 'react-icons/fi';
import { Card } from '../../../shared';
import CardExtraDataInput from './CardExtraDataInput';

interface CardComponentProps {
  card: Card;
  onAddExtraData?: (cardId: string, item: string) => void;
  onToggleFold?: (cardId: string) => void;
  isFolded?: boolean;
  showExtraDataInput?: boolean;
  onShowExtraDataInput?: (cardId: string) => void;
  onHideExtraDataInput?: () => void;
  isReorderMode?: boolean;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  onAddExtraData,
  onToggleFold,
  isFolded = false,
  showExtraDataInput = false,
  onShowExtraDataInput,
  onHideExtraDataInput,
  isReorderMode = false
}) => {
  const hasExtraData = card.extraData && card.extraData.length > 0;

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasExtraData && !isReorderMode) {
      onToggleFold?.(card.id);
    }
  }, [onToggleFold, card.id, hasExtraData, isReorderMode]);

  const handleAddExtraDataClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isReorderMode) {
      onShowExtraDataInput?.(card.id);
    }
  }, [onShowExtraDataInput, card.id, isReorderMode]);

  const handleAddExtraData = useCallback((item: string) => {
    onAddExtraData?.(card.id, item);
  }, [onAddExtraData, card.id]);

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return text.startsWith('http://') || text.startsWith('https://');
    }
  };

  const renderExtraDataItem = (item: string, index: number) => {
    if (isUrl(item)) {
      return (
        <a
          key={index}
          href={item}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {item}
        </a>
      );
    }
    return (
      <span key={index} className="text-gray-700 text-sm">
        {item}
      </span>
    );
  };

  return (
    <div className="space-y-3 relative hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-in-out">
      <div
        className={`flex items-start gap-2 ${hasExtraData ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
      >
        {hasExtraData && (
          <div className="flex-shrink-0 mt-1">
            {isFolded ? (
              <FiChevronRight className="w-4 h-4 text-gray-500" data-testid="chevron-right" />
            ) : (
              <FiChevronDown className="w-4 h-4 text-gray-500" data-testid="chevron-down" />
            )}
          </div>
        )}

        <div className="flex-1">
          {card.title && (
            <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 transition-colors duration-200">
              {card.title}
            </h3>
          )}
        </div>

        <button
          onClick={handleAddExtraDataClick}
          disabled={isReorderMode}
          className={`flex-shrink-0 p-1 rounded-md transition-colors duration-200 ${
            isReorderMode
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Add extra data"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>

      {hasExtraData && !isFolded && (
        <div className="space-y-1 ml-6 transition-all duration-200 ease-in-out">
          {card.extraData!.map((item, index) => (
            <div key={index} className="flex items-start">
              <span className="text-gray-400 mr-2 text-sm">•</span>
              {renderExtraDataItem(item, index)}
            </div>
          ))}
        </div>
      )}

      {showExtraDataInput && (
        <div className="ml-6">
          <CardExtraDataInput
            onAddExtraData={handleAddExtraData}
            onClose={onHideExtraDataInput!}
          />
        </div>
      )}
    </div>
  );
};

export default CardComponent;
