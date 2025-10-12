import { model, models, Schema, Document, Types } from 'mongoose'

export interface IChatMessage extends Document {
  roomId: Types.ObjectId
  role: string
  type: 'text' | 'image'
  content: string
  createdAt: Date
}

export interface IChatMessageModel extends IChatMessage, Document {
  _id: string
}

const ChatMessageSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'ChatRoom',
    },
    type: {
      type: String,
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
  },
  {
    collection: 'chat_messages',
    id: true,
    versionKey: false,
    timestamps: { createdAt: 'createdAt' },
    toJSON: {
      virtuals: true,
      getters: true,
      transform: (_, ret: Record<string, unknown>) => {
        // ObjectId를 string으로 변환
        if (ret._id) {
          ret.id = ret._id.toString()
          delete ret._id
        }
        // 다른 ObjectId 필드들도 변환 (필요시)
        if (ret.createdAt) {
          ret.createdAt = ret.createdAt.toString()
        }
        return ret
      },
    },
  },
)

ChatMessageSchema.index({ createdAt: 1 })
const ChatMessage = models?.ChatMessage || model<IChatMessageModel>('ChatMessage', ChatMessageSchema)

export default ChatMessage
