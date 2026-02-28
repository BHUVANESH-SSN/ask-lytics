"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

interface InputBarProps {
  onSend: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

export function InputBar({
  onSend,
  placeholder = "Ask a question about your data...",
  disabled = false,
}: InputBarProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-lg">
      <div className="mx-auto max-w-4xl p-4">
        <div className="flex gap-3">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] resize-none"
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
