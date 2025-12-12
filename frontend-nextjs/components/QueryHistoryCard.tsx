"use client"

import { Clock, Play } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

interface QueryHistoryCardProps {
  prompt: string
  sql: string
  timestamp: string
  onRerun?: () => void
}

export function QueryHistoryCard({
  prompt,
  sql,
  timestamp,
  onRerun,
}: QueryHistoryCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-tight">{prompt}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {timestamp}
              </div>
            </div>
            {onRerun && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRerun}
                className="gap-2"
              >
                <Play className="h-3 w-3" />
                Re-run
              </Button>
            )}
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <code className="text-xs font-mono">{sql}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
