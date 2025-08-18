import React from 'react';
import { Card } from '../../../shared';
import CardComponent from './CardComponent';
import Box from '../Box';

interface CardsListProps {
  cards: Card[];
}

export const CardsList: React.FC<CardsListProps> = ({ cards }) => {
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
        <Box key={card.id}>
          <CardComponent card={card} />
        </Box>
      ))}
    </div>
  );
};

export default CardsList;