import { useCallback } from 'react';
import { Card } from '../../../shared';
import CardExtraDataInput from './CardExtraDataInput';

interface CardComponentProps {
  card: Card;
  onAddExtraData?: (cardId: string, item: string) => void;
  showExtraDataInput?: boolean;
  onShowExtraDataInput?: (cardId: string) => void;
  onHideExtraDataInput?: () => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  onAddExtraData,
  showExtraDataInput = false,
  onShowExtraDataInput,
  onHideExtraDataInput
}) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onShowExtraDataInput?.(card.id);
  }, [onShowExtraDataInput, card.id]);

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
    <div
      className="space-y-3 relative hover:shadow-md active:scale-[0.98] cursor-pointer transition-all duration-200 ease-in-out"
      onClick={handleClick}
    >
      {card.title && (
        <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 transition-colors duration-200">
          {card.title}
        </h3>
      )}

      {card.extraData && card.extraData.length > 0 && (
        <div className="space-y-1 ml-4">
          {card.extraData.map((item, index) => (
            <div key={index} className="flex items-start">
              <span className="text-gray-400 mr-2 text-sm">•</span>
              {renderExtraDataItem(item, index)}
            </div>
          ))}
        </div>
      )}

      {showExtraDataInput && (
        <CardExtraDataInput
          onAddExtraData={handleAddExtraData}
          onClose={onHideExtraDataInput!}
        />
      )}
    </div>
  );
};

export default CardComponent;
