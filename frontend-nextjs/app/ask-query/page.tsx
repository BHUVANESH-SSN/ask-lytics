"use client"

import { useState } from "react"
import { ChatBubbleUser } from "@/components/ChatBubbleUser"
import { ChatBubbleAI } from "@/components/ChatBubbleAI"
import { InputBar } from "@/components/InputBar"
import { SQLResultViewer } from "@/components/SQLResultViewer"
import { Sparkles } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  sql?: string
  timestamp: string
}

// Mock data for demonstration
const mockResults = [
  { customerName: "Atelier graphique", country: "France", creditLimit: "21000.00" },
  { customerName: "La Rochelle Gifts", country: "France", creditLimit: "118200.00" },
  { customerName: "Euro+ Shopping Channel", country: "Spain", creditLimit: "227600.00" },
  { customerName: "Saveley & Henriot, Co.", country: "France", creditLimit: "123900.00" },
  { customerName: "Diecast Classics Inc.", country: "USA", creditLimit: "100600.00" },
]

export default function AskQueryPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I'm your SQL assistant. Ask me anything about your database, and I'll generate the SQL query for you.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [showResults, setShowResults] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I've generated the SQL query based on your question. Here's what I came up with:",
        sql: `SELECT customerName, country, creditLimit\nFROM customers\nWHERE country = 'France'\nORDER BY creditLimit DESC\nLIMIT 5;`,
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const handleRunQuery = () => {
    setShowResults(true)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-lg p-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-primary">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ask Your Database</h1>
              <p className="text-sm text-muted-foreground">
                Type a question in natural language and get SQL + results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl p-6 space-y-6">
          {messages.map((message) =>
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
                onRunQuery={message.sql ? handleRunQuery : undefined}
              />
            )
          )}

          {/* Results Section */}
          {showResults && (
            <div className="pt-4">
              <SQLResultViewer
                data={mockResults}
                sql="SELECT customerName, country, creditLimit FROM customers WHERE country = 'France' ORDER BY creditLimit DESC LIMIT 5;"
                onRunQuery={handleRunQuery}
              />
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <InputBar onSend={handleSendMessage} />
    </div>
  )
}
