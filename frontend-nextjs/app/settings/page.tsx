"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Database, AlertTriangle } from "lucide-react";
import { getDefaultConnection, saveConnection, testConnection, type DatabaseConfig } from "@/lib/api";

export default function SettingsPage() {
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Bhuvi@123",
    database: "classicmodels",
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success?: boolean; message?: string }>({});

  useEffect(() => {
    const savedConfig = getDefaultConnection();
    setDbConfig(savedConfig);
  }, []);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus({});
    
    try {
      const result = await testConnection(dbConfig);
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: error instanceof Error ? error.message : "Failed to test connection",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveConnection = () => {
    saveConnection(dbConfig);
    alert("Database configuration saved successfully!");
  };

  return (
    <div className="container mx-auto p-8 space-y-6 max-w-4xl">
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
                type="number"
                value={dbConfig.port}
                onChange={(e) => setDbConfig({ ...dbConfig, port: parseInt(e.target.value) || 3306 })}
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
            <Button onClick={handleTestConnection} disabled={isTestingConnection}>
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </Button>
            <Button variant="outline" onClick={handleSaveConnection}>
              Save
            </Button>
          </div>
          
          {connectionStatus.success !== undefined && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              connectionStatus.success 
                ? "bg-green-500/10 text-green-500" 
                : "bg-red-500/10 text-red-500"
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                {connectionStatus.message || (connectionStatus.success ? "Connection successful!" : "Connection failed")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
