const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export interface DatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
}

export interface QueryResponse {
  sql?: string
  data?: any[]
  error?: string
  message?: string
}

export async function sendQuery(prompt: string, connection: DatabaseConfig): Promise<QueryResponse> {
  try {
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        connection,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      error: `Failed to connect to server: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

export async function testConnection(connection: DatabaseConfig): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    console.log('Testing connection to:', `${API_URL}/test-connection`)
    console.log('Connection config:', { ...connection, password: '***' })
    
    const response = await fetch(`${API_URL}/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connection,
      }),
    })

    const data = await response.json()
    console.log('Test connection response:', data)
    return data
  } catch (error) {
    console.error('Test connection error:', error)
    return {
      success: false,
      error: `Failed to connect to server: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

export async function getSchema(connection: DatabaseConfig): Promise<{ schema?: any[]; tableCount?: number; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/schema`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connection,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      error: `Failed to connect to server: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

// Default connection from localStorage or environment
export function getDefaultConnection(): DatabaseConfig {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('db_connection')
    if (saved) {
      return JSON.parse(saved)
    }
  }
  
  return {
    host: process.env.NEXT_PUBLIC_DB_HOST || 'localhost',
    port: parseInt(process.env.NEXT_PUBLIC_DB_PORT || '3306'),
    user: process.env.NEXT_PUBLIC_DB_USER || 'root',
    password: process.env.NEXT_PUBLIC_DB_PASSWORD || 'Bhuvi@123',
    database: process.env.NEXT_PUBLIC_DB_NAME || 'classicmodels',
  }
}

export function saveConnection(connection: DatabaseConfig) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('db_connection', JSON.stringify(connection))
  }
}
