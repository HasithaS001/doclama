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

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create documents table
    console.log('Creating documents table...');
    const { error: dropDocError } = await supabase.rpc('execute_sql', {
      sql_query: 'DROP TABLE IF EXISTS documents'
    });

    const { error: createDocError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE documents (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          filename TEXT NOT NULL,
          content TEXT,
          file_path TEXT,
          file_url TEXT,
          type TEXT,
          user_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (createDocError) {
      console.error('Error creating documents table:', createDocError);
    } else {
      console.log('Documents table created successfully');
    }

    // Create chat_history table
    console.log('Creating chat_history table...');
    const { error: dropChatError } = await supabase.rpc('execute_sql', {
      sql_query: 'DROP TABLE IF EXISTS chat_history'
    });

    const { error: createChatError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE chat_history (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id TEXT NOT NULL,
          doc_id TEXT NOT NULL,
          doc_name TEXT,
          doc_type TEXT,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          chat_session_id UUID DEFAULT uuid_generate_v4(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT fk_document
            FOREIGN KEY(doc_id) 
            REFERENCES documents(id)
            ON DELETE CASCADE
        );
      `
    });

    if (createChatError) {
      console.error('Error creating chat_history table:', createChatError);
    } else {
      console.log('Chat history table created successfully');
    }

    // Create indexes for better performance
    console.log('Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_chat_history_session ON chat_history(chat_session_id)',
      'CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC)'
    ];

    for (const indexQuery of indexes) {
      const { error: indexError } = await supabase.rpc('execute_sql', {
        sql_query: indexQuery
      });

      if (indexError) {
        console.error('Error creating index:', indexError);
      }
    }

    console.log('Database setup completed');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('Setup completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
