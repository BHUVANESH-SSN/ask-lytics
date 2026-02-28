"use client"

import { useState, useEffect } from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Database, History, Sparkles, ArrowRight } from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { formatRelativeTime } from "@/lib/helpers"

export default function Home() {
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/history?limit=5")
      .then((res) => res.json())
      .then((data) => {
        if (data.history) {
          setRecentActivity(data.history)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <AppShell>
      <div className="container mx-auto p-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-primary">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Ask Your Database
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Anything
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Transform natural language into powerful SQL queries. No SQL knowledge required.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/ask-query">
              <Button size="lg" className="gap-2">
                Start Asking
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/schema">
              <Button size="lg" variant="outline" className="gap-2">
                View Schema
                <Database className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass">
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary" />
              <CardTitle>Natural Language</CardTitle>
              <CardDescription>
                Ask questions in plain English and get instant SQL queries
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass">
            <CardHeader>
              <Database className="h-10 w-10 text-primary" />
              <CardTitle>Schema Explorer</CardTitle>
              <CardDescription>
                Browse your database structure with an intuitive interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass">
            <CardHeader>
              <History className="h-10 w-10 text-primary" />
              <CardTitle>Query History</CardTitle>
              <CardDescription>
                Access and rerun your previous queries anytime
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Queries</CardDescription>
              <CardTitle className="text-3xl">1,247</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Success Rate</CardDescription>
              <CardTitle className="text-3xl">98%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tables</CardDescription>
              <CardTitle className="text-3xl">8</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Response</CardDescription>
              <CardTitle className="text-3xl">1.2s</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest database interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium truncate">{item.promptText}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</p>
                    </div>
                    <Link href={`/ask-query?sql=${encodeURIComponent(item.generatedSQL)}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">No recent activity. Ask a query to get started!</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
