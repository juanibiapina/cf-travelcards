import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';

interface HamburgerMenuProps {
  onReorderToggle: () => void;
  isReorderMode: boolean;
  disabled?: boolean;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onReorderToggle,
  isReorderMode,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) &&
          buttonRef.current && !buttonRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleReorderClick = () => {
    onReorderToggle();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleMenuToggle}
        disabled={disabled}
        className={`p-2 rounded-md transition-colors duration-200 ${
          disabled
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        }`}
        aria-label="Activity menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <HiOutlineDotsVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <button
              onClick={handleReorderClick}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
              role="menuitem"
              disabled={isReorderMode}
            >
              <span className="mr-3 text-lg">≡</span>
              Reorder Cards
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;