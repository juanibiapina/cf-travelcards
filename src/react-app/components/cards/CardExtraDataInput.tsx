import { useState, useCallback, useRef, useEffect } from 'react';

interface CardExtraDataInputProps {
  onAddExtraData: (item: string) => void;
  onClose: () => void;
}

export const CardExtraDataInput: React.FC<CardExtraDataInputProps> = ({
  onAddExtraData,
  onClose
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddExtraData(inputValue.trim());
      setInputValue('');
      onClose();
    }
  }, [inputValue, onAddExtraData, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onClose}
        placeholder="Add extra data..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </form>
  );
};

export default CardExtraDataInput;