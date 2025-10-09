"use client";

import { useEffect, useState } from "react";
import { Send, Paperclip, X, Loader2, Copy, Check } from "lucide-react";
import { convertToCode } from "@/actions/convertToCode";
import { dbConnectTest } from "@/actions/dbConnectTest";
import { chatAction } from "@/actions/chat";
import Header from "@/components/comon/Header";
import MessagesContainer from "@/feature/chat/MessagesContainer";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

export default function AIChatMain() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  console.log(messages);

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
    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    // 사용자 메시지를 히스토리에 추가
    const newHistory = [
      ...chatHistory,
      { role: "user" as const, content: userMessage },
    ];
    setChatHistory(newHistory);

    await setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    try {
      // 대화 히스토리와 함께 API 호출
      const result = await chatAction(userMessage, newHistory);

      if (result.success && result.content) {
        // AI 응답을 히스토리에 추가
        setChatHistory([
          ...newHistory,
          { role: "assistant", content: result.content },
        ]);
        setMessages([
          ...messages,
          { role: "assistant", content: result.content },
        ]);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(undefined);
    setPreviewUrl("");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <Header
        title="Parts Kit AI"
        description="이미지를 React 컴포넌트로 변환"
      />

      {/* Messages Container */}
      <MessagesContainer
        messages={[]}
        isLoading={isLoading}
        copied={copied}
        copyToClipboard={copyToClipboard}
      />

      {/* Input Container */}
      <div className="bg-white border-t border-slate-200 px-4 py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="space-y-3">
              {/* File Preview */}
              {file && previewUrl && (
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-32 rounded-lg border border-slate-300"
                  />
                  <button
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Textarea */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요... (선택사항)"
                className="w-full min-h-[80px] p-3 bg-white border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />

              {/* Buttons */}
              <div className="flex justify-between items-center">
                {/* File Upload Button */}
                <label className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg cursor-pointer transition">
                  <Paperclip size={18} />
                  <span className="text-sm font-medium">이미지 첨부</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={(!message.trim() && !file) || isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>변환 중</span>
                    </>
                  ) : (
                    <>
                      <span>전송</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-center text-xs text-slate-500 mt-2">
            Enter로 전송 • Shift + Enter로 줄바꿈
          </p>
        </div>
      </div>
    </div>
  );
}
