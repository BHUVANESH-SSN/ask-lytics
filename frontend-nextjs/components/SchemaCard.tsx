"use client"

import { Database, Table as TableIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface Column {
  name: string
  type: string
}

interface SchemaCardProps {
  tableName: string
  columns: Column[]
}

export function SchemaCard({ tableName, columns }: SchemaCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TableIcon className="h-4 w-4 text-primary" />
          {tableName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {columns.map((column) => (
            <div
              key={column.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="font-mono text-foreground">{column.name}</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {column.type}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
