"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLocalLoading, setIsLocalLoading] = useState(true)

  useEffect(() => {
    // If we're on a public page, don't protect it
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password']
    if (publicPaths.includes(pathname)) {
      setIsAuthenticated(true)
      setIsLocalLoading(false)
      return
    }

    // Wait until NextAuth has finished determining status
    if (status === "loading") {
      return
    }

    const checkAuth = () => {
      // 1. Check local token
      const token = localStorage.getItem('auth_token')

      // 2. Are they logged in via either method?
      if (token || status === "authenticated") {
        setIsAuthenticated(true)
      } else {
        // Not authenticated via local and not authenticated via NextAuth
        setIsAuthenticated(false)
        router.push('/login')
      }
      setIsLocalLoading(false)
    }

    checkAuth()
  }, [router, pathname, status])

  // Show loading spinner if local check is running or NextAuth is still fetching
  if (isLocalLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
