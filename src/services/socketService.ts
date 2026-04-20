import { Server as HHTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

type UserSocket = {
    userId: string;
    socket: Socket;
};

const userSockets: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HHTPServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
    
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }
            const secret = process.env.JWT_SECRET || 'your-secret-key';
            const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

            socket.data.userId = decoded._id;
            socket.data.email = decoded.email;

            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log(`A user connected`);
        socket.on('user:register', (userId: string) => {
        userSockets.set(userId, socket.id);
        console.log(`Registered user`);
    });

    socket.on('message:send', (data) => {
        const { chatId, recipientId, message } = data; 
        const recipientSocketId = userSockets.get(recipientId);
        const senderId = socket.data.userId;

        if (recipientSocketId) {
            io.to(recipientSocketId).emit('message:receive', { chatId, message });
            console.log(`Sent message to user in chat ${chatId}`);

        }

            socket.emit('message:sent', { chatId, message });
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('chat:updated', { chatId });
                console.log(`Emitted chat:updated for chat ${chatId}`);
            }
        
        });

        socket.on('typing:start', (data) => {
            const { chatId, recipientId, senderName } = data;
            const recipientSocketId = userSockets.get(recipientId);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing:started', { chatId, senderName });
                console.log(`User started typing in chat ${chatId}`);
            }
        });

        socket.on('typing:stop', (data) => {
            const { chatId, recipientId } = data;
            const recipientSocketId = userSockets.get(recipientId);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing:stopped', { chatId});
                console.log(`User stopped typing in chat ${chatId}`);
            }
        });

        socket.on('disconnect', () => {
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    console.log(`User disconnected and removed from userSockets`);
                    break;
                }
            }
        });
    });

    return io;

};

export { userSockets };

           