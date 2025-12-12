import { useState } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { DataTable } from "../../components/data-table"
import { Play, Database } from "lucide-react"

const mockSchema = [
  { table: "customers", column: "customerNumber", type: "int" },
  { table: "customers", column: "customerName", type: "varchar(50)" },
  { table: "customers", column: "country", type: "varchar(50)" },
  { table: "orders", column: "orderNumber", type: "int" },
  { table: "orders", column: "orderDate", type: "date" },
]

const mockResults = [
  { customerName: "Atelier graphique", country: "France", creditLimit: 21000 },
  { customerName: "Signal Gift Stores", country: "USA", creditLimit: 71800 },
]

export default function EditorPage() {
  const [sql, setSql] = useState("SELECT * FROM customers LIMIT 10;")
  const [results, setResults] = useState(mockResults)
  const [isRunning, setIsRunning] = useState(false)

  const handleRunQuery = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
    }, 1000)
  }

  return (
    <div className="flex h-screen">
      {/* Main Editor Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-border bg-background px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SQL Editor</h1>
              <p className="mt-2 text-muted-foreground">
                Write and execute SQL queries directly
              </p>
            </div>
            <Button onClick={handleRunQuery} disabled={isRunning} className="gap-2">
              <Play className="h-4 w-4" />
              {isRunning ? "Running..." : "Run Query"}
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 border-b border-border p-4">
          <div className="h-full overflow-hidden rounded-lg border border-border">
            <Editor
              height="100%"
              language="sql"
              theme="vs-dark"
              value={sql}
              onChange={(value: string | undefined) => setSql(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Results */}
        <div className="h-1/2 overflow-y-auto p-8">
          <DataTable data={results} title="Query Results" />
        </div>
      </div>

      {/* Schema Sidebar */}
      <div className="w-80 border-l border-border bg-card/50 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Schema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["customers", "orders", "products"].map((table) => (
                <div key={table} className="rounded-lg border border-border p-3">
                  <div className="font-medium">{table}</div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {mockSchema
                      .filter((s) => s.table === table)
                      .map((col, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{col.column}</span>
                          <span>{col.type}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
