import { model, Schema} from 'mongoose';

const messageSchema = new Schema(
    {
        senderId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        senderName: {type: String, required: true},
        content: {type: String, required: true, trim: true},
        createdAt: {type: Date, default: Date.now},
        read: {type: Boolean, default: false},
    },
    {
        timestamps: true
    }
);

export { messageSchema };
export default model('Message', messageSchema);