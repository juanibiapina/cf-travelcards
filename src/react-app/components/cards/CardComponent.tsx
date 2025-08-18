import { Card } from '../../../shared';
import CardContextMenu from './CardContextMenu';

interface CardComponentProps {
  card: Card;
  onDelete?: () => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, onDelete }) => {
  return (
    <div className="space-y-3 relative">
      {onDelete && (
        <div className="absolute bottom-1 right-1">
          <CardContextMenu onDelete={onDelete} />
        </div>
      )}

      {card.title && (
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {card.title}
        </h3>
      )}
    </div>
  );
};

export default CardComponent;
