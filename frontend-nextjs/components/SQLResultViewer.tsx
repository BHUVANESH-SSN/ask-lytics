"use client"

import { BarChart, Download, Copy, Play } from "lucide-react"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { DataTable } from "./DataTable"
import { SQLCodeBlock } from "./SQLCodeBlock"

interface SQLResultViewerProps {
  data: Record<string, any>[]
  sql: string
  onRunQuery?: () => void
}

export function SQLResultViewer({ data, sql, onRunQuery }: SQLResultViewerProps) {
  const handleDownloadCSV = () => {
    if (!data || data.length === 0) return

    const headers = Object.keys(data[0])
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] || "")).join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `query-result-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopySQL = async () => {
    await navigator.clipboard.writeText(sql)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Query Results</h3>
          <span className="text-sm text-muted-foreground">
            ({data.length} rows)
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySQL}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy SQL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCSV}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
          {onRunQuery && (
            <Button size="sm" onClick={onRunQuery} className="gap-2">
              <Play className="h-4 w-4" />
              Re-run
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="sql">SQL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="mt-4">
          <DataTable data={data} />
        </TabsContent>
        
        <TabsContent value="chart" className="mt-4">
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Chart visualization coming soon
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sql" className="mt-4">
          <SQLCodeBlock code={sql} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
