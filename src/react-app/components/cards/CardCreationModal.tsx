import React, { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editingCard;

  // Initialize form with editing card data
  useEffect(() => {
    if (editingCard) {
      setTitle(editingCard.title || '');
    }
  }, [editingCard, isOpen]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);


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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isEditing ? "Update card..." : "What's on your mind?"}
              className="w-full text-xl border-none outline-none bg-transparent placeholder-gray-400 text-gray-800 font-light leading-relaxed py-2"
              aria-label={isEditing ? "Update card" : "Create new card"}
            />
            <div className="flex justify-end mt-8 space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 rounded-lg hover:bg-gray-100/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!title.trim()}
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CardCreationModal;
