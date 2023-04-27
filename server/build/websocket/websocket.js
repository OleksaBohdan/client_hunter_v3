import { wss } from '../app.js';
export const clients = {};
export function socketMessage(text, type) {
    const message = {
        message: text,
        type: type,
    };
    return message;
}
export const webSocketHandlers = async () => {
    wss.on('connection', (ws) => {
        console.log('Websocket connected');
        const handleWebSocketConnection = async (ws) => {
            ws.on('message', (message) => {
                const data = JSON.parse(message.toString());
                if (data.type === 'userId') {
                    const userId = data.data;
                    clients[userId] = ws;
                }
            });
            ws.on('close', () => {
                Object.keys(clients).forEach((userId) => {
                    if (clients[userId] === ws) {
                        delete clients[userId];
                    }
                });
            });
        };
        handleWebSocketConnection(ws);
    });
};
//# sourceMappingURL=websocket.js.map