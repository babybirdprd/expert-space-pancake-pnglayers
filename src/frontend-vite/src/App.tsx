import React, { useState } from 'react';
import './App.css';
import ImageUpload from './imageUpload';
import ImagePreprocessing from './imagePreprocessing';
import VisualizationTools from './visualizationTools';
import AdvancedTools from './AdvancedTools';
import Automations from './Automations';
import BruteForce from './BruteForce';
import HistoryUndo from './HistoryUndo';
import ManualAdjustments from './ManualAdjustments';

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [preprocessedImage, setPreprocessedImage] = useState<HTMLCanvasElement | null>(null);
  const [visualizedLayers, setVisualizedLayers] = useState<string[]>([]);
  const [advancedLayers, setAdvancedLayers] = useState<string[]>([]);
  const [automatedLayers, setAutomatedLayers] = useState<string[]>([]);
  const [bruteForceLayers, setBruteForceLayers] = useState<string[]>([]);
  const [adjustedLayers, setAdjustedLayers] = useState<string[]>([]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePreprocess = (preprocessedImage: HTMLCanvasElement) => {
    setPreprocessedImage(preprocessedImage);
  };

  const handleVisualize = (visualizedLayers: string[]) => {
    setVisualizedLayers(visualizedLayers);
  };

  const handleApplyAdvancedTools = (layers: string[]) => {
    setAdvancedLayers(layers);
  };

  const handleRunAutomations = (layers: string[]) => {
    setAutomatedLayers(layers);
  };

  const handleStartBruteForce = (layers: string[]) => {
    setBruteForceLayers(layers);
  };

  const handleUndo = (imageUrl: string) => {
    setImageUrl(imageUrl);
  };

  const handleAdjust = (layers: string[]) => {
    setAdjustedLayers(layers);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vite/React App</h1>
        <ImageUpload onUpload={handleImageUpload} />
        {imageUrl && <ImagePreprocessing imageUrl={imageUrl} onPreprocess={handlePreprocess} />}
        {preprocessedImage && <VisualizationTools imageUrl={imageUrl!} onVisualize={handleVisualize} />}
        {visualizedLayers.length > 0 && (
          <div>
            <h2>Visualized Layers</h2>
            {visualizedLayers.map((layer, index) => (
              <img key={index} src={layer} alt={`Layer ${index + 1}`} />
            ))}
          </div>
        )}
        {imageUrl && <AdvancedTools imageUrl={imageUrl} onApply={handleApplyAdvancedTools} />}
        {imageUrl && <Automations imageUrl={imageUrl} onRun={handleRunAutomations} />}
        {imageUrl && <BruteForce imageUrl={imageUrl} onStart={handleStartBruteForce} />}
        {imageUrl && <HistoryUndo onUndo={handleUndo} />}
        {imageUrl && <ManualAdjustments imageUrl={imageUrl} onAdjust={handleAdjust} />}
      </header>
    </div>
  );
}

export default App;
