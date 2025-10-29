// app/api/chat/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import ChatMessage from '@/models/ChatMessage'
import { Types } from 'mongoose'
import dbConnect from '@/lib/mongodbConnect'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()

  const { id } = await params

  const messages = await ChatMessage.find({ roomId: new Types.ObjectId(id) })
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
