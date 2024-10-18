document.getElementById('advanced-button').addEventListener('click', function() {
    const img = new Image();
    img.src = document.getElementById('file-input').files[0];
    img.onload = function() {
        const advancedLayers = applyAdvancedTools(img);
        displayAdvancedLayers(advancedLayers);
    };
});

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

function displayAdvancedLayers(layers) {
    const container = document.getElementById('separated-layers');
    container.innerHTML = '';
    layers.forEach((layer, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = layer;
        imgElement.alt = `Layer ${index + 1}`;
        container.appendChild(imgElement);
    });
}
