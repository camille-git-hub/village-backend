export type Message = {
  _id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
  read: boolean;
};
