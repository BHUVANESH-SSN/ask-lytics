import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Clock, Play } from "lucide-react"
import { format } from "date-fns"

interface QueryHistoryCardProps {
  prompt: string
  sql: string
  timestamp: Date
  onRerun?: (sql: string) => void
}

export function QueryHistoryCard({ 
  prompt, 
  sql, 
  timestamp,
  onRerun 
}: QueryHistoryCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{prompt}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {format(timestamp, "MMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRerun?.(sql)}
              className="gap-2"
            >
              <Play className="h-3 w-3" />
              Re-run
            </Button>
          </div>

          {/* SQL Preview */}
          <div className="rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
            <code>{sql.length > 100 ? sql.substring(0, 100) + "..." : sql}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
