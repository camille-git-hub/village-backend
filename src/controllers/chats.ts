import type { RequestHandler } from "express";
import { Chat } from '../models/index.ts';
import { User } from '../models/index.ts';

  const getChats: RequestHandler = async (req, res, next) => {
      try {
          const userId = req.user._id;

          const chats = await Chat.find({ participantIds: userId })
                .populate('participantIds', 'email firstName lastName')
                .sort({ createdAt: -1 });
          
          res.status(200).json({ message: "Get all chat conversations", data: chats });
      } catch (error) {
      next(error);
       }
    };

  const getChatById: RequestHandler = async (req, res, next) => {
      try {
            const userId = req.user._id;
            const { chatId } = req.params;

            const chat = await Chat.findById(chatId)
                .populate('participantIds', 'email firstName lastName');

          if (!chat) {
              return res.status(404).json({ message: "Chat not found" });
          }

          const isParticipant = chat.participantIds.some((id: any) => id._id.toString() === userId.toString());

          if (!isParticipant) {
                return res.status(403).json({ message: "Unauthorized access" });
          }

          res.status(200).json({ message: "Chat found", data: chat });
      } catch (error) {
          next(error);
      }
  };

  const createOrGetChat: RequestHandler = async (req, res, next) => {

        try {
            const userId = req.user._id;
            const { participantId } = req.body;
            //const { chatId } = req.params;
          
            if (!participantId) {
                return res.status(400).json({ message: "Participant ID is required" });
            }

            if (participantId === userId) {
                return res.status(400).json({ message: "Cannot create chat with yourself" });
            }

            const participantExists = await User.findById(participantId);
            if (!participantExists) {
                return res.status(404).json({ message: "Participant user not found" });
            }

            let chat = await Chat.findOne({ 
                participantIds: { $all: [userId, participantId], $size: 2 } 
            }).populate('participantIds', 'email firstName lastName');

            if (!chat) {
                chat = await Chat.create({participantIds: [userId, participantId], messages: []} ) as any;

                chat = await Chat.findById(chat!._id).populate('participantIds', 'email firstName lastName');
                }

            res.status(201).json({ message: "Chat created successfully", data: chat });

        } catch (error) {
            next(error);    
        }
  };

  const sendMessage: RequestHandler = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const userName = `${req.user.firstName} ${req.user.lastName}`;
            const { chatId } = req.params;
            const { content } = req.body;

            if (!content || content.trim() === "" || typeof content !== "string") {
                return res.status(400).json({ message: "Message content is required" });
            }

            const chat = await Chat.findById(chatId);
            
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }

            const isParticipant = chat.participantIds.some((id: any) => id.toString() === userId.toString());

            if (!isParticipant) {
                return res.status(403).json({ message: "Unauthorized access" });
            }

            const newMessage = {
                senderId: userId,
                senderName: userName,
                content: content.trim(),
                createdAt: new Date(),
                read: false
            };

            chat.messages.push(newMessage);
            await chat.save();

            const updatedChat = await Chat.findById(chatId).populate('participantIds', 'email firstName lastName');
            res.status(200).json({ message: "Message sent successfully", data: updatedChat });
        } catch (error) {
            next(error);
        }

  };

  const markAsRead: RequestHandler = async (req, res, next) => {
        try {
        
            const { chatId } = req.params;
            const chat = await Chat.findById(chatId);
            const userId = req.user._id;

            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }

            const isParticipant = chat.participantIds.some((id: any) => id.toString() === userId.toString());

            if (!isParticipant) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            chat.messages.forEach((message: any) => {
                if (!message.read) {
                    message.read = true;
                }
            });

            await chat.save();

            const updatedChat = await Chat.findById(chatId).populate('participantIds', 'email firstName lastName');
            res.status(200).json({ message: "Messages marked as read", data: updatedChat });
        } catch (error) {
            next(error);
        }
    
  };

  const deleteChat: RequestHandler = async (req, res, next) => {
        try {
            const { chatId } = req.params;
            const userId = req.user._id;
            
            const chat = await Chat.findById(chatId);

            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }

            const isParticipant = chat.participantIds.some((id: any) => id.toString() === userId.toString());

            if (!isParticipant) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            await Chat.findByIdAndDelete(chatId);
            res.status(200).json({ message: "Chat deleted successfully" });
        } catch (error) {
            next(error);
        }
  };

export { getChats, getChatById, createOrGetChat, sendMessage, markAsRead, deleteChat };