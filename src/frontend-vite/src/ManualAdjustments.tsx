import React, { useRef } from 'react';

interface ManualAdjustmentsProps {
  imageUrl: string;
  onAdjust: (layers: string[]) => void;
}

const ManualAdjustments: React.FC<ManualAdjustmentsProps> = ({ imageUrl, onAdjust }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const adjustLayers = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let layers: number[][][] = [];
    let currentLayer: number[][] = [];
    let previousPixel: number[] | null = null;
    for (let i = 0; i < data.length; i += 4) {
      let pixel = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      if (previousPixel && !pixelsEqual(pixel, previousPixel)) {
        layers.push(currentLayer);
        currentLayer = [];
      }
      currentLayer.push(pixel);
      previousPixel = pixel;
    }
    layers.push(currentLayer);

    const adjustedLayers = layers.map(layer => {
      const layerCanvas = document.createElement('canvas');
      const layerCtx = layerCanvas.getContext('2d');
      if (!layerCtx) return '';

      layerCanvas.width = img.width;
      layerCanvas.height = img.height;
      const layerImageData = layerCtx.createImageData(img.width, img.height);
      layerImageData.data.set(new Uint8ClampedArray(layer.flat()));
      layerCtx.putImageData(layerImageData, 0, 0);
      return layerCanvas.toDataURL();
    });

    onAdjust(adjustedLayers);
  };

  const pixelsEqual = (pixel1: number[], pixel2: number[]) => {
    return pixel1.every((value, index) => value === pixel2[index]);
  };

  return (
    <div>
      <h2>Manual Adjustments</h2>
      <img src={imageUrl} alt="Manual Adjustments" onLoad={(e) => adjustLayers(e.target as HTMLImageElement)} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ManualAdjustments;
