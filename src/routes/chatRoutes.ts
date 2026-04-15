import { Router } from 'express';
import { getChats, getChatById, createOrGetChat, sendMessage, markAsRead, deleteChat } from '../controllers/chats.ts';
import { verifyToken } from '#middleware';

const chatRoutes = Router();

chatRoutes.use(verifyToken);

chatRoutes.get('/', getChats);

chatRoutes.post('/', createOrGetChat);

chatRoutes.get('/:chatId', getChatById);

chatRoutes.post('/:chatId/messages', sendMessage);

chatRoutes.put('/:chatId/read', markAsRead);

chatRoutes.delete('/:chatId', deleteChat);

export default chatRoutes;