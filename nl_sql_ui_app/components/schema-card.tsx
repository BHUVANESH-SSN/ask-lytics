import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Database, Hash, Type, Calendar } from "lucide-react"

interface SchemaCardProps {
  tableName: string
  columns: {
    name: string
    type: string
    isPrimary?: boolean
  }[]
}

const getTypeIcon = (type: string) => {
  if (type.includes("int") || type.includes("decimal")) return Hash
  if (type.includes("varchar") || type.includes("text")) return Type
  if (type.includes("date") || type.includes("time")) return Calendar
  return Database
}

export function SchemaCard({ tableName, columns }: SchemaCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="h-5 w-5 text-primary" />
          {tableName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {columns.map((column, i) => {
            const Icon = getTypeIcon(column.type)
            return (
              <div
                key={i}
                className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{column.name}</span>
                  {column.isPrimary && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                      PK
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{column.type}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
