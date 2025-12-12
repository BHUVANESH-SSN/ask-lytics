"use client"

import { Sparkles } from "lucide-react"
import { SQLCodeBlock } from "./SQLCodeBlock"
import { Button } from "./ui/button"

interface ChatBubbleAIProps {
  message: string
  sql?: string
  timestamp?: string
  onRunQuery?: () => void
}

export function ChatBubbleAI({ message, sql, timestamp, onRunQuery }: ChatBubbleAIProps) {
  return (
    <div className="flex items-start gap-3 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-primary">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">AI Assistant</span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
            {message}
          </div>
          
          {sql && (
            <div className="space-y-2">
              <SQLCodeBlock code={sql} />
              {onRunQuery && (
                <Button onClick={onRunQuery} size="sm" className="w-fit">
                  Run Query
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
