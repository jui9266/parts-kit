'use server'

import dbConnect from '@/lib/mongodbConnect'
import Anthropic from '@anthropic-ai/sdk'
import ChatMessage from '@/models/ChatMessage'
import { Types } from 'mongoose'
import ChatRoom from '@/models/ChatRoom'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export async function newChatAction(message: string, file?: File) {
  try {
    await dbConnect()

    if (!message) {
      return {
        success: false,
        error: '메시지가 없습니다.',
      }
    }

    const room = await ChatRoom.create({
      roomTitle: 'new chat',
      userId: '68e71f7917389007a021f195',
      createdAt: new Date(),
    })

    ChatMessage.create({
      roomId: room._id,
      role: 'user',
      content: message,
    })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })

    ChatMessage.create({
      roomId: room._id,
      role: 'assistant',
      content: response.content[0].type === 'text' ? response.content[0].text : '',
    })

    // console.log(JSON.stringify(response.content[0], null, 2));

    return {
      success: true,
      content: response.content[0].type === 'text' ? response.content[0].text : '',
    }
  } catch (error) {
    console.error('Claude API Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '오류가 발생했습니다.',
    }
  }
}
