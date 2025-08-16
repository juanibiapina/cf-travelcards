import { Card as CardType } from '../../../shared';
import CardContextMenu from './CardContextMenu';

interface CardComponentProps {
  card: CardType;
  onDelete?: () => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, onDelete }) => {
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(card.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3 relative">
      {onDelete && (
        <div className="absolute bottom-1 right-1">
          <CardContextMenu onDelete={onDelete} />
        </div>
      )}

      {card.imageUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
          <img
            src={card.imageUrl}
            alt={card.title || 'Link preview'}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-2">
        {card.title && (
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {card.title}
          </h3>
        )}

        {card.description && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {card.description}
          </p>
        )}

        <div className="flex items-center space-x-2">
          <a
            href={card.url}
            onClick={handleLinkClick}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium truncate"
          >
            {card.url}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
