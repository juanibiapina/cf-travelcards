import { useRef, useCallback } from 'react';
import { Card } from '../../../shared';

interface CardComponentProps {
  card: Card;
  isSelected?: boolean;
  onLongPress?: (cardId: string) => void;
  onTouchCancel?: () => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  isSelected = false,
  onLongPress,
  onTouchCancel
}) => {
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };

    touchTimeoutRef.current = setTimeout(() => {
      onLongPress?.(card.id);
      touchTimeoutRef.current = null;
    }, 500);
  }, [card.id, onLongPress]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !touchTimeoutRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    if (deltaX > 10 || deltaY > 10) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
      onTouchCancel?.();
    }
  }, [onTouchCancel]);

  const handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
      onTouchCancel?.();
    }
    touchStartRef.current = null;
  }, [onTouchCancel]);

  return (
    <div
      className={`space-y-3 relative transition-all duration-300 ease-in-out transform ${
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-50 rounded-lg -m-2 p-2 scale-[1.02] shadow-lg'
          : 'hover:shadow-md active:scale-[0.98]'
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      )}
      {card.title && (
        <h3 className={`text-lg font-semibold line-clamp-2 transition-colors duration-200 ${
          isSelected ? 'text-blue-900' : 'text-gray-900'
        }`}>
          {card.title}
        </h3>
      )}
    </div>
  );
};

export default CardComponent;
