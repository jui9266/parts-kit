"use client";

import { useState } from "react";
import { Send, Paperclip, X } from "lucide-react";

export default function AIChatMain() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File>();

  const handleSubmit = () => {
    if (message.trim() || file) {
      setMessage("");
      setFile(undefined);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFile(selectedFiles[0]);
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">AI Chat</h1>
          <p className="text-slate-600">무엇이든 물어보세요</p>
        </div>

        {/* Chat Input Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-4">
            {/* File Attachments */}
            {file && (
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm">
                  <Paperclip size={14} className="text-slate-600" />
                  <span className="text-slate-700 max-w-[200px] truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile()}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Textarea */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="w-full min-h-[150px] p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              onKeyDown={handleKeyDown}
            />

            {/* Buttons */}
            <div className="flex justify-between items-center">
              {/* File Upload Button */}
              <label className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition">
                <Paperclip size={18} />
                <span className="text-sm">파일 첨부</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim() && !file}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                <span>전송</span>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-center text-sm text-slate-500 mt-4">
          Enter로 전송 • Shift + Enter로 줄바꿈
        </p>
      </div>
    </div>
  );
}
