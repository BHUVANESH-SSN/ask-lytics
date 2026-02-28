"use client"

import { Sidebar } from "@/components/Sidebar"
import Link from "next/link"
import { Home } from "lucide-react"

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <main className="ml-64 flex-1 overflow-auto relative p-6">
                {children}
            </main>
        </div>
    )
}
