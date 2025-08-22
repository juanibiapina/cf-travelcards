import { useState } from "react";
import DateSelector from "./DateSelector";
import HamburgerMenu from "./HamburgerMenu";

interface ReorderConfig {
  isReorderMode: boolean;
  hasCards: boolean;
  onToggle: () => void;
}

interface ActivityHeaderProps {
  activityName?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  onNameUpdate: (name: string) => void;
  onDateChange: (startDate: string, endDate?: string, startTime?: string) => void;
  disabled?: boolean;
  reorder?: ReorderConfig;
}

const ActivityHeader = ({
  activityName,
  startDate,
  endDate,
  startTime,
  onNameUpdate,
  onDateChange,
  disabled = false,
  reorder
}: ActivityHeaderProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameText, setNameText] = useState("");

  const handleNameClick = () => {
    setIsEditingName(true);
    setNameText(activityName || "");
  };

  const handleNameSubmit = () => {
    if (nameText.trim()) {
      onNameUpdate(nameText.trim());
    }
    setIsEditingName(false);
    setNameText("");
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
    setNameText("");
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  return (
    <header className="bg-gray-800 text-white px-4 py-6 shadow-md">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 max-w-full">
                <input
                  type="text"
                  value={nameText}
                  onChange={(e) => setNameText(e.target.value)}
                  onKeyDown={handleNameKeyPress}
                  className="flex-1 min-w-0 text-xl sm:text-2xl font-semibold bg-white text-gray-900 px-3 py-2 rounded border-none outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter activity name"
                  autoFocus
                  disabled={disabled}
                />
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleNameCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    disabled={disabled}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNameSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    disabled={disabled}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h1
                  className="text-2xl sm:text-3xl font-bold cursor-pointer hover:text-blue-200 transition-colors break-words"
                  onClick={handleNameClick}
                >
                  {activityName || "Click to name this activity"}
                </h1>
                <DateSelector
                  startDate={startDate}
                  endDate={endDate}
                  startTime={startTime}
                  onDateChange={onDateChange}
                  disabled={disabled}
                />
              </div>
            )}
          </div>

          {reorder?.isReorderMode ? (
            <button
              onClick={reorder.onToggle}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              disabled={disabled}
            >
              Done
            </button>
          ) : (
            <div className="ml-4">
              {reorder?.hasCards && (
                <HamburgerMenu
                  onReorderToggle={reorder.onToggle}
                  isReorderMode={reorder.isReorderMode}
                  disabled={disabled}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ActivityHeader;