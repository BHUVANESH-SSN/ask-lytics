"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Settings as SettingsIcon, Database, Key, Palette, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [dbConfig, setDbConfig] = useState({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "classicmodels",
  })

  const [apiKey, setApiKey] = useState("")

  return (
    <div className="container mx-auto p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-primary">
          <SettingsIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your application configuration
          </p>
        </div>
      </div>

      {/* Database Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Database Connection</CardTitle>
          </div>
          <CardDescription>
            Configure your MySQL database connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Host</label>
              <Input
                value={dbConfig.host}
                onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                placeholder="localhost"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Port</label>
              <Input
                value={dbConfig.port}
                onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                placeholder="3306"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={dbConfig.user}
                onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                placeholder="root"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={dbConfig.password}
                onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Database Name</label>
            <Input
              value={dbConfig.database}
              onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
              placeholder="classicmodels"
            />
          </div>
          <div className="flex gap-2">
            <Button>Test Connection</Button>
            <Button variant="outline">Save</Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>API Keys</CardTitle>
          </div>
          <CardDescription>
            Manage your Groq API key for AI-powered SQL generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Groq API Key</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_••••••••••••••••••••••••"
            />
          </div>
          <Button>Save API Key</Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Theme</CardTitle>
          </div>
          <CardDescription>
            Customize the application appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline">Light</Button>
            <Button>Dark</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions - proceed with caution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Clear all query history and reset application data
            </p>
            <Button variant="destructive">Reset Application Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
