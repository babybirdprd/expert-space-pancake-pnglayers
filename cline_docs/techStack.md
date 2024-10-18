# Tech Stack

## Key Technology Choices and Architecture Decisions

### Machine Learning
- **Vision Transformer Model**:
  - **Purpose**: Used for layer separation in image processing.
  - **Implementation**: Pre-trained model in WebAssembly (WASM) to ensure efficient CPU usage.
  - **Justification**: Leverages state-of-the-art transformer architecture for image analysis while maintaining performance on the client side.

### Frontend
- **JavaScript Frameworks**:
  - **Transformers.js**: Library used for integrating the Vision Transformer model.
  - **WebAssembly (WASM)**: Enables running the pre-trained model efficiently in the browser.

### Backend
- **Node.js**: For server-side operations and API handling.

### Data Flow
- **Image Upload and Preprocessing**: Images are uploaded and preprocessed before being passed to the Vision Transformer model.
- **Layer Separation**: The model processes the image to separate layers, which are then visualized and manually adjusted as needed.

### External Dependencies
- **Transformers.js**: For integrating the Vision Transformer model.
- **WebAssembly (WASM)**: For efficient execution of the pre-trained model.

### Recent Significant Changes
- **Integration of Vision Transformer Model**: Added for layer separation in image processing.

### User Feedback Integration
- **Automated Layer Separation**: Users can now automatically separate image layers using the Vision Transformer model, improving efficiency and accuracy.
