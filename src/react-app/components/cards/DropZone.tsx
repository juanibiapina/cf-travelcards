interface DropZoneProps {
  isVisible: boolean;
  isActive: boolean;
  onDrop: () => void;
}

const DropZone: React.FC<DropZoneProps> = ({ isVisible, isActive, onDrop }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`h-8 mx-4 flex items-center justify-center transition-all duration-300 ease-in-out transform ${
        isActive
          ? 'bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg scale-105 shadow-sm'
          : 'border-2 border-dashed border-gray-200 rounded-lg opacity-50 hover:opacity-70'
      }`}
      onClick={onDrop}
    >
      <div className={`text-sm font-medium transition-all duration-200 ${
        isActive ? 'text-blue-600 animate-pulse' : 'text-gray-400'
      }`}>
        {isActive ? 'Drop here' : ''}
      </div>
    </div>
  );
};

export default DropZone;