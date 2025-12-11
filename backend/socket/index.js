const { handleConnection } = require('./handlers/connectionHandler');
const { handleAssetEvents } = require('./handlers/assetHandler');
const { handleAnnotationEvents } = require('./handlers/annotationHandler');

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        // Connection and authentication handling
        handleConnection(io, socket);

        // Asset-related events
        handleAssetEvents(io, socket);

        // Annotation-related events
        handleAnnotationEvents(io, socket);
    });

    console.log('Socket.IO initialized');

    return io;
};

module.exports = { initializeSocket };
