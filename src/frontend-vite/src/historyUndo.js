let history = [];
let currentIndex = -1;

document.getElementById('undo-button').addEventListener('click', function() {
    if (currentIndex > 0) {
        currentIndex--;
        const img = new Image();
        img.src = history[currentIndex];
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
    }
});

function addToHistory(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    history.push(canvas.toDataURL());
    currentIndex++;
}
