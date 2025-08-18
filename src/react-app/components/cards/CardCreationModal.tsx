import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Card, CardInput } from '../../../shared';

interface CardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard: (card: CardInput) => void;
  onUpdateCard?: (card: Card) => void;
  editingCard?: Card;
}

export const CardCreationModal: React.FC<CardCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateCard,
  onUpdateCard,
  editingCard,
}) => {
  const [title, setTitle] = useState('');

  const isEditing = !!editingCard;

  // Initialize form with editing card data
  useEffect(() => {
    if (editingCard) {
      setTitle(editingCard.title || '');
    }
  }, [editingCard, isOpen]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardData: CardInput = {
      title: title.trim() || undefined,
    };

    if (isEditing && editingCard && onUpdateCard) {
      const updatedCard: Card = {
        ...editingCard,
        ...cardData,
        updatedAt: new Date().toISOString(),
      };
      onUpdateCard(updatedCard);
    } else {
      onCreateCard(cardData);
    }

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Card' : 'Create Card'}
          </h2>
          <button onClick={handleClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{isEditing ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CardCreationModal;
