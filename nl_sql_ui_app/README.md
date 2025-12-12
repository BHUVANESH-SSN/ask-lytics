# NL → SQL UI Application

A modern SaaS-style UI for natural language to SQL conversion, built with Next.js 14, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 Modern, minimal design inspired by Linear.app and Vercel
- 🌓 Dark mode by default
- 💬 ChatGPT-style query interface
- 📝 SQL editor with Monaco
- 📊 Data visualization with Recharts
- 📜 Query history tracking
- 🗄️ Database schema explorer
- ⚙️ Settings management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd nl_sql_ui_app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
nl_sql_ui_app/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Home page
│   ├── query/              # Chat-style query page
│   ├── editor/             # SQL editor page
│   ├── history/            # Query history page
│   ├── schema/             # Database schema explorer
│   └── settings/           # Settings page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── sidebar.tsx         # Navigation sidebar
│   ├── chat-bubble-*.tsx   # Chat components
│   ├── data-table.tsx      # Results table
│   ├── chart-renderer.tsx  # Chart visualization
│   └── ...                 # Other reusable components
└── lib/
    └── utils.ts            # Utility functions
```

## Pages

### Home (`/`)
- Hero section with call-to-action
- Feature cards
- Quick stats

### Ask Query (`/query`)
- ChatGPT-style interface
- Natural language input
- SQL generation and execution
- Results display with table/chart tabs

### SQL Editor (`/editor`)
- Monaco code editor
- Schema sidebar
- Query execution
- Results display

### Query History (`/history`)
- List of past queries
- Search functionality
- Re-run queries

### Database Schema (`/schema`)
- Grid of table cards
- Column details
- Data type icons
- Search tables

### Settings (`/settings`)
- Database connection configuration
- API key management
- Theme toggle
- Reset app data

## Customization

### Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: 262 83% 58%;  /* Purple accent */
  /* ... other colors */
}
```

### Components

All components use Tailwind CSS and can be easily customized. shadcn/ui components are in `components/ui/`.

## Integration with Backend

To connect to your FastAPI backend:

1. Update API endpoints in the query page
2. Replace mock data with actual API calls
3. Configure CORS in your backend

Example API call:

```typescript
const response = await fetch('http://localhost:8000/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: userMessage,
    connection: { /* db config */ }
  })
})
```

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Code Editor**: Monaco Editor
- **Charts**: Recharts
- **Syntax Highlighting**: Prism.js

## License

MIT
