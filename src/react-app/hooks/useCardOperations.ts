import { useState, useCallback } from 'react';
import { Card, CardInput } from '../../shared';

interface UseCardOperationsProps {
  createCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  reorderCard: (cardId: string, newIndex: number) => void;
  addCardExtraData: (cardId: string, item: string) => void;
  isConnected: boolean;
}

export const useCardOperations = ({
  createCard,
  updateCard,
  reorderCard,
  addCardExtraData,
  isConnected
}: UseCardOperationsProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateCard = useCallback((cardData: CardInput) => {
    if (!isConnected) return;

    const newCard: Card = {
      ...cardData,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createCard(newCard);
  }, [createCard, isConnected]);

  const handleUpdateCard = useCallback((card: Card) => {
    if (!isConnected) return;
    updateCard(card);
  }, [updateCard, isConnected]);

  const handleReorderCard = useCallback((cardId: string, newIndex: number) => {
    if (!isConnected) return;
    reorderCard(cardId, newIndex);
  }, [reorderCard, isConnected]);

  const handleAddCardExtraData = useCallback((cardId: string, item: string) => {
    if (!isConnected) return;
    addCardExtraData(cardId, item);
  }, [addCardExtraData, isConnected]);

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  return {
    // Modal state
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,

    // Card operations
    handleCreateCard,
    handleUpdateCard,
    handleReorderCard,
    handleAddCardExtraData,
  };
};