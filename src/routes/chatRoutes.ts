import { Router } from 'express';
import { getChats, getChatById, createOrGetChat, sendMessage, markAsRead, deleteChat } from '../controllers/chats.ts';
import { verifyToken } from '#middleware';

const chatRoutes = Router();

chatRoutes.get('/', getChats);

chatRoutes.post('/', verifyToken, createOrGetChat);

chatRoutes.get('/:chatId', getChatById);

chatRoutes.post('/:chatId/messages', verifyToken, sendMessage);

chatRoutes.put('/:chatId/read', verifyToken, markAsRead);

chatRoutes.delete('/:chatId', verifyToken, deleteChat);

export default chatRoutes;