import { model, models, Schema, Document, Types } from 'mongoose'

export interface IChatRoom extends Document {
  roomTitle: string
  createdAt: Date
  userId: Types.ObjectId
}

const ChatRoomSchema = new Schema(
  {
    roomTitle: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    collection: 'chat_rooms',
    id: true,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
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
        if (ret.updatedAt) {
          ret.updatedAt = ret.updatedAt.toString()
        }
        return ret
      },
    },
  },
)

ChatRoomSchema.index({ createdAt: 1 })

const ChatRoom = models.ChatRoom || model<IChatRoom>('ChatRoom', ChatRoomSchema)

export default ChatRoom
