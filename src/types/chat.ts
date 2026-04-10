import type { Message } from './message.ts';

export type Chat = {
  _id: string;
  participantIds: string[];
  messages: Message[];
  createdAt?: Date;
  updatedAt?: Date;
};