// app/api/chat/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import ChatMessage from '@/models/ChatMessage'
import dbConnect from '@/lib/mongodbConnect'

export async function GET(req: NextRequest) {
  await dbConnect()

  const messages = await ChatMessage.find().sort({ createdAt: 1 }).lean()

  const serializedMessages = messages.map(msg => ({
    ...msg,
    _id: msg._id?.toString(),
    roomId: msg.roomId.toString(),
    createdAt: msg.createdAt.toISOString(),
    updatedAt: msg.updatedAt.toISOString(),
  }))

  return NextResponse.json(serializedMessages)
}
