// app/api/chat/[id]/route.ts
import { NextResponse } from 'next/server'
import ChatMessage from '@/models/ChatMessage'
import { Types } from 'mongoose'
import dbConnect from '@/lib/mongodbConnect'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const messages = await ChatMessage.find({ roomId: new Types.ObjectId(params.id) })
    .sort({ createdAt: 1 })
    .lean()

  const serializedMessages = messages.map(msg => ({
    ...msg,
    _id: msg._id?.toString(),
    roomId: msg.roomId.toString(),
    createdAt: msg.createdAt.toISOString(),
    updatedAt: msg.updatedAt.toISOString(),
  }))

  return NextResponse.json(serializedMessages)
}
