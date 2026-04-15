// src/routes/chatRoutes.ts
import { Router } from 'express';
import { getChats, getChatById, createOrGetChat, sendMessage, markAsRead, deleteChat } from '../controllers/chats.ts';
import { verifyToken } from '#middleware';

const chatRoutes = Router();

// All chat routes require authentication
chatRoutes.use(verifyToken);

// Get all chats for the current user
chatRoutes.get('/', getChats);

// Create a new chat or get existing chat with a participant
chatRoutes.post('/', verifyToken, createOrGetChat);

// Get a specific chat by ID
chatRoutes.get('/:chatId', getChatById);

// Send a message to a chat
chatRoutes.post('/:chatId/messages', verifyToken, sendMessage);

// Mark all messages in a chat as read
chatRoutes.put('/:chatId/read', verifyToken, markAsRead);

chatRoutes.delete('/:chatId', verifyToken, deleteChat);

export default chatRoutes;