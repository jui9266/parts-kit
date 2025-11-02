import { messageContent } from '../types/messageContent'

export const parseMessageContent = (content: string): messageContent[] => {
  const parts: messageContent[] = []
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        value: content.slice(lastIndex, match.index),
      })
    }

    // Add code block
    parts.push({
      type: 'code',
      value: match[2],
    })

    lastIndex = regex.lastIndex
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      value: content.slice(lastIndex),
    })
  }

  return parts
}
