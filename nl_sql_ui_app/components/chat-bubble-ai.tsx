import { Sparkles, Play, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { SQLCodeBlock } from "./sql-code-block"

interface ChatBubbleAIProps {
  message: string
  sql?: string
  timestamp?: string
  onRunQuery?: (sql: string) => void
}

export function ChatBubbleAI({ 
  message, 
  sql, 
  timestamp,
  onRunQuery 
}: ChatBubbleAIProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (sql) {
      navigator.clipboard.writeText(sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="flex flex-col gap-3 max-w-[80%]">
        <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3">
          <p className="text-sm text-foreground">{message}</p>
        </div>
        
        {sql && (
          <div className="space-y-2">
            <SQLCodeBlock code={sql} />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onRunQuery?.(sql)}
                className="gap-2"
              >
                <Play className="h-3 w-3" />
                Run Query
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy SQL
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        {timestamp && (
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        )}
      </div>
    </div>
  )
}
