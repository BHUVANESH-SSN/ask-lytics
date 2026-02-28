"use client"

import { useState } from "react"
import { ChatBubbleUser } from "@/components/ChatBubbleUser"
import { ChatBubbleAI } from "@/components/ChatBubbleAI"
import { InputBar } from "@/components/InputBar"
import { SQLResultViewer } from "@/components/SQLResultViewer"
import { Sparkles, Home } from "lucide-react"
import Link from "next/link"
import { sendQuery, getDefaultConnection, type DatabaseConfig } from "@/lib/api"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  sql?: string
  timestamp: string
}

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
  const [queryResults, setQueryResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSql, setCurrentSql] = useState<string>("")

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Get database connection from settings
    const connection = getDefaultConnection()

    try {
      const response = await sendQuery(content, connection)

      if (response.error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: `Error: ${response.error}`,
          timestamp: new Date().toLocaleTimeString(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "I've generated the SQL query based on your question. Here's what I came up with:",
          sql: response.sql || "",
          timestamp: new Date().toLocaleTimeString(),
        }
        setMessages((prev) => [...prev, aiMessage])

        // Store results and SQL for display
        if (response.data) {
          setQueryResults(response.data)
          setCurrentSql(response.sql || "")
          setShowResults(true)

          // Save to history
          saveToHistory(content, response.sql || "")
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Failed to process query: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const saveToHistory = async (promptText: string, generatedSQL: string) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, generatedSQL }),
      });
    } catch (err) {
      console.error('Failed to save history', err);
    }
  }

  const handleRunQuery = async (sql: string) => {
    setIsLoading(true)
    const connection = getDefaultConnection()

    try {
      const response = await sendQuery(sql, connection)

      if (response.error) {
        alert(`Error: ${response.error}`)
      } else if (response.data) {
        setQueryResults(response.data)
        setCurrentSql(sql)
        setShowResults(true)
      }
    } catch (error) {
      alert(`Failed to run query: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col relative">
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
                onRunQuery={message.sql ? () => handleRunQuery(message.sql!) : undefined}
              />
            )
          )}

          {/* Results Section */}
          {showResults && queryResults.length > 0 && (
            <div className="pt-4">
              <SQLResultViewer
                data={queryResults}
                sql={currentSql}
                onRunQuery={() => handleRunQuery(currentSql)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <InputBar onSend={handleSendMessage} disabled={isLoading} />
    </div>
  )
}
