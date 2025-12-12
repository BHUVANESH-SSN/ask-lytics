"use client"

import { useState } from "react"
import { Editor } from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { SQLResultViewer } from "@/components/SQLResultViewer"
import { Play, Save, FileCode } from "lucide-react"

const defaultSQL = `-- Write your SQL query here
SELECT 
  customerName, 
  country, 
  creditLimit
FROM customers
WHERE country = 'France'
ORDER BY creditLimit DESC
LIMIT 10;`

const mockResults = [
  { customerName: "Atelier graphique", country: "France", creditLimit: "21000.00" },
  { customerName: "La Rochelle Gifts", country: "France", creditLimit: "118200.00" },
  { customerName: "Euro+ Shopping Channel", country: "Spain", creditLimit: "227600.00" },
]

export default function SQLEditorPage() {
  const [sql, setSQL] = useState(defaultSQL)
  const [results, setResults] = useState<any[] | null>(null)

  const handleRunQuery = () => {
    setResults(mockResults)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-primary">
              <FileCode className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SQL Editor</h1>
              <p className="text-sm text-muted-foreground">
                Write and execute SQL queries directly
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button onClick={handleRunQuery} className="gap-2">
              <Play className="h-4 w-4" />
              Run Query
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="sql"
              value={sql}
              onChange={(value) => setSQL(value || "")}
              theme="vs-dark"
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

        {/* Results Panel */}
        <div className="w-2/5 overflow-auto bg-card/30 p-6">
          {results ? (
            <SQLResultViewer
              data={results}
              sql={sql}
              onRunQuery={handleRunQuery}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Play className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Click "Run Query" to execute your SQL
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
