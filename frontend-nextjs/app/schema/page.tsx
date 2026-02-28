"use client"

import { useState, useEffect } from "react"
import { SchemaCard } from "@/components/SchemaCard"
import { Input } from "@/components/ui/input"
import { Database, Search, Loader2, Home } from "lucide-react"
import Link from "next/link"
import { getDefaultConnection, getSchema } from "@/lib/api"

interface Column {
  name: string
  type: string
  nullable?: string
  key?: string
}

interface Table {
  table: string
  columns: Column[]
}

export default function SchemaPage() {
  const [search, setSearch] = useState("")
  const [tables, setTables] = useState<Table[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSchema()
  }, [])

  const fetchSchema = async () => {
    setIsLoading(true)
    setError(null)
    const connection = getDefaultConnection()

    try {
      const response = await getSchema(connection)
      if (response.error) {
        setError(response.error)
      } else if (response.schema) {
        setTables(response.schema)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch schema")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTables = tables.filter((table) =>
    table.table.toLowerCase().includes(search.toLowerCase())
  )

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
          <Database className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Database Schema</h1>
          <p className="text-sm text-muted-foreground">
            Explore your database structure
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Tables Grid */}
      {!isLoading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTables.map((table) => (
            <SchemaCard
              key={table.table}
              tableName={table.table}
              columns={table.columns}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && filteredTables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tables found</p>
        </div>
      )}
    </div>
  )
}
