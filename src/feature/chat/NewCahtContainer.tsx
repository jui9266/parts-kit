import { Paperclip } from 'lucide-react'
import React from 'react'

const NewCahtContainer = () => {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <Paperclip size={32} className="text-blue-600" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">시작하기</h2>
      <p className="text-slate-600">UI 이미지를 업로드하면 React 컴포넌트로 변환해드립니다</p>
    </div>
  )
}

export default NewCahtContainer
