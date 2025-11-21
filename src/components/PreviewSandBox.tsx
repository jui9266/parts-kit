'use client'

import { Sandpack } from '@codesandbox/sandpack-react'

interface PreviewProps {
  code: string
  dependencies?: Record<string, string>
}

export default function Preview({ code, dependencies }: PreviewProps) {
  return (
    <Sandpack
      template="react-ts"
      customSetup={{
        dependencies: {
          'lucide-react': '^0.544.0',
          ...dependencies,
        },
      }}
      options={{
        externalResources: ['https://cdn.tailwindcss.com'],
      }}
      files={{
        '/App.tsx': code,
      }}
    />
  )
}
