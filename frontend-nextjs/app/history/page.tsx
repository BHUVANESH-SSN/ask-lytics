"use client"

import { QueryHistoryCard } from "@/components/QueryHistoryCard"
import { History as HistoryIcon } from "lucide-react"

const mockHistory = [
  {
    id: "1",
    prompt: "Show me all customers from France",
    sql: "SELECT * FROM customers WHERE country = 'France';",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    prompt: "What are the top 5 products by quantity in stock?",
    sql: "SELECT productName, quantityInStock FROM products ORDER BY quantityInStock DESC LIMIT 5;",
    timestamp: "3 hours ago",
  },
  {
    id: "3",
    prompt: "List all orders from last month",
    sql: "SELECT * FROM orders WHERE orderDate >= DATE_SUB(NOW(), INTERVAL 1 MONTH);",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    prompt: "Show employees and their office cities",
    sql: "SELECT e.firstName, e.lastName, o.city FROM employees e JOIN offices o ON e.officeCode = o.officeCode;",
    timestamp: "2 days ago",
  },
  {
    id: "5",
    prompt: "Calculate total revenue by product line",
    sql: "SELECT p.productLine, SUM(od.quantityOrdered * od.priceEach) as revenue FROM orderdetails od JOIN products p ON od.productCode = p.productCode GROUP BY p.productLine;",
    timestamp: "3 days ago",
  },
]

export default function HistoryPage() {
  return (
    <div className="container mx-auto p-8 space-y-6">
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
      <div className="space-y-4">
        {mockHistory.map((item) => (
          <QueryHistoryCard
            key={item.id}
            prompt={item.prompt}
            sql={item.sql}
            timestamp={item.timestamp}
            onRerun={() => console.log("Rerun:", item.id)}
          />
        ))}
      </div>
    </div>
  )
}
