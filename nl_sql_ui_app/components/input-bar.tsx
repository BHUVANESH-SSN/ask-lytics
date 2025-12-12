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
  disabled = false 
}: InputBarProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-border bg-background p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="flex gap-3">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[60px] resize-none"
            rows={2}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!message.trim() || disabled}
            className="h-[60px] w-[60px] shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </div>
  )
}
