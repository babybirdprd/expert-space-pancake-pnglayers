document.getElementById('automate-button').addEventListener('click', function() {
    const img = new Image();
    img.src = document.getElementById('file-input').files[0];
    img.onload = function() {
        // Preprocess the image
        const preprocessedImg = preprocessImage(img);
        addToHistory(preprocessedImg);

        // Visualize the layers
        const visualizedLayers = visualizeLayers(preprocessedImg);
        addToHistory(visualizedLayers);

        // Adjust the layers
        const adjustedLayers = adjustLayers(preprocessedImg);
        addToHistory(adjustedLayers);

        // Apply advanced tools
        const advancedLayers = applyAdvancedTools(preprocessedImg);
        addToHistory(advancedLayers);

        // Display the final result
        displayAdvancedLayers(advancedLayers);
    };
});
