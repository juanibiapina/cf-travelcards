import { Card } from '../../../shared';

interface CardComponentProps {
  card: Card;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card }) => {
  return (
    <div className="space-y-3 relative">
      {card.title && (
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {card.title}
        </h3>
      )}
    </div>
  );
};

export default CardComponent;
