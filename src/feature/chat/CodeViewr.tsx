import { Check, Copy } from 'lucide-react'
import React, { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const CodeViewr = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false)

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
    <div className="my-2">
      <SyntaxHighlighter
        language={'typescript'}
        style={atomOneDark}
        customStyle={{
          borderRadius: '8px',
          fontSize: '16px',
          padding: '10px',
          margin: 0,
        }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>

      <button
        onClick={() => copyToClipboard(value)}
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
    </div>
  )
}

export default CodeViewr
