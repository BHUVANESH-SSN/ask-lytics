"use client"

import { useState, useEffect } from "react"
import { QueryHistoryCard } from "@/components/QueryHistoryCard"
import { History as HistoryIcon, Home, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HistoryItem {
  id: string
  promptText: string
  generatedSQL: string
  createdAt: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/history?page=${page}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        if (data.history) {
          setHistory(data.history)
        }
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [page])

  const handleRerun = (sql: string) => {
    // Navigate to ask-query page with the SQL
    window.location.href = `/ask-query?sql=${encodeURIComponent(sql)}`
  }
  return (
    <div className="container mx-auto p-8 space-y-6 relative">
      <Link href="/" style={{
        position: "absolute", top: "24px", right: "24px", padding: "10px 20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white", textDecoration: "none", borderRadius: "10px",
        fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)", zIndex: 50
      }}>
        <Home size={18} />
        Home
      </Link>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-primary">
          <HistoryIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Query History</h1>
          <p className="text-sm text-muted-foreground">
            View and re-run your previous queries
          </p>
        </div>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="text-center py-12">
          <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No query history yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Run queries from the Ask Query page to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <QueryHistoryCard
              key={item.id}
              prompt={item.promptText}
              sql={item.generatedSQL}
              timestamp={item.createdAt}
              onRerun={() => handleRerun(item.generatedSQL)}
            />
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
