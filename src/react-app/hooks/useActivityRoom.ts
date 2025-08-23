import { useAuth } from '@clerk/clerk-react';
import { useState, useCallback } from 'react';
import { usePartySocket } from 'partysocket/react';
import type { Activity, Message, Card } from '../../shared';

interface UseActivityRoomResult {
  activity: Activity | null;
  isConnected: boolean;
  updateName: (name: string) => void;
  updateDates: (startDate: string, endDate?: string, startTime?: string) => void;
  createCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;
  reorderCard: (cardId: string, newIndex: number) => void;
  addCardExtraData: (cardId: string, item: string) => void;
  updateCardExtraData: (cardId: string, extraDataIndex: number, updatedItem: string) => void;
  deleteCardExtraData: (cardId: string, extraDataIndex: number) => void;
  loading: boolean;
}

export function useActivityRoom(activityId: string): UseActivityRoomResult {
  const { getToken } = useAuth();
  const [activity, setActivity] = useState<Activity>({ cards: [] });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const socket = usePartySocket({
    room: activityId,
    party: 'activitydo',
    query: async () => ({
      token: await getToken(),
    }),
    onOpen: () => {
      setIsConnected(true);
    },
    onClose: () => {
      setIsConnected(false);
    },
    onMessage: (event) => {
      const message = JSON.parse(event.data) as Message;

      if (message.type === 'activity') {
        setActivity(message.activity);
        setLoading(false);
      } else if (message.type === 'name') {
        setActivity(prev => {
          return {
            ...prev,
            name: message.name,
          };
        });
      } else if (message.type === 'dates') {
        setActivity(prev => {
          return {
            ...prev,
            startDate: message.startDate,
            endDate: message.endDate,
            startTime: message.startTime,
          };
        });
      } else if (message.type === 'card-create') {
        setActivity(prev => {
          return {
            ...prev,
            cards: [...(prev.cards || []), message.card],
          };
        });
      } else if (message.type === 'card-update') {
        setActivity(prev => {
          return {
            ...prev,
            cards: (prev.cards || []).map(card =>
              card.id === message.card.id ? message.card : card
            ),
          };
        });
      } else if (message.type === 'card-delete') {
        setActivity(prev => {
          return {
            ...prev,
            cards: (prev.cards || []).filter(card => card.id !== message.cardId),
          };
        });
      } else if (message.type === 'card-reorder') {
        setActivity(prev => {
          if (!prev.cards) return prev;

          const currentIndex = prev.cards.findIndex(card => card.id === message.cardId);
          if (currentIndex === -1) return prev;

          const newCards = [...prev.cards];
          const card = newCards[currentIndex];
          newCards.splice(currentIndex, 1);
          newCards.splice(message.newIndex, 0, card);

          return {
            ...prev,
            cards: newCards,
          };
        });
      } else if (message.type === 'card-extra-data-add') {
        setActivity(prev => {
          return {
            ...prev,
            cards: (prev.cards || []).map(card => {
              if (card.id === message.cardId) {
                return {
                  ...card,
                  extraData: [...(card.extraData || []), message.extraDataItem],
                };
              }
              return card;
            }),
          };
        });
      } else if (message.type === 'card-extra-data-update') {
        setActivity(prev => {
          return {
            ...prev,
            cards: (prev.cards || []).map(card => {
              if (card.id === message.cardId && card.extraData) {
                const newExtraData = [...card.extraData];
                newExtraData[message.extraDataIndex] = message.updatedItem;
                return {
                  ...card,
                  extraData: newExtraData,
                };
              }
              return card;
            }),
          };
        });
      } else if (message.type === 'card-extra-data-delete') {
        setActivity(prev => {
          return {
            ...prev,
            cards: (prev.cards || []).map(card => {
              if (card.id === message.cardId && card.extraData) {
                const newExtraData = [...card.extraData];
                newExtraData.splice(message.extraDataIndex, 1);
                return {
                  ...card,
                  extraData: newExtraData,
                };
              }
              return card;
            }),
          };
        });
      }
    },
  });

  const updateName = useCallback((name: string) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'name',
      name,
    } satisfies Message));
  }, [socket, isConnected]);

  const updateDates = useCallback((startDate: string, endDate?: string, startTime?: string) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'dates',
      startDate,
      endDate,
      startTime,
    } satisfies Message));
  }, [socket, isConnected]);

  const createCard = useCallback((card: Card) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'card-create',
      card,
    } satisfies Message));
  }, [socket, isConnected]);

  const updateCard = useCallback((card: Card) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'card-update',
      card,
    } satisfies Message));
  }, [socket, isConnected]);

  const deleteCard = useCallback((cardId: string) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'card-delete',
      cardId,
    } satisfies Message));
  }, [socket, isConnected]);

  const reorderCard = useCallback((cardId: string, newIndex: number) => {
    if (!socket || !isConnected) return;

    // Optimistically update the local state
    setActivity(prev => {
      if (!prev.cards) return prev;

      const currentIndex = prev.cards.findIndex(card => card.id === cardId);
      if (currentIndex === -1 || currentIndex === newIndex) return prev;

      const newCards = [...prev.cards];
      const card = newCards[currentIndex];
      newCards.splice(currentIndex, 1);
      newCards.splice(newIndex, 0, card);

      return {
        ...prev,
        cards: newCards,
      };
    });

    // Send to backend
    socket.send(JSON.stringify({
      type: 'card-reorder',
      cardId,
      newIndex,
    } satisfies Message));
  }, [socket, isConnected]);

  const addCardExtraData = useCallback((cardId: string, item: string) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'card-extra-data-add',
      cardId,
      extraDataItem: item,
    } satisfies Message));
  }, [socket, isConnected]);

  const updateCardExtraData = useCallback((cardId: string, extraDataIndex: number, updatedItem: string) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'card-extra-data-update',
      cardId,
      extraDataIndex,
      updatedItem,
    } satisfies Message));
  }, [socket, isConnected]);

  const deleteCardExtraData = useCallback((cardId: string, extraDataIndex: number) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'card-extra-data-delete',
      cardId,
      extraDataIndex,
    } satisfies Message));
  }, [socket, isConnected]);


  return {
    activity,
    isConnected,
    updateName,
    updateDates,
    createCard,
    updateCard,
    deleteCard,
    reorderCard,
    addCardExtraData,
    updateCardExtraData,
    deleteCardExtraData,
    loading,
  };
}
