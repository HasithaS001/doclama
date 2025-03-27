# PDF Chat SaaS Application

A modern SaaS application that allows users to upload PDFs, chat with them using AI, search for specific content, and extract tables and structured data.

## Core Features

✅ **PDF Upload & Management** – Users can upload multiple PDFs for analysis.
✅ **AI-Powered Chat with PDFs** – Ask questions and get answers from the document.
✅ **Advanced Search** – Find specific keywords, phrases, or concepts in documents.
✅ **Table & Data Extraction** – Extract structured data, tables, and figures from PDFs.
✅ **Social Login** – Sign in with Google and Facebook accounts for quick access.

## Tech Stack

- **Frontend**: Next.js / React with TypeScript
- **Backend**: Node.js / Express
- **Database**: Supabase
- **AI**: Google's Gemini API
- **Authentication**: Supabase Auth with social providers

## Project Structure

```
pdf-chat-app/
├── backend/                # Express.js backend
│   ├── uploads/            # Directory for uploaded PDFs
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
└── frontend/               # Next.js frontend
    ├── app/                # Next.js app directory
    │   ├── auth/           # Authentication pages and callback routes
    │   ├── dashboard/      # Dashboard page
    │   ├── globals.css     # Global styles
    │   ├── layout.tsx      # Root layout
    │   └── page.tsx        # Landing page
    ├── components/         # Reusable components
    │   ├── auth/           # Authentication components
    ├── context/            # React context providers
    ├── lib/                # Utility functions and libraries
    ├── package.json        # Frontend dependencies
    ├── postcss.config.js   # PostCSS configuration
    ├── tailwind.config.js  # Tailwind CSS configuration
    └── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (for database and authentication)
- Google Gemini API key
- Google and Facebook developer accounts (for social login)

### Setup Instructions

1. **Clone the repository**

2. **Backend Setup**

   ```bash
   cd pdf-chat-app/backend
   npm install
   ```

   Update the `.env` file with your credentials:
   ```
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

3. **Frontend Setup**

   ```bash
   cd pdf-chat-app/frontend
   npm install
   ```

   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Configure Supabase Authentication**

   - Go to your Supabase project dashboard
   - Navigate to Authentication > Providers
   - Enable Email/Password authentication
   - Enable Google authentication and add your Google OAuth credentials
   - Enable Facebook authentication and add your Facebook OAuth credentials
   - Set your site URL and redirect URLs in the Authentication settings

5. **Create Supabase Tables**

   Create a table named `pdfs` with the following columns:
   - `id` (uuid, primary key)
   - `user_id` (text)
   - `filename` (text)
   - `file_path` (text)
   - `content` (text)
   - `created_at` (timestamp with time zone)

6. **Start the Development Servers**

   Backend:
   ```bash
   cd pdf-chat-app/backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd pdf-chat-app/frontend
   npm run dev
   ```

7. **Access the Application**

   Open your browser and navigate to `http://localhost:3000`

## Features in Detail

### PDF Upload & Management
- Upload PDFs via drag-and-drop or file selection
- View a list of uploaded PDFs
- Select PDFs for analysis

### AI-Powered Chat
- Ask questions about the content of your PDFs
- Get accurate answers powered by Google's Gemini AI
- Conversational interface for natural interaction

### Advanced Search
- Search for specific terms within your documents
- View results with context for better understanding
- Navigate directly to relevant sections

### Table & Data Extraction
- Automatically extract tables from PDFs
- View structured data in a readable format
- Use extracted data for further analysis

### Social Login
- Sign in with Google and Facebook accounts for quick access
- Authenticate with Supabase Auth for secure authentication

## License

This project is licensed under the MIT License.
