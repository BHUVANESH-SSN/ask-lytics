import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { MessageSquare, Code2, History, Database, Sparkles, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20 px-8 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered SQL Generation
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Ask Your Database Anything
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Transform natural language questions into SQL queries instantly. No SQL knowledge required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/query">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/editor">
              <Button size="lg" variant="outline">
                SQL Editor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-3xl font-bold">Everything You Need</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Natural Language Queries</CardTitle>
                <CardDescription>
                  Ask questions in plain English and get instant SQL results
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <Code2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>SQL Editor</CardTitle>
                <CardDescription>
                  Write and execute SQL queries with syntax highlighting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <History className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Query History</CardTitle>
                <CardDescription>
                  Access all your past queries and re-run them instantly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <Database className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Schema Explorer</CardTitle>
                <CardDescription>
                  Browse your database schema with an intuitive interface
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="border-t border-border px-8 py-16 bg-muted/20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">100%</div>
              <div className="mt-2 text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">&lt;1s</div>
              <div className="mt-2 text-sm text-muted-foreground">Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">∞</div>
              <div className="mt-2 text-sm text-muted-foreground">Queries</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
