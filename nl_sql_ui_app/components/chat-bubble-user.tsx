import { User } from "lucide-react"

interface ChatBubbleUserProps {
  message: string
  timestamp?: string
}

export function ChatBubbleUser({ message, timestamp }: ChatBubbleUserProps) {
  return (
    <div className="flex justify-end gap-3">
      <div className="flex flex-col items-end gap-2 max-w-[80%]">
        <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground">
          <p className="text-sm">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        )}
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
        <User className="h-4 w-4 text-primary-foreground" />
      </div>
    </div>
  )
}
