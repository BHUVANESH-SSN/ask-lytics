"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { getUserInitials } from "@/lib/helpers"
import {
  Home,
  MessageSquare,
  FileCode,
  History,
  Database,
  Settings,
  Sparkles
} from "lucide-react"
import { UserProfileDialog } from "./UserProfileDialog"

interface UserData {
  name: string
  email: string
}

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: MessageSquare, label: "Ask Query", href: "/ask-query" },
  { icon: FileCode, label: "SQL Editor", href: "/sql-editor" },
  { icon: History, label: "Query History", href: "/history" },
  { icon: Database, label: "Database Schema", href: "/schema" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<UserData>({ name: "User", email: "user@email.com" })
  const [showProfile, setShowProfile] = useState(false)

  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name || "User",
        email: session.user.email || ""
      })
    } else {
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [session])

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-lg">
        <div className="flex h-full flex-col gap-2">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Ask Lytics
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Footer - User Profile */}
          <div className="border-t border-border p-4">
            <button
              onClick={() => setShowProfile(true)}
              className="w-full flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 hover:bg-muted transition-colors cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {getUserInitials(user.name)}
              </div>
              <div className="flex-1 text-sm text-left">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <UserProfileDialog open={showProfile} onOpenChange={setShowProfile} />
    </>
  )
}
