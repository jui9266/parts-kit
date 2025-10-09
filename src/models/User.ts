import { model, models, Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface IUserModel extends IUser, Document {
  _id: string;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
    id: true,
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
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

UserSchema.index({ createdAt: 1 });

const User = models.User || model<IUserModel>("User", UserSchema);

export default User;
