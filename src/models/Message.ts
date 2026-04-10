import { model, Schema} from 'mongoose';

const messageSchema = new Schema(
    {
        senderId: Schema.Types.ObjectId,
        senderName: {type: String, required: true, ref: 'User'},
        content: {type: String, required: true, trim: true},
        createdAt: {type: Date, default: Date.now},
        read: {type: Boolean, default: false},
    },
    {
        timestamps: true
    }
);

export default model('Message', messageSchema);