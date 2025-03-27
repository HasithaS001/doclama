require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSQLFunctions() {
  try {
    console.log('Setting up SQL functions...');

    // Create function to execute SQL
    const createExecuteSqlFunction = `
      CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;
    `;

    // Create function to create documents table
    const createDocumentsTableFunction = `
      CREATE OR REPLACE FUNCTION create_documents_table()
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS documents (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          filename TEXT NOT NULL,
          content TEXT,
          file_path TEXT,
          file_url TEXT,
          type TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      END;
      $$;
    `;

    // Create function to create chat_history table
    const createChatHistoryTableFunction = `
      CREATE OR REPLACE FUNCTION create_chat_history_table()
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS chat_history (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id TEXT NOT NULL,
          doc_id TEXT NOT NULL,
          doc_name TEXT,
          doc_type TEXT,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          chat_session_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      END;
      $$;
    `;

    // Execute SQL to create functions
    console.log('Creating SQL functions...');
    const functions = [
      createExecuteSqlFunction,
      createDocumentsTableFunction,
      createChatHistoryTableFunction
    ];

    for (const sql of functions) {
      const { error } = await supabase.rpc('execute_sql', { sql_query: sql });
      if (error) {
        console.error('Error creating SQL function:', error);
      }
    }

    console.log('SQL functions created successfully');
  } catch (error) {
    console.error('Error setting up SQL functions:', error);
  }
}

// Run the setup
setupSQLFunctions()
  .then(() => {
    console.log('SQL setup completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('SQL setup failed:', error);
    process.exit(1);
  });
