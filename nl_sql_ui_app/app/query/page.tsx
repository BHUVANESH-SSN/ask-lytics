import { useState } from "react"
import { ChatBubbleUser } from "../../components/chat-bubble-user"
import { ChatBubbleAI } from "../../components/chat-bubble-ai"
import { InputBar } from "../../components/input-bar"
import { DataTable } from "../../components/data-table"
import { ChartRenderer } from "../../components/chart-renderer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Download, Copy } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  sql?: string
  timestamp: string
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "user",
    content: "Show me all customers from France",
    timestamp: "10:30 AM"
  },
  {
    id: "2",
    type: "ai",
    content: "I'll get all customers from France for you.",
    sql: "SELECT * FROM customers WHERE country = 'France';",
    timestamp: "10:30 AM"
  }
]

const mockData = [
  { customerName: "Atelier graphique", city: "Nantes", creditLimit: 21000 },
  { customerName: "La Rochelle Gifts", city: "Nantes", creditLimit: 118200 },
  { customerName: "Euro+ Shopping Channel", city: "Madrid", creditLimit: 227600 },
]

export default function QueryPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [queryResults, setQueryResults] = useState(mockData)
  const [showResults, setShowResults] = useState(true)

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Here's the SQL query for: "${content}"`,
        sql: `SELECT * FROM customers WHERE country = 'France' LIMIT 10;`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const handleRunQuery = (sql: string) => {
    console.log("Running query:", sql)
    setShowResults(true)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background px-8 py-6">
        <h1 className="text-3xl font-bold">Ask Your Database</h1>
        <p className="mt-2 text-muted-foreground">
          Type a question in natural language and get SQL + results
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message) => (
            message.type === "user" ? (
              <ChatBubbleUser
                key={message.id}
                message={message.content}
                timestamp={message.timestamp}
              />
            ) : (
              <ChatBubbleAI
                key={message.id}
                message={message.content}
                sql={message.sql}
                timestamp={message.timestamp}
                onRunQuery={handleRunQuery}
              />
            )
          ))}

          {/* Results Section */}
          {showResults && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Query Results</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy SQL
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="table" className="w-full">
                <TabsList>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="table" className="mt-4">
                  <DataTable data={queryResults} />
                </TabsContent>
                <TabsContent value="chart" className="mt-4">
                  <ChartRenderer data={queryResults} title="Credit Limit by Customer" />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <InputBar onSend={handleSendMessage} />
    </div>
  )
}
