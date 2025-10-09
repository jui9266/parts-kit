import { model, models, Schema, Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  messageId: Types.ObjectId;
  roomId: Types.ObjectId;
  role: string;
  content: string;
  createAt: Date;
}

const ChatMessageSchema = new Schema(
  {
    messageId: {
      type: Types.ObjectId,
      required: true,
    },
    roomId: {
      type: Types.ObjectId,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createAt: {
      type: String,
      required: true,
    },
  },
  {
    collection: "chatMessages",
    id: true,
    versionKey: false,
    timestamps: { createdAt: "createdAt" },
    toJSON: {
      virtuals: true,
      getters: true,
      transform: (_, ret: Record<string, unknown>) => {
        // ObjectId를 string으로 변환
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        // 다른 ObjectId 필드들도 변환 (필요시)
        if (ret.createdAt) {
          ret.createdAt = ret.createdAt.toString();
        }
        if (ret.updatedAt) {
          ret.updatedAt = ret.updatedAt.toString();
        }
        return ret;
      },
    },
  }
);

ChatMessageSchema.index({ createdAt: 1 });

const ChatMessage =
  models.ChatMessage || model<IChatMessage>("ChatMessage", ChatMessageSchema);

export default ChatMessage;
