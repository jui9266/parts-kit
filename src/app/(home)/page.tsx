'use client'

import { useEffect, useRef, useState } from 'react'
import { dbConnectTest } from '@/actions/dbConnectTest'
import Header from '@/components/comon/Header'
import MessagesContainer from '@/feature/chat/MessagesContainer'
import ChattingInput from '@/feature/chat/ChattingInput'
import { newChatAction } from '@/actions/newChat'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

export default function AIChatMain() {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File>()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const connect = async () => {
      const result = await dbConnectTest()
      console.log(result)
    }
    connect()
  }, [messages])

  // const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();

  //   if (!message.trim() && !file) return;

  //   // 사용자 메시지 추가
  //   const userMessage: Message = {
  //     role: "user",
  //     content: message,
  //     image: previewUrl,
  //   };
  //   setMessages((prev) => [...prev, userMessage]);

  //   // 입력 초기화
  //   setMessage("");
  //   setFile(undefined);
  //   setPreviewUrl("");
  //   setIsLoading(true);

  //   try {
  //     const formData = new FormData();
  //     if (file) {
  //       formData.append("image", file);
  //     }

  //     const result = await convertToCode(formData);

  //     // AI 응답 추가
  //     const assistantMessage: Message = {
  //       role: "assistant",
  //       content: result.success
  //         ? result.content || "코드를 생성했습니다."
  //         : result.error || "오류가 발생했습니다.",
  //     };
  //     setMessages((prev) => [...prev, assistantMessage]);
  //   } catch (error) {
  //     const errorMessage: Message = {
  //       role: "assistant",
  //       content: "오류가 발생했습니다. 다시 시도해주세요.",
  //     };
  //     setMessages((prev) => [...prev, errorMessage]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    const userMessage = message.trim()
    setMessage('')
    setIsLoading(true)

    await setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      // 대화 히스토리와 함께 API 호출
      const result = await newChatAction(userMessage, file)
      await setMessages(prev => [...prev, { role: 'assistant', content: result.content || '' }])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('복사 실패:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <Header title="Parts Kit AI" description="이미지를 React 컴포넌트로 변환" />
      {/* Messages Container */}
      <MessagesContainer
        messages={[]}
        isLoading={isLoading}
        copied={copied}
        copyToClipboard={copyToClipboard}
        messagesEndRef={messagesEndRef}
      />
      {/* Input Container */}
      <ChattingInput
        handleSubmit={handleSubmit}
        file={file}
        setFile={setFile}
        message={message}
        setMessage={setMessage}
      />{' '}
    </div>
  )
}
