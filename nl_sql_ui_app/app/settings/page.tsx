import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Switch } from "../../components/ui/switch"

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-background px-8 py-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure your database connection and preferences
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Database Connection */}
          <Card>
            <CardHeader>
              <CardTitle>Database Connection</CardTitle>
              <CardDescription>
                Configure your MySQL database connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="host">Host</Label>
                  <Input id="host" placeholder="localhost" defaultValue="localhost" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="port">Port</Label>
                  <Input id="port" placeholder="3306" defaultValue="3306" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="root" defaultValue="root" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="database">Database Name</Label>
                  <Input id="database" placeholder="classicmodels" defaultValue="classicmodels" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button>Test Connection</Button>
                <Button variant="outline">Save Settings</Button>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Configure your Groq API key for AI-powered SQL generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="groq-key">Groq API Key</Label>
                <Input 
                  id="groq-key" 
                  type="password" 
                  placeholder="gsk_••••••••••••••••••••••••••" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input 
                  id="model" 
                  placeholder="llama-3.1-8b-instant" 
                  defaultValue="llama-3.1-8b-instant"
                />
              </div>
              <Button>Save API Settings</Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Use dark theme across the application
                  </div>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  Clear all query history and reset application data
                </p>
                <Button variant="destructive">Reset Application Data</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
