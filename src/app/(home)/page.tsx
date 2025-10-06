"use client";

import { useState } from "react";
import { Send, Paperclip, X, Loader2, Copy, Check } from "lucide-react";
import { convertToCode } from "@/_action/convertToCode";

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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!message.trim() && !file) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      role: "user",
      content: message,
      image: previewUrl,
    };
    setMessages((prev) => [...prev, userMessage]);

    // 입력 초기화
    setMessage("");
    setFile(undefined);
    setPreviewUrl("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("image", file);
      }

      const result = await convertToCode(formData);

      // AI 응답 추가
      const assistantMessage: Message = {
        role: "assistant",
        content: result.success
          ? result.content || "코드를 생성했습니다."
          : result.error || "오류가 발생했습니다.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "오류가 발생했습니다. 다시 시도해주세요.",
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() || file) {
        handleSubmit(e as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    }
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
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800">AI Chat</h1>
          <p className="text-sm text-slate-600">
            이미지를 React 컴포넌트로 변환
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Paperclip size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                시작하기
              </h2>
              <p className="text-slate-600">
                UI 이미지를 업로드하면 React 컴포넌트로 변환해드립니다
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-800 border border-slate-200"
                  } rounded-2xl p-4 shadow-sm`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Uploaded"
                      className="rounded-lg mb-3 max-h-64 object-contain"
                    />
                  )}
                  {msg.content && (
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  )}
                  {msg.role === "assistant" && msg.content.includes("```") && (
                    <button
                      onClick={() => copyToClipboard(msg.content)}
                      className="mt-2 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800"
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          <span>복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>코드 복사</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Loader2 size={18} className="animate-spin" />
                  <span>코드 생성 중...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
                onKeyDown={handleKeyDown}
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
