'use server'

import dbConnect from '@/lib/mongodbConnect'
import Anthropic from '@anthropic-ai/sdk'
import ChatMessage from '@/models/ChatMessage'
import { Types } from 'mongoose'
import ChatRoom from '@/models/ChatRoom'
import { IChatMessageModel } from '@/models/ChatMessage'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type ChatActionProps = {
  message: string
  roomId: string
  file?: File
  history: IChatMessageModel[]
}

export async function chatAction({ message, roomId, file, history = [] }: ChatActionProps) {
  try {
    await dbConnect()

    if (!message) {
      return {
        success: false,
        error: '메시지가 없습니다.',
      }
    }

    ChatMessage.create({
      roomId: roomId,
      role: 'user',
      content: message,
    })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [
        ...history.map(message => ({
          role: message.role as 'user' | 'assistant',
          content: message.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ],
    })

    ChatMessage.create({
      roomId: roomId,
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
