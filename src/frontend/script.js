document.getElementById('upload-button').addEventListener('click', function() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                // Perform entropy calculation and display result
                const entropy = calculateEntropy(img);
                document.getElementById('entropy-result').innerText = `Entropy: ${entropy}`;

                // Perform layer detection and display result
                const layers = detectLayers(img);
                document.getElementById('layer-result').innerText = `Estimated Layers: ${layers}`;

                // Perform layer separation and display result
                const separatedLayers = separateLayers(img);
                displaySeparatedLayers(separatedLayers);
            };
        };
        reader.readAsDataURL(file);
    }
});

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

document.getElementById('visualize-button').addEventListener('click', function() {
    const img = new Image();
    img.src = document.getElementById('file-input').files[0];
    img.onload = function() {
        const visualizedLayers = visualizeLayers(img);
        displayVisualizedLayers(visualizedLayers);
    };
});

document.getElementById('adjust-button').addEventListener('click', function() {
    const img = new Image();
    img.src = document.getElementById('file-input').files[0];
    img.onload = function() {
        const adjustedLayers = adjustLayers(img);
        displayAdjustedLayers(adjustedLayers);
    };
});

document.getElementById('advanced-button').addEventListener('click', function() {
    const img = new Image();
    img.src = document.getElementById('file-input').files[0];
    img.onload = function() {
        const advancedLayers = applyAdvancedTools(img);
        displayAdvancedLayers(advancedLayers);
    };
});

function calculateEntropy(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
        let grayscale = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        histogram[grayscale]++;
    }

    let entropy = 0;
    let totalPixels = data.length / 4;
    for (let i = 0; i < 256; i++) {
        if (histogram[i] > 0) {
            let probability = histogram[i] / totalPixels;
            entropy -= probability * Math.log2(probability);
        }
    }

    return entropy.toFixed(2);
}

function detectLayers(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let layerCount = 0;
    let previousPixel = null;
    for (let i = 0; i < data.length; i += 4) {
        let pixel = [data[i], data[i + 1], data[i + 2], data[i + 3]];
        if (previousPixel && !pixelsEqual(pixel, previousPixel)) {
            layerCount++;
        }
        previousPixel = pixel;
    }

    return layerCount;
}

function pixelsEqual(pixel1, pixel2) {
    return pixel1[0] === pixel2[0] && pixel1[1] === pixel2[1] && pixel1[2] === pixel2[2] && pixel1[3] === pixel2[3];
}

function separateLayers(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let layers = [];
    let currentLayer = [];
    let previousPixel = null;
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

    return layers.map(layer => {
        const layerCanvas = document.createElement('canvas');
        const layerCtx = layerCanvas.getContext('2d');
        layerCanvas.width = img.width;
        layerCanvas.height = img.height;
        const layerImageData = layerCtx.createImageData(img.width, img.height);
        layerImageData.data.set(new Uint8ClampedArray(layer.flat()));
        layerCtx.putImageData(layerImageData, 0, 0);
        return layerCanvas.toDataURL();
    });
}

function displaySeparatedLayers(layers) {
    const container = document.getElementById('separated-layers');
    container.innerHTML = '';
    layers.forEach((layer, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = layer;
        imgElement.alt = `Layer ${index + 1}`;
        container.appendChild(imgElement);
    });
}

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

function visualizeLayers(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let layers = [];
    let currentLayer = [];
    let previousPixel = null;
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

    return layers.map(layer => {
        const layerCanvas = document.createElement('canvas');
        const layerCtx = layerCanvas.getContext('2d');
        layerCanvas.width = img.width;
        layerCanvas.height = img.height;
        const layerImageData = layerCtx.createImageData(img.width, img.height);
        layerImageData.data.set(new Uint8ClampedArray(layer.flat()));
        layerCtx.putImageData(layerImageData, 0, 0);
        return layerCanvas.toDataURL();
    });
}

function displayVisualizedLayers(layers) {
    const container = document.getElementById('separated-layers');
    container.innerHTML = '';
    layers.forEach((layer, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = layer;
        imgElement.alt = `Layer ${index + 1}`;
        container.appendChild(imgElement);
    });
}

function adjustLayers(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let layers = [];
    let currentLayer = [];
    let previousPixel = null;
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

    return layers.map(layer => {
        const layerCanvas = document.createElement('canvas');
        const layerCtx = layerCanvas.getContext('2d');
        layerCanvas.width = img.width;
        layerCanvas.height = img.height;
        const layerImageData = layerCtx.createImageData(img.width, img.height);
        layerImageData.data.set(new Uint8ClampedArray(layer.flat()));
        layerCtx.putImageData(layerImageData, 0, 0);
        return layerCanvas.toDataURL();
    });
}

function displayAdjustedLayers(layers) {
    const container = document.getElementById('separated-layers');
    container.innerHTML = '';
    layers.forEach((layer, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = layer;
        imgElement.alt = `Layer ${index + 1}`;
        container.appendChild(imgElement);
    });
}

function applyAdvancedTools(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let layers = [];
    let currentLayer = [];
    let previousPixel = null;
    for (let i =
