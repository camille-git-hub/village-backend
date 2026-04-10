import type { Message } from './message.ts';

export type Chat = {
  _id: string;
  participantIds: string[];
  messages: Message[];
  lastMessage?: Message;
  createdAt?: Date;
  updatedAt?: Date;
};