import { useState } from "react"
import { SchemaCard } from "../../components/schema-card"
import { Input } from "../../components/ui/input"
import { Search } from "lucide-react"

const mockSchema = [
  {
    tableName: "customers",
    columns: [
      { name: "customerNumber", type: "int", isPrimary: true },
      { name: "customerName", type: "varchar(50)" },
      { name: "contactLastName", type: "varchar(50)" },
      { name: "country", type: "varchar(50)" },
      { name: "creditLimit", type: "decimal(10,2)" },
    ],
  },
  {
    tableName: "orders",
    columns: [
      { name: "orderNumber", type: "int", isPrimary: true },
      { name: "orderDate", type: "date" },
      { name: "status", type: "varchar(15)" },
      { name: "customerNumber", type: "int" },
    ],
  },
  {
    tableName: "products",
    columns: [
      { name: "productCode", type: "varchar(15)", isPrimary: true },
      { name: "productName", type: "varchar(70)" },
      { name: "productLine", type: "varchar(50)" },
      { name: "quantityInStock", type: "smallint" },
      { name: "buyPrice", type: "decimal(10,2)" },
    ],
  },
  {
    tableName: "employees",
    columns: [
      { name: "employeeNumber", type: "int", isPrimary: true },
      { name: "lastName", type: "varchar(50)" },
      { name: "firstName", type: "varchar(50)" },
      { name: "email", type: "varchar(100)" },
      { name: "jobTitle", type: "varchar(50)" },
    ],
  },
]

export default function SchemaPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSchema = mockSchema.filter((table) =>
    table.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-background px-8 py-6">
        <h1 className="text-3xl font-bold">Database Schema</h1>
        <p className="mt-2 text-muted-foreground">
          Browse your database tables and columns
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Schema Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchema.length === 0 ? (
              <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No tables found</p>
              </div>
            ) : (
              filteredSchema.map((table) => (
                <SchemaCard
                  key={table.tableName}
                  tableName={table.tableName}
                  columns={table.columns}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
