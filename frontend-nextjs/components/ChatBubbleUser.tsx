"use client"

import { cn } from "@/lib/utils"
import { User } from "lucide-react"

interface ChatBubbleUserProps {
  message: string
  timestamp?: string
}

export function ChatBubbleUser({ message, timestamp }: ChatBubbleUserProps) {
  return (
    <div className="flex items-start gap-3 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <User className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">You</span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 px-4 py-3 text-sm">
          {message}
        </div>
      </div>
    </div>
  )
}
