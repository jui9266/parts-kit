// components/MessageContent.tsx
import CodeViewr from './CodeViewr'
import { messageContent } from './types/messageContent'

interface MessageContentProps {
  msg: {
    role: string
    content: string
  }
}

export function AssistantMessage({ msg }: MessageContentProps) {
  const parts: messageContent[] = []
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(msg.content)) !== null) {
    if (match.index > lastIndex) {
      // non-code before this code block
      parts.push({
        type: 'text',
        value: msg.content.slice(lastIndex, match.index),
      })
    }

    // code block
    parts.push({
      type: 'code',
      value: match[2],
    })
    lastIndex = regex.lastIndex
  }

  // Any trailing text
  if (lastIndex < msg.content.length) {
    parts.push({
      type: 'text',
      value: msg.content.slice(lastIndex),
    })
  }

  return (
    <div className="whitespace-pre-wrap break-words">
      {parts.map((part, index) =>
        part.type === 'code' ? <CodeViewr key={index} value={part.value} /> : <span key={index}>{part.value}</span>,
      )}
    </div>
  )
}
