'use client'

import { useEffect, useRef, useState } from 'react'
import { dbConnectTest } from '@/actions/dbConnectTest'
import MessagesContainer from '@/feature/chat/MessagesContainer'
import ChattingInput from '@/feature/chat/ChattingInput'
import { newChatAction } from '@/actions/newChat'
import { useRouter } from 'next/navigation'
import { getPresignedPutUrl } from '@/lib/s3'

interface Message {
  role: 'user' | 'assistant'
  content: string
  type: 'text' | 'image'
}

export default function AIChatMain() {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File>()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!file) {
      return alert('변환하고자 하는 이미지를 추가해주세요.')
    }
    const userMessage = message.trim()
    setMessage('')
    setIsLoading(true)

    try {
      const formData = new FormData()
      if (file) {
        formData.append('image', file)
        const presignedUrl = await getPresignedPutUrl('parts-kit', 'part-thumbnail/test.jpg', file.type, 600)

        await fetch(presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        })
        const imageUrl = presignedUrl.split('?')[0]
        formData.append('imageUrl', imageUrl)
      }

      const newMessages: Message[] = []
      const imageUrl = formData.get('imageUrl') as string

      if (imageUrl) {
        newMessages.push({
          role: 'user',
          content: imageUrl,
          type: 'image',
        })
      }

      if (userMessage) {
        newMessages.push({
          role: 'user',
          content: userMessage,
          type: 'text',
        })
      }

      setMessages(newMessages)

      // 대화 히스토리와 함께 API 호출
      const result = await newChatAction(userMessage, formData)
      if (result.success) {
        router.push(`/chat/${result.roomId}`)
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <MessagesContainer isNewChat={true} messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
      <ChattingInput
        handleSubmit={handleSubmit}
        file={file}
        setFile={setFile}
        message={message}
        setMessage={setMessage}
      />
    </div>
  )
}
