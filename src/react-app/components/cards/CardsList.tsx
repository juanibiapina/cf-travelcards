import React from 'react';
import { Card as CardType } from '../../../shared';
import CardComponent from './CardComponent';
import Card from '../Card';

interface CardsListProps {
  cards: CardType[];
  onDeleteCard: (cardId: string) => void;
}

export const CardsList: React.FC<CardsListProps> = ({ cards, onDeleteCard }) => {
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
    <div className="space-y-4">
      {cards.map((card) => (
        <Card key={card.id}>
          <CardComponent card={card} onDelete={() => onDeleteCard(card.id)} />
        </Card>
      ))}
    </div>
  );
};

export default CardsList;