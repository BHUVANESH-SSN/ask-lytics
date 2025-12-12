import { useEffect } from "react"
import Prism from "prismjs"
import "prismjs/components/prism-sql"
import { Card } from "./ui/card"

interface SQLCodeBlockProps {
  code: string
  language?: string
}

export function SQLCodeBlock({ code, language = "sql" }: SQLCodeBlockProps) {
  useEffect(() => {
    Prism.highlightAll()
  }, [code])

  return (
    <Card className="overflow-hidden">
      <pre className="!m-0 !bg-muted p-4 overflow-x-auto">
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </Card>
  )
}
