import React, { useRef } from 'react';

interface ImagePreprocessingProps {
  imageUrl: string;
  onPreprocess: (preprocessedImage: HTMLCanvasElement) => void;
}

const ImagePreprocessing: React.FC<ImagePreprocessingProps> = ({ imageUrl, onPreprocess }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const preprocessImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply Gaussian blur for noise reduction
    const kernelSize = 5;
    const sigma = 1.4;
    const kernel = createGaussianKernel(kernelSize, sigma);
    const blurredData = applyConvolution(data, canvas.width, canvas.height, kernel, kernelSize);

    // Apply edge enhancement
    const edgeEnhancedData = applyEdgeEnhancement(blurredData, canvas.width, canvas.height);

    const preprocessedImageData = new ImageData(new Uint8ClampedArray(edgeEnhancedData), canvas.width, canvas.height);
    ctx.putImageData(preprocessedImageData, 0, 0);
    onPreprocess(canvas);
  };

  const createGaussianKernel = (size: number, sigma: number) => {
    const kernel = new Array(size).fill(0).map(() => new Array(size).fill(0));
    const center = Math.floor(size / 2);
    let sum = 0;

    for (let x = -center; x <= center; x++) {
      for (let y = -center; y <= center; y++) {
        kernel[x + center][y + center] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma)) / (2 * Math.PI * sigma * sigma);
        sum += kernel[x + center][y + center];
      }
    }

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        kernel[x][y] /= sum;
      }
    }

    return kernel;
  };

  const applyConvolution = (data: Uint8ClampedArray, width: number, height: number, kernel: number[][], kernelSize: number) => {
    const output = new Array(data.length).fill(0);
    const center = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const cx = x + kx - center;
            const cy = y + ky - center;
            if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
              const i = (cy * width + cx) * 4;
              r += data[i] * kernel[ky][kx];
              g += data[i + 1] * kernel[ky][kx];
              b += data[i + 2] * kernel[ky][kx];
              a += data[i + 3] * kernel[ky][kx];
            }
          }
        }
        const i = (y * width + x) * 4;
        output[i] = r;
        output[i + 1] = g;
        output[i + 2] = b;
        output[i + 3] = a;
      }
    }

    return output;
  };

  const applyEdgeEnhancement = (data: number[], width: number, height: number) => {
    const output = new Array(data.length).fill(0);
    const kernel = [
      [-1, -1, -1],
      [-1,  9, -1],
      [-1, -1, -1]
    ];

    const center = 1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        for (let ky = 0; ky < 3; ky++) {
          for (let kx = 0; kx < 3; kx++) {
            const cx = x + kx - center;
            const cy = y + ky - center;
            if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
              const i = (cy * width + cx) * 4;
              r += data[i] * kernel[ky][kx];
              g += data[i + 1] * kernel[ky][kx];
              b += data[i + 2] * kernel[ky][kx];
              a += data[i + 3] * kernel[ky][kx];
            }
          }
        }
        const i = (y * width + x) * 4;
        output[i] = r;
        output[i + 1] = g;
        output[i + 2] = b;
        output[i + 3] = a;
      }
    }

    return output;
  };

  return (
    <div>
      <h2>Image Preprocessing</h2>
      <img src={imageUrl} alt="Preprocessed" onLoad={(e) => preprocessImage(e.target as HTMLImageElement)} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ImagePreprocessing;
