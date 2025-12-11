const socketConfig = {
    const socketConfig = {
        cors: {
            origin: true, // Allow all origins
            methods: ['GET', 'POST'],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000,
        transports: ['websocket', 'polling']
    };

    module.exports = socketConfig;
