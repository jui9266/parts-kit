'use client'

import { useEffect, useState } from 'react'
import { Send, Paperclip, X, Loader2, Copy, Check } from 'lucide-react'
import { convertToCode } from '@/actions/convertToCode'
import { dbConnectTest } from '@/actions/dbConnectTest'
import { chatAction } from '@/actions/chat'
import Header from '@/components/comon/Header'
import MessagesContainer from '@/feature/chat/MessagesContainer'
import ChattingInput from '@/feature/chat/ChattingInput'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

export default function AIChatMain() {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File>()
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [chatHistory, setChatHistory] = useState<Message[]>([])

  useEffect(() => {
    const connect = async () => {
      const result = await dbConnectTest()
      console.log(result)
    }
    connect()
  }, [])

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

    // 사용자 메시지를 히스토리에 추가
    const newHistory = [...chatHistory, { role: 'user' as const, content: userMessage }]
    setChatHistory(newHistory)

    await setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      // 대화 히스토리와 함께 API 호출
      const result = await chatAction(userMessage, newHistory)

      // if (result.success && result.content) {
      //   // AI 응답을 히스토리에 추가
      //   setChatHistory([
      //     ...newHistory,
      //     { role: "assistant", content: result.content },
      //   ]);
      //   setMessages([
      //     ...messages,
      //     { role: "assistant", content: result.content },
      //   ]);
      // } else {
      //   console.error("Error:", result.error);
      // }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setFile(undefined)
    setPreviewUrl('')
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
      <MessagesContainer messages={[]} isLoading={isLoading} copied={copied} copyToClipboard={copyToClipboard} />

      {/* Input Container */}
      <ChattingInput />
    </div>
  )
}
