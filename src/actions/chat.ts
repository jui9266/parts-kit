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

export async function chatAction(message: string, history: Message[] = []) {
  try {
    await dbConnect()

    if (!message) {
      return {
        success: false,
        error: '메시지가 없습니다.',
      }
    }

    // 대화 히스토리를 Anthropic API 형식으로 변환
    const messages = history.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

    const room = await ChatRoom.findOne({})

    ChatMessage.create({
      roomId: room?._id,
      role: 'user',
      content: message,
    })

    // const response = await anthropic.messages.create({
    //   model: "claude-sonnet-4-5-20250929",
    //   max_tokens: 100,
    //   messages: messages,
    // });

    // console.log(JSON.stringify(response.content[0], null, 2));

    // return {
    //   success: true,
    //   content:
    //     response.content[0].type === "text" ? response.content[0].text : "",
    // };
  } catch (error) {
    console.error('Claude API Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '오류가 발생했습니다.',
    }
  }
}
