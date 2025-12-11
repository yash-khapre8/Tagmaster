const socketConfig = {
    cors: {
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:3000',
                'https://tagmaster.vercel.app',
                'https://tagmaster-seven.vercel.app',
                process.env.SOCKET_CORS_ORIGIN
            ].filter(Boolean);

            if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(o => origin.startsWith(o))) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST'],
        credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling']
};

module.exports = socketConfig;
