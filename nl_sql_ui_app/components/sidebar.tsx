"use client"

import { Link, useLocation } from "react-router-dom"
import { 
  Home, 
  MessageSquare, 
  Code2, 
  History, 
  Database, 
  Settings,
  Sparkles
} from "lucide-react"
import { cn } from "../lib/utils"

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Ask Query",
    href: "/query",
    icon: MessageSquare,
  },
  {
    title: "SQL Editor",
    href: "/editor",
    icon: Code2,
  },
  {
    title: "Query History",
    href: "/history",
    icon: History,
  },
  {
    title: "Database Schema",
    href: "/schema",
    icon: Database,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">NL → SQL</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium">Connected to:</p>
            <p className="mt-1 truncate">classicmodels</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
