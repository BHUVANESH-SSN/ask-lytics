import { useState } from "react"
import { QueryHistoryCard } from "../../components/query-history-card"
import { Input } from "../../components/ui/input"
import { Search } from "lucide-react"

const mockHistory = [
  {
    id: "1",
    prompt: "Show me all customers from France",
    sql: "SELECT * FROM customers WHERE country = 'France';",
    timestamp: new Date(2024, 11, 10, 10, 30),
  },
  {
    id: "2",
    prompt: "What are the top 5 products by sales?",
    sql: "SELECT productName, SUM(quantityOrdered * priceEach) as totalSales FROM products p JOIN orderdetails od ON p.productCode = od.productCode GROUP BY p.productCode ORDER BY totalSales DESC LIMIT 5;",
    timestamp: new Date(2024, 11, 10, 9, 15),
  },
  {
    id: "3",
    prompt: "List all employees in the Sales department",
    sql: "SELECT firstName, lastName, jobTitle FROM employees WHERE jobTitle LIKE '%Sales%';",
    timestamp: new Date(2024, 11, 9, 16, 45),
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [history] = useState(mockHistory)

  const filteredHistory = history.filter(
    (item) =>
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sql.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRerun = (sql: string) => {
    console.log("Re-running query:", sql)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-background px-8 py-6">
        <h1 className="text-3xl font-bold">Query History</h1>
        <p className="mt-2 text-muted-foreground">
          View and re-run your previous queries
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search queries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* History List */}
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No queries found</p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <QueryHistoryCard
                  key={item.id}
                  prompt={item.prompt}
                  sql={item.sql}
                  timestamp={item.timestamp}
                  onRerun={handleRerun}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
