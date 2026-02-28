"use client"

import { useState } from "react"
import { Editor } from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { SQLResultViewer } from "@/components/SQLResultViewer"
import { Play, FileCode, Home } from "lucide-react"
import Link from "next/link"
import { executeSql, getDefaultConnection } from "@/lib/api"

const defaultSQL = `-- Write your SQL query here
SELECT 
  customerName, 
  country, 
  creditLimit
FROM customers
WHERE country = 'France'
ORDER BY creditLimit DESC
LIMIT 10;`

export default function SQLEditorPage() {
  const [sql, setSQL] = useState(defaultSQL)
  const [results, setResults] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRunQuery = async () => {
    if (!sql.trim()) {
      setError("Please enter a SQL query")
      return
    }

    setIsLoading(true)
    setError(null)
    const connection = getDefaultConnection()

    try {
      const response = await executeSql(sql, connection)

      if (response.error) {
        setError(response.error)
        setResults(null)
      } else if (response.data) {
        setResults(response.data)
        setError(null)
      } else if (response.message) {
        setError(null)
        setResults([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to execute query")
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col relative">
      <Link href="/" style={{
        position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)", padding: "10px 20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white", textDecoration: "none", borderRadius: "10px",
        fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)", zIndex: 50
      }}>
        <Home size={18} />
        Home
      </Link>
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
            <Button onClick={handleRunQuery} className="gap-2" disabled={isLoading}>
              <Play className="h-4 w-4" />
              {isLoading ? "Running..." : "Run Query"}
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
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 mb-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

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
                  Click &quot;Run Query&quot; to execute your SQL
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
