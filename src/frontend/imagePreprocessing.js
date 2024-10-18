document.getElementById('preprocess-button').addEventListener('click', function() {
    const img = new Image();
    img.src = document.getElementById('file-input').files[0];
    img.onload = function() {
        const preprocessedImg = preprocessImage(img);
        // Perform entropy calculation and display result
        const entropy = calculateEntropy(preprocessedImg);
        document.getElementById('entropy-result').innerText = `Entropy: ${entropy}`;

        // Perform layer detection and display result
        const layers = detectLayers(preprocessedImg);
        document.getElementById('layer-result').innerText = `Estimated Layers: ${layers}`;

        // Perform layer separation and display result
        const separatedLayers = separateLayers(preprocessedImg);
        displaySeparatedLayers(separatedLayers);
    };
});

function preprocessImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
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
    return canvas;
}

function createGaussianKernel(size, sigma) {
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
}

function applyConvolution(data, width, height, kernel, kernelSize) {
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
}

function applyEdgeEnhancement(data, width, height) {
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
}
