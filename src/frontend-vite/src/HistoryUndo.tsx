import React, { useState } from 'react';

interface HistoryUndoProps {
  onUndo: (imageUrl: string) => void;
}

const HistoryUndo: React.FC<HistoryUndoProps> = ({ onUndo }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      onUndo(history[currentIndex - 1]);
    }
  };

  const addToHistory = (imageUrl: string) => {
    setHistory([...history.slice(0, currentIndex + 1), imageUrl]);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div>
      <h2>History Undo</h2>
      <button onClick={handleUndo}>Undo</button>
    </div>
  );
};

export default HistoryUndo;
