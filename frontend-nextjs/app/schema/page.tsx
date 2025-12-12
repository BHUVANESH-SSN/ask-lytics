"use client"

import { useState } from "react"
import { SchemaCard } from "@/components/SchemaCard"
import { Input } from "@/components/ui/input"
import { Database, Search } from "lucide-react"

const mockTables = [
  {
    name: "customers",
    columns: [
      { name: "customerNumber", type: "INT" },
      { name: "customerName", type: "VARCHAR(50)" },
      { name: "contactLastName", type: "VARCHAR(50)" },
      { name: "contactFirstName", type: "VARCHAR(50)" },
      { name: "phone", type: "VARCHAR(50)" },
      { name: "addressLine1", type: "VARCHAR(50)" },
      { name: "city", type: "VARCHAR(50)" },
      { name: "country", type: "VARCHAR(50)" },
      { name: "creditLimit", type: "DECIMAL(10,2)" },
    ],
  },
  {
    name: "products",
    columns: [
      { name: "productCode", type: "VARCHAR(15)" },
      { name: "productName", type: "VARCHAR(70)" },
      { name: "productLine", type: "VARCHAR(50)" },
      { name: "productScale", type: "VARCHAR(10)" },
      { name: "quantityInStock", type: "SMALLINT" },
      { name: "buyPrice", type: "DECIMAL(10,2)" },
      { name: "MSRP", type: "DECIMAL(10,2)" },
    ],
  },
  {
    name: "orders",
    columns: [
      { name: "orderNumber", type: "INT" },
      { name: "orderDate", type: "DATE" },
      { name: "requiredDate", type: "DATE" },
      { name: "shippedDate", type: "DATE" },
      { name: "status", type: "VARCHAR(15)" },
      { name: "customerNumber", type: "INT" },
    ],
  },
  {
    name: "employees",
    columns: [
      { name: "employeeNumber", type: "INT" },
      { name: "lastName", type: "VARCHAR(50)" },
      { name: "firstName", type: "VARCHAR(50)" },
      { name: "email", type: "VARCHAR(100)" },
      { name: "officeCode", type: "VARCHAR(10)" },
      { name: "jobTitle", type: "VARCHAR(50)" },
    ],
  },
]

export default function SchemaPage() {
  const [search, setSearch] = useState("")

  const filteredTables = mockTables.filter((table) =>
    table.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container mx-auto p-8 space-y-6">
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

      {/* Tables Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTables.map((table) => (
          <SchemaCard
            key={table.name}
            tableName={table.name}
            columns={table.columns}
          />
        ))}
      </div>
    </div>
  )
}
