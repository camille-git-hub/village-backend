import {model, Schema} from 'mongoose';
import { messageSchema } from './Message.ts';

const chatSchema = new Schema(
    {   
        participantIds: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        messages: [messageSchema]
    },
    {
        timestamps: true
    }
);

export default model('Chat', chatSchema);