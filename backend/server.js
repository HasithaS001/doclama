require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cheerio = require('cheerio'); // Add Cheerio import
const ytdl = require('ytdl-core');
const { YoutubeTranscript } = require('youtube-transcript');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure CORS with more permissive settings for development
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:63923', // Browser preview origin
        /^http:\/\/127\.0\.0\.1:\d+$/, // Any 127.0.0.1 with any port
        /^http:\/\/localhost:\d+$/, // Any localhost with any port
      ];

      // Check if the origin is allowed
      const allowed = allowedOrigins.some((allowedOrigin) => {
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return allowedOrigin === origin;
      });

      if (allowed) {
        console.log('CORS allowed origin:', origin);
        return callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Content-Length',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  })
);

// Add CORS pre-flight handling for complex requests
app.options('*', cors());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Ensure uploads directory exists with proper permissions
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
    console.log('Created uploads directory with permissions:', uploadsDir);
  } else {
    console.log('Uploads directory already exists:', uploadsDir);
    // Try to ensure directory is writable
    fs.accessSync(uploadsDir, fs.constants.W_OK);
    console.log('Uploads directory is writable');
  }
} catch (error) {
  console.error('Error with uploads directory:', error);
}

// Serve static files from the uploads directory
app.use(
  '/uploads',
  express.static(uploadsDir, {
    setHeaders: (res, path) => {
      if (path.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Access-Control-Allow-Origin', '*');
      } else if (path.endsWith('.docx')) {
        // Set correct MIME type for DOCX files
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
        // Use attachment instead of inline for DOCX files to ensure proper download
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="document.docx"'
        );
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Add additional headers to help with CORS
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      }
    },
  })
);

// Add a dedicated endpoint for PDF preview
app.get('/api/pdf/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('PDF preview requested for document:', id);

    if (!id) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    // Find the document in the global store
    const doc = global.docStore.find((d) => d.id === id);

    if (!doc) {
      console.error('Document not found for PDF preview:', id);
      return res.status(404).json({ error: 'Document not found' });
    }

    // Find the actual file in the uploads directory
    const files = fs.readdirSync(uploadsDir);

    // Look for a file that contains the document's filename or matches the URL path
    let matchingFile = null;

    if (doc.url) {
      // Extract filename from URL
      const urlPath = doc.url.split('/').pop();
      matchingFile = files.find((file) => file === urlPath);
    }

    // If not found by URL, try by filename
    if (!matchingFile) {
      matchingFile = files.find((file) =>
        file.includes(doc.filename.replace(/\s+/g, '-'))
      );
    }

    // If still not found, try a more general search
    if (!matchingFile) {
      matchingFile = files.find((file) => {
        const fileExt = path.extname(file).toLowerCase();
        return fileExt === '.pdf';
      });
    }

    if (!matchingFile) {
      console.error('No matching PDF file found for:', doc.filename);
      return res.status(404).json({ error: 'PDF file not found on disk' });
    }

    // Serve the PDF file directly
    const filePath = path.join(uploadsDir, matchingFile);
    console.log('Serving PDF file from:', filePath);

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${doc.filename}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
      console.error('Error reading PDF file:', error);
      res.status(500).json({ error: 'Error reading PDF file' });
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving PDF file:', error);
    res.status(500).json({ error: 'Server error while serving PDF file' });
  }
});

// Add a dedicated endpoint for DOCX file download
app.get('/api/docx/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DOCX endpoint called for document ID: ${id}`);

    // Find the document in the store
    const doc = global.docStore.find((d) => d.id === id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    console.log(`Found document in store:`, {
      id: doc.id,
      filename: doc.filename,
      type: doc.type,
      path: doc.path || doc.filepath,
    });

    // Get the file path
    const filePath = doc.path || doc.filepath;

    if (!filePath || !fs.existsSync(filePath)) {
      console.error(`File not found at path: ${filePath}`);
      return res.status(404).json({ error: 'File not found' });
    }

    console.log(`File exists at path: ${filePath}`);

    // Set the appropriate headers for DOCX download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${doc.filename || 'document.docx'}"`
    );
    res.setHeader('Access-Control-Allow-Origin', '*');

    console.log(`Streaming DOCX file to client: ${doc.filename}`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error(`Error streaming file: ${error}`);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error streaming file' });
      }
    });
  } catch (error) {
    console.error(`Error serving DOCX: ${error}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize Supabase client
let supabase;
try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not found');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully');

  // ✅ Correct way to test Storage instead of querying a non-existent table
  supabase.storage
    .from('documents')
    .list()
    .then(({ data, error }) => {
      if (error) {
        console.error('Error testing Supabase Storage connection:', error);
      } else {
        console.log(
          'Supabase Storage connection test successful:',
          data.length,
          'files found'
        );
      }
    })
    .catch((error) => {
      console.error('Error testing Supabase Storage connection:', error);
    });
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  supabase = null;
}

// Add a local document store as a fallback when Supabase is unavailable
const localDocumentStore = [];
const localChatHistory = [];

// Helper function to safely interact with Supabase
const safeSupabaseOperation = async (operation, fallbackData = null) => {
  if (!supabase) {
    console.warn('Supabase client not initialized, using local fallback');
    return { error: { message: 'Database not available' }, data: fallbackData };
  }

  try {
    const result = await operation();
    return result;
  } catch (error) {
    console.error('Supabase operation error:', error);
    return { error, data: fallbackData };
  }
};

// Initialize global document store
global.docStore = [];
console.log('Initialized global document store');
console.log(global.docStore);

// Initialize global chat history
global.chatHistory = {};
console.log('Initialized global chat history');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Add a fallback response function for when AI is unavailable
const getFallbackResponse = (question) => {
  return `
• I'm currently having trouble connecting to the AI service
• Your question was: "${question}"
• Please try again in a few moments
• If the problem persists, please check your internet connection or contact support
`;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Created uploads directory in multer config');
      } catch (err) {
        console.error('Error creating uploads directory in multer:', err);
        return cb(new Error('Could not create uploads directory'), null);
      }
    }

    // Check if directory is writable
    try {
      fs.accessSync(uploadDir, fs.constants.W_OK);
      console.log('Uploads directory is writable in multer config');
    } catch (err) {
      console.error('Uploads directory is not writable:', err);
      return cb(new Error('Uploads directory is not writable'), null);
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    // Generate a unique filename with original extension
    const ext = path.extname(file.originalname);
    const uniqueFilename = `${Date.now()}-${uuidv4()}${ext}`;
    console.log('Generated filename:', uniqueFilename);
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only PDF and Word documents
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  console.log('File type:', file.mimetype);

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only PDF and Word documents are allowed.`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).single('file');

// Add a test endpoint to check if file upload is working
app.post('/api/test-upload', (req, res) => {
  console.log('Test upload endpoint called');

  upload(req, res, (err) => {
    if (err) {
      console.error('Test upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      console.error('Test upload: No file provided');
      return res.status(400).json({ error: 'No file provided' });
    }

    // If we get here, the upload worked
    console.log('Test upload successful:', req.file.originalname);

    // Clean up the test file
    try {
      fs.unlinkSync(req.file.path);
      console.log('Test file removed');
    } catch (err) {
      console.error('Error removing test file:', err);
    }

    return res.status(200).json({
      success: true,
      message: 'Test upload successful',
      filename: req.file.originalname,
    });
  });
});

// Upload endpoint with local fallback
app.post('/api/upload', async (req, res) => {
  try {
    console.log('Upload endpoint called');
    console.log(req.file);

    // Validate file existence
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const { originalname, mimetype, path: tempPath, size } = req.file;
    console.log('File received:', originalname, '(', mimetype, ')');

    // Create a unique filename
    const uniqueFilename = `${
      path.parse(originalname).name
    }_${Date.now()}${path.extname(originalname)}`;
    const uploadDir = path.join(__dirname, 'uploads');

    // Ensure uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Verify that file exists
    try {
      await fs.access(tempPath);
    } catch (err) {
      throw new Error(`File not found at path: ${tempPath}`);
    }

    // Attempt to extract text from the document (if applicable)
    let extractedText = '';
    try {
      extractedText = await extractTextFromDocument(tempPath, mimetype);
      console.log('Text extraction successful');
    } catch (extractError) {
      console.error('Text extraction failed:', extractError);
      extractedText =
        'Text extraction failed. You can still chat with this document.';
    }

    // Generate document metadata
    const timestamp = new Date().toISOString();
    const documentData = {
      filename: originalname,
      unique_filename: uniqueFilename,
      type: mimetype.includes('pdf') ? 'pdf' : 'word',
      size,
      content: extractedText,
      created_at: timestamp,
      url: `/uploads/${uniqueFilename}`,
    };

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('documents')
      .insert([documentData]);

    if (dbError) {
      console.error('Supabase save failed:', dbError);
      return res
        .status(500)
        .json({ error: 'Failed to save document to database' });
    }

    console.log('Document successfully saved to database');

    return res.status(200).json({
      message: 'Document uploaded successfully',
      document: documentData,
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    return res.status(500).json({ error: `Upload failed: ${error.message}` });
  }
});
// Function to extract text from document
async function extractTextFromDocument(buffer, mimeType) {
  console.log(`Extracting text from document, MIME Type: ${mimeType}`);
  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    console.log('Handling .docx file');
    return new Promise((resolve, reject) => {
      mammoth
        .extractRawText({ buffer: buffer })
        .then((result) => {
          console.log('Text extracted:', result.value);
          resolve(result.value);
        })
        .catch((err) => {
          console.error('Error extracting text:', err);
          reject(err);
        });
    });
  } else if (mimeType === 'application/pdf') {
    console.log('Handling PDF file');
    const pdfParse = require('pdf-parse');
    return pdfParse(buffer)
      .then((data) => {
        console.log('PDF text extracted:', data.text);
        return data.text;
      })
      .catch((err) => {
        console.error('PDF extraction error:', err);
        throw err;
      });
  } else {
    console.error('Unsupported MIME type:', mimeType);
    throw new Error('Unsupported document type');
  }
}

// Helper function to format response in a point-wise manner and remove markdown symbols
function formatResponse(text) {
  // Remove markdown symbols and format in point-wise manner
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line) => {
      // Remove markdown symbols
      line = line.replace(/\*\*/g, '').replace(/`/g, '').replace(/\*/g, '');
      // Add bullet points if not already present
      return line.startsWith('- ') || line.startsWith('• ')
        ? line
        : `• ${line}`;
    })
    .join('\n');
}

// Helper function to format response in a point-wise manner without markdown symbols
function formatResponsePointWise(text) {
  if (!text) return '';

  // Remove markdown bold symbols (**)
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');

  // Ensure proper line breaks for points
  text = text.replace(/\n\s*[-•]\s*/g, '\n- ');

  // Add line breaks between paragraphs if they don't exist
  text = text.replace(/\.\s+([A-Z])/g, '.\n\n$1');

  // Ensure points are properly formatted
  const lines = text.split('\n');
  let formattedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line) {
      // If line starts with a number followed by a period or parenthesis, format as a point
      if (/^\d+[\.\)]/.test(line) && !line.startsWith('http')) {
        formattedLines.push(line);
      }
      // If line starts with a dash or bullet, format as a point
      else if (line.startsWith('-') || line.startsWith('•')) {
        formattedLines.push(line);
      }
      // Otherwise, just add the line as is
      else {
        formattedLines.push(line);
      }
    } else if (
      i > 0 &&
      i < lines.length - 1 &&
      lines[i - 1].trim() &&
      lines[i + 1].trim()
    ) {
      // Add empty line between paragraphs
      formattedLines.push('');
    }
  }

  return formattedLines.join('\n');
}

// Chat endpoint
router.post('/api/chat', async (req, res) => {
  try {
    const { message, docId, sessionId, userId } = req.body;

    // Validate required fields
    if (!message) return res.status(400).json({ error: 'Message is required' });
    if (!docId)
      return res.status(400).json({ error: 'Document ID is required' });

    // Retrieve document
    const doc = global.docStore.find((d) => d.id === docId.toString());
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const docContent = doc.content || 'No content available';

    // If no Gemini API key, return mock response
    if (!process.env.GEMINI_API_KEY) {
      const mockResponse = formatResponsePointWise(`I'm analyzing the ${
        doc.type
      } document: ${doc.filename}

1. This appears to be a ${
        doc.type === 'web' ? 'web article' : doc.type
      } document.
2. The document is titled "${doc.filename}".
3. You asked: "${message}"
4. Since this is a demo without a configured API key, I'm providing this mock response.
5. To get actual AI responses, please configure a valid Gemini API key.`);

      const newSessionId = sessionId || uuidv4();

      await supabase.from('chat_history').insert([
        {
          id: uuidv4(),
          user_id: userId || 'anonymous',
          doc_id: docId,
          doc_name: doc.filename,
          doc_type: doc.type,
          question: message,
          answer: mockResponse,
          chat_session_id: newSessionId,
          created_at: new Date().toISOString(),
        },
      ]);

      return res.json({ response: mockResponse, sessionId: newSessionId });
    }

    // Check user subscription
    const { data: subscriptions, error: subError } = await supabase
      .from('subscription')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (subError && subError.code !== 'PGRST116') {
      throw new Error('Failed to fetch subscription details');
    }

    const currentSub = subscriptions?.find(
      (sub) => sub.status === 'active' || sub.status === 'paused'
    );
    const isBasicPlanActive = currentSub?.status === 'active' || false;

    // Free plan: Check message limit
    let monthlyMessageCount = 0;
    if (!isBasicPlanActive) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count, error: countError } = await supabase
        .from('chat_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId || 'anonymous')
        .gte('created_at', startOfMonth.toISOString())
        .not('question', 'eq', '__new_chat_session__');

      if (countError) throw new Error('Failed to check message count');
      monthlyMessageCount = count;

      if (monthlyMessageCount >= 50) {
        return res.status(403).json({
          error:
            'Free plan message limit reached. Upgrade your plan to continue chatting.',
        });
      }
    }

    const chatSessionId = sessionId || uuidv4();

    // Build the prompt
    const prompt = `You are an AI assistant that helps users understand and analyze documents. 
The current document is a ${doc.type} file named "${doc.filename}".

Instructions:
1. Focus on providing accurate information from the document
2. Format responses in a clear, point-wise manner
3. Avoid markdown formatting
4. If the answer is not in the document, politely say so
5. Keep responses concise

${doc.type === 'web' && doc.url ? `Source website: ${doc.url}` : ''}
${
  doc.type === 'web' && (!doc.content || doc.content.length < 300)
    ? `Note: This is likely a text-only version due to website restrictions.`
    : ''
}

Document content:
${docContent.substring(0, 15000)}

User question: ${message}`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      },
    });

    const responseText = result.response.text();
    const formattedResponse = formatResponsePointWise(responseText);

    // Save chat
    await supabase.from('chat_history').insert([
      {
        id: uuidv4(),
        user_id: userId || 'anonymous',
        doc_id: docId,
        doc_name: doc.filename,
        doc_type: doc.type,
        question: message,
        answer: formattedResponse,
        chat_session_id: chatSessionId,
        created_at: new Date().toISOString(),
      },
    ]);

    return res.json({ response: formattedResponse, sessionId: chatSessionId });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Routes
app.get('/api/document-info/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    console.log(`Document info request received for ID: ${id}`);

    // Try to find the document in the database first
    let doc = null;
    let dbError = null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching document from database:', error);
          dbError = error;
        } else if (data) {
          doc = data;
          console.log('Document found in database');
        }
      } catch (error) {
        console.error('Exception fetching document from database:', error);
        dbError = error;
      }
    }

    // If not found in database, try to find in local storage
    if (!doc && global.docStore) {
      doc = global.docStore.find((d) => d.id === id);

      if (doc) {
        console.log('Document found in local storage');
      }
    }

    if (!doc) {
      console.error('Document not found in database or local storage:', id);
      return res.status(404).json({ error: 'Document not found' });
    }

    // Find the actual file in the uploads directory

    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(`${doc.user_id.toString()}/${doc.filename}`);

    if (fileError || !fileData) {
      console.error('Error creating signed URL for file:', fileError);
      return res.status(500).json({ error: 'Unable to create file URL' });
    }

    // Send document info along with file URL
    res.json({
      id: doc.id,
      filename: doc.filename,
      type: doc.type,
      created_at: doc.created_at,
      file_url: fileData.url,
    });
  } catch (error) {
    console.error('Error getting document info:', error);
    res.status(500).json({ error: 'Server error while getting document info' });
  }
});

app.post('/api/search', async (req, res) => {
  try {
    const { query, docId } = req.body;

    console.log('Search request received:', { query, docId });

    if (!query) {
      console.log('Search error: No query provided');
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Get document content from Supabase or memory
    let docContent;

    if (supabase && docId) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('content')
          .eq('id', docId)
          .single();

        if (!error && data) {
          docContent = data.content;
        }
      } catch (error) {
        console.error('Supabase query error:', error);
        // Fall back to memory store
      }
    }

    // If not found in Supabase or Supabase not available, check memory store
    if (!docContent && global.docStore) {
      const doc = global.docStore.find((d) => d.id === docId);
      if (doc) {
        docContent = doc.content;
      }
    }

    if (!docContent) {
      console.log('Search error: Document not found', docId);
      return res.status(404).json({ error: 'Document not found' });
    }

    // Enhanced search implementation
    const searchResults = [];
    const lines = docContent.split('\n');
    const queryLower = query.toLowerCase();

    console.log(`Searching through ${lines.length} lines of text`);

    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(queryLower)) {
        // Get context (2 lines before and after)
        const startContext = Math.max(0, index - 2);
        const endContext = Math.min(lines.length, index + 3);
        const contextLines = lines.slice(startContext, endContext);

        // Format the context for better readability
        const context = contextLines
          .map((contextLine, i) => {
            const lineNumber = startContext + i + 1;
            const isMatch = startContext + i === index;
            return isMatch
              ? `→ Line ${lineNumber}: ${contextLine}`
              : `  Line ${lineNumber}: ${contextLine}`;
          })
          .join('\n');

        searchResults.push({
          line: index + 1,
          content: line,
          context: context,
        });
      }
    });

    console.log(`Found ${searchResults.length} search results`);

    res.status(200).json({
      results: searchResults,
      query: query,
      totalResults: searchResults.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get document content
app.get('/api/documents/:id/content', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting content for document:', id);

    if (!id) return res.status(400).json({ error: 'Document ID is required' });

    // Check global cache first
    const cachedDoc = global.docStore.find((d) => d.id === id);
    if (cachedDoc && cachedDoc.content) {
      console.log('Content found in global store');
      return res.json({
        content: cachedDoc.content,
        filename: cachedDoc.filename,
        type: cachedDoc.type,
      });
    }

    // Get document metadata from Supabase DB
    const { data: doc, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !doc) {
      console.error('Supabase DB fetch failed:', error);
      return res.status(404).json({ error: 'Document not found' });
    }

    if (doc.content) {
      // Save in cache
      global.docStore.push({
        id,
        filename: doc.filename,
        type: doc.type,
        content: doc.content,
      });
      return res.json({
        content: doc.content,
        filename: doc.filename,
        type: doc.type,
      });
    }

    // If content is not present, fetch the file from Supabase Storage

    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(`${doc.user_id.toString()}/${doc.filename}`);

    if (fileError || !fileData) {
      console.error('Failed to download file from storage:', fileError);
      return res
        .status(500)
        .json({ error: 'Failed to download file from storage' });
    }

    // Convert ReadableStream to Buffer
    const buffer = Buffer.from(await fileData.arrayBuffer());

    // Determine mimeType from file extension
    const ext = path.extname(doc.filename).toLowerCase();
    const mimeType =
      ext === '.pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // Extract text
    let extractedText = '';
    try {
      extractedText = await extractTextFromDocument(buffer, mimeType);
    } catch (extractError) {
      console.error('Text extraction failed:', extractError);
      return res
        .status(500)
        .json({ error: 'Failed to extract text from document' });
    }

    // Update Supabase with content
    await supabase
      .from('documents')
      .update({ content: extractedText })
      .eq('id', id);

    // Save in global cache
    global.docStore.push({ id, content: extractedText });

    return res.json({ content: extractedText });
  } catch (error) {
    console.error('Error getting document content:', error);
    return res
      .status(500)
      .json({ error: 'Server error while getting document content' });
  }
});

app.post('/api/dev/clear-docstore', (req, res) => {
  global.docStore.length = 0;
  res.json({ message: 'global.docStore cleared' });
});

app.get('/api/document/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    console.log(`Document request received for ID: ${id}`);

    // Try to find the document in the database first
    let doc = null;
    let dbError = null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching document from database:', error);
          dbError = error;
        } else if (data) {
          doc = data;
          console.log('Document found in database');
        }
      } catch (error) {
        console.error('Exception fetching document from database:', error);
        dbError = error;
      }
    }

    // If not found in database, try to find in local storage
    if (!doc && global.docStore) {
      doc = global.docStore.find((d) => d.id === id);

      if (doc) {
        console.log('Document found in local storage');
      }
    }

    if (!doc) {
      console.error('Document not found in database or local storage:', id);
      return res.status(404).json({ error: 'Document not found' });
    }

    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(`${doc.user_id.toString()}/${doc.filename}`);

    if (fileError || !fileData) {
      console.error('Failed to download file from storage:', fileError);
      return res
        .status(500)
        .json({ error: 'Failed to download file from storage' });
    }

    // Determine content type based on file extension
    const fileExt = path.extname(doc.filename).toLowerCase();
    let contentType = 'application/octet-stream'; // Default content type

    if (fileExt === '.pdf') {
      contentType = 'application/pdf';
    } else if (fileExt === '.docx') {
      contentType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (fileExt === '.doc') {
      contentType = 'application/msword';
    }

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${doc.filename}"`);

    fileData.pipe(res);
  } catch (error) {
    console.error('Error serving document:', error);
    res.status(500).json({ error: 'Server error while serving document' });
  }
});

app.get('/api/document/:id/text', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    console.log(`Document text request received for ID: ${id}`);

    // Find the document in the database
    const { data: doc, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching document from database:', error);
      return res.status(500).json({ error: 'Failed to fetch document' });
    }

    if (!doc) {
      console.error('Document not found in database:', id);
      return res.status(404).json({ error: 'Document not found' });
    }

    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(`${doc.user_id.toString()}/${doc.filename}`);

    if (fileError || !fileData) {
      console.error('Failed to download file from storage:', fileError);
      return res
        .status(500)
        .json({ error: 'Failed to download file from storage' });
    }

    // Check if it's a Word document
    const fileExtension = path.extname(doc.filename).toLowerCase();

    if (fileExtension === '.docx' || fileExtension === '.doc') {
      // For Word documents, we need to extract the text
      // Get the text content from the document content field in the database
      let docContent = doc.content || '';

      // If no content in database, try to get from global store
      if (!docContent && global.docStore) {
        const docInStore = global.docStore.find((d) => d.id === id);
        if (docInStore && docInStore.content) {
          docContent = docInStore.content;
        }
      }

      // Format paragraphs for better readability
      const formattedContent = docContent
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => `<p>${line}</p>`)
        .join('');

      // Create a simple HTML representation with basic styling
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">${
            doc.filename
          }</h1>
          <div style="white-space: pre-wrap; color: #444;">
            ${formattedContent || 'No content available for preview'}
          </div>
        </div>
      `;

      console.log('Serving Word document as HTML');

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      res.json({ html });
    } else {
      console.error('Not a Word document:', fileExtension);
      res.status(400).json({ error: 'Not a Word document' });
    }
  } catch (error) {
    console.error('Error serving document text:', error);
    res.status(500).json({ error: 'Server error while serving document text' });
  }
});

// Chat history management routes
app.get('/api/chat-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Get user's subscription plan
    const { data: subscriptions, error: subError } = await supabase
      .from('subscription')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error fetching subscription details:', subError);
      return res
        .status(500)
        .json({ error: 'Failed to fetch subscription information' });
    }

    // Find current subscription - active or paused
    const currentSub = subscriptions?.find(
      (sub) => sub.status === 'active' || sub.status === 'paused'
    );

    // Build query for chat history
    let query = supabase
      .from('chat_history')
      .select(
        `
        id,
        doc_name,
        doc_type,
        question,
        answer,
        created_at
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // If no active subscription, limit to last 7 days (free plan)
    if (!currentSub) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte('created_at', sevenDaysAgo.toISOString());
    }

    // Execute the query
    const { data: chats, error } = await query;

    if (error) {
      console.error('Error fetching chat history:', error);
      return res.status(500).json({ error: 'Failed to fetch chat history' });
    }

    // Format the response in a user-friendly way
    const formattedChats = chats.map((chat) => ({
      ...chat,
      question: formatResponse(chat.question),
      answer: formatResponse(chat.answer),
    }));

    res.json({
      chats: formattedChats,
      limitedHistory: !currentSub,
    });
  } catch (error) {
    console.error('Error in /api/chat-history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/chat-history', async (req, res) => {
  try {
    const { chatIds } = req.body;

    if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
      return res.status(400).json({ error: 'Chat IDs are required' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Delete chats from database
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .in('id', chatIds);

    if (error) {
      console.error('Error deleting chats:', error);
      return res.status(500).json({ error: 'Failed to delete chats' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/chat-history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a route to get specific chat history for a document
app.get('/api/chat-history/:userId/:docId', async (req, res) => {
  try {
    const { userId, docId } = req.params;
    if (!userId || !docId) {
      return res
        .status(400)
        .json({ error: 'User ID and Document ID are required' });
    }
    if (!supabase) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Get user's subscription plan
    const { data: subscriptions, error: subError } = await supabase
      .from('subscription')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error fetching subscription details:', subError);
      return res
        .status(500)
        .json({ error: 'Failed to fetch subscription information' });
    }

    // Find current subscription - active or paused
    const currentSub = subscriptions?.find(
      (sub) => sub.status === 'active' || sub.status === 'paused'
    );

    // Start building the query
    let query = supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .eq('doc_id', docId);

    // If no active subscription, limit to last 7 days (free plan)
    if (!currentSub) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte('created_at', sevenDaysAgo.toISOString());
    }

    // Execute the query with ordering
    const { data, error } = await query.order('created_at', {
      ascending: true,
    });

    if (error) {
      console.error('Error fetching document chat history:', error);
      return res
        .status(500)
        .json({ error: 'Failed to fetch document chat history' });
    }

    const chats = data.map((chat) => ({
      id: chat.id,
      question: chat.question,
      answer: chat.answer,
      createdAt: chat.created_at,
    }));

    res.json({
      chats,
      limitedHistory: !currentSub,
    });
  } catch (error) {
    console.error('Error fetching document chat history:', error);
    res
      .status(500)
      .json({ error: 'Server error while fetching document chat history' });
  }
});
// Add a route to create a new chat session
app.post('/api/chat-session', async (req, res) => {
  try {
    const { userId, docId, docName, docType } = req.body;

    if (!userId || !docId) {
      return res
        .status(400)
        .json({ error: 'User ID and Document ID are required' });
    }

    if (!supabase) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Generate a unique chat session ID
    const chatSessionId = uuidv4();

    // Check if the chat_session_id column exists
    let hasSessionIdColumn = true;
    try {
      // Try to insert a record with chat_session_id
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_history')
        .insert({
          user_id: userId,
          doc_id: docId,
          doc_name: docName || 'Untitled Document',
          doc_type: docType || 'unknown',
          question: '__new_chat_session__', // Special marker for new chat sessions
          answer: 'New chat session started',
          chat_session_id: chatSessionId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) {
        // If the error is about the column not existing
        if (
          sessionError.message &&
          sessionError.message.includes('chat_session_id')
        ) {
          hasSessionIdColumn = false;
          console.log(
            'chat_session_id column does not exist, falling back to basic insert'
          );

          // Insert without chat_session_id
          const { data: fallbackSession, error: fallbackError } = await supabase
            .from('chat_history')
            .insert({
              user_id: userId,
              doc_id: docId,
              doc_name: docName || 'Untitled Document',
              doc_type: docType || 'unknown',
              question: '__new_chat_session__',
              answer: 'New chat session started',
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (fallbackError) {
            throw fallbackError;
          }

          return res.status(201).json({
            chatId: fallbackSession.id,
            message: 'New chat session created (without session ID)',
          });
        } else {
          throw sessionError;
        }
      }

      return res.status(201).json({
        chatId: newSession.id,
        chatSessionId: chatSessionId,
        message: 'New chat session created',
      });
    } catch (error) {
      console.error('Error creating chat session:', error);
      return res.status(500).json({ error: 'Failed to create chat session' });
    }
  } catch (error) {
    console.error('Error in chat session creation:', error);
    res.status(500).json({ error: 'Server error while creating chat session' });
  }
});

// Add a status endpoint for connection testing
app.get('/api/status', (req, res) => {
  console.log('Status endpoint called');
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    uploads: fs.existsSync(path.join(__dirname, 'uploads'))
      ? 'available'
      : 'missing',
  });
});

// Route to convert Word document to HTML for preview
app.get('/api/document-html/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    console.log(`Converting document ${docId} to HTML for preview`);

    // First try to get the file path from Supabase
    let filePath;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('filepath')
          .eq('id', docId)
          .single();

        if (!error && data) {
          filePath = data.filepath;
          console.log(`Found document path in Supabase: ${filePath}`);
        }
      } catch (error) {
        console.error('Supabase query error:', error);
        // Fall back to memory store
      }
    }

    // If not found in Supabase or Supabase not available, check memory store
    if (!filePath && global.docStore) {
      const doc = global.docStore.find((d) => d.id === docId);
      if (doc) {
        filePath = doc.path;
        console.log(`Found document path in memory store: ${filePath}`);
      }
    }

    if (!filePath || !fs.existsSync(filePath)) {
      console.error(`Document file not found for ID: ${docId}`);
      return res.status(404).json({ error: 'Document file not found' });
    }

    // Check if it's a Word document
    const docType = global.docStore.find((d) => d.id === docId)?.type;
    if (docType !== 'word') {
      return res.status(400).json({ error: 'Not a Word document' });
    }

    // Convert Word document to HTML
    const docBuffer = fs.readFileSync(filePath);
    const result = await mammoth.convertToHtml({ buffer: docBuffer });

    // Return the HTML content
    res.setHeader('Content-Type', 'text/html');
    res.send(result.value);
  } catch (error) {
    console.error('Error converting document to HTML:', error);
    res.status(500).json({ error: 'Failed to convert document to HTML' });
  }
});

// Add a route to get document details by ID
app.get('/api/documents', async (req, res) => {
  try {
    const userId = req.query.userId || '';

    // Get files from Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .list(userId);

    if (error) {
      console.error('Error fetching documents:', error.message);
      return res.status(500).json({ message: 'Failed to fetch documents' });
    }

    // Transform response
    const documents = data.map((file) => ({
      filename: file.name,
      type: file.metadata?.mimetype || 'unknown',
      url: `${process.env.SUPABASE_URL}/storage/v1/object/public/documents/${userId}/${file.name}`,
      created_at: file.created_at,
    }));

    return res.status(200).json({ documents });
  } catch (error) {
    console.error('Unexpected error fetching documents:', error);
    return res
      .status(500)
      .json({ message: `Unexpected server error: ${error.message}` });
  }
});
// User routes
app.post('/api/users/update-email', async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        error: 'User ID and email are required',
      });
    }

    // Update email in Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .update({ email })
        .eq('id', userId);

      if (error) {
        console.error('Error updating email in database:', error);
        return res.status(500).json({
          error: 'Failed to update email in database',
        });
      }
    }

    res.json({
      success: true,
      message: 'Email updated successfully',
    });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

app.post('/api/users/update-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'User ID, current password, and new password are required',
      });
    }

    // Update password in Supabase
    if (supabase) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({
          error: 'Failed to update password',
        });
      }
    }

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // First get the document to find its file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('filepath')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching document:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch document' });
    }

    // Delete the file from storage
    if (document?.filepath) {
      try {
        fs.unlinkSync(document.filepath);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting document:', deleteError);
      return res.status(500).json({ error: 'Failed to delete document' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error in /api/documents/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/documents/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Get document info from database
    const { data: document, error } = await supabase
      .from('documents')
      .select('filepath, filename')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching document:', error);
      return res.status(500).json({ error: 'Failed to fetch document' });
    }

    if (!document || !document.filepath) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Send the file
    res.download(document.filepath, document.filename);
  } catch (error) {
    console.error('Error in /api/documents/:id/download:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Document preview endpoint
app.get('/api/documents/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;

    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Get document info from database
    const { data: doc, error: dbError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !doc) {
      console.error('Error fetching document:', dbError);
      return res.status(404).json({ error: 'Document not found' });
    }

    // Get the file from storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('documents')
      .download(`${doc.user_id.toString()}/${doc.filename}`);

    if (storageError) {
      console.error('Error downloading file:', storageError);
      return res.status(500).json({ error: 'Failed to download file' });
    }

    // Set appropriate headers based on file type
    res.setHeader('Content-Type', doc.type);
    res.setHeader('Content-Disposition', `inline; filename="${doc.filename}"`);

    // Send the file
    const buffer = Buffer.from(await fileData.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    console.error('Error in /api/documents/:id/preview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a route to get chat sessions for a user
app.get('/api/chat-sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!supabase) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Get all chat history for the user
    const { data: allChats, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat sessions:', error);
      return res.status(500).json({ error: 'Failed to fetch chat sessions' });
    }

    // Check if we have any chats
    if (!allChats || allChats.length === 0) {
      return res.status(200).json({ sessions: [] });
    }

    // Group chats by document and session
    const chatSessions = [];
    const processedIds = new Set();

    // Process each chat entry
    for (const chat of allChats) {
      // Skip if already processed
      if (processedIds.has(chat.id)) continue;

      // Check if this is a new chat session marker
      const isNewSession = chat.question === '__new_chat_session__';

      // If it's a new session marker, use it as the session start
      if (isNewSession) {
        // Find all messages that belong to this session
        let sessionMessages = [];

        // If chat_session_id exists and is not null, use it to find related messages
        if (chat.chat_session_id) {
          sessionMessages = allChats.filter(
            (c) =>
              c.chat_session_id === chat.chat_session_id &&
              c.id !== chat.id &&
              c.question !== '__new_chat_session__'
          );
        } else {
          // Otherwise, group by document and time proximity
          const sessionTime = new Date(chat.created_at).getTime();
          sessionMessages = allChats.filter(
            (c) =>
              c.doc_id === chat.doc_id &&
              c.id !== chat.id &&
              c.question !== '__new_chat_session__' &&
              Math.abs(new Date(c.created_at).getTime() - sessionTime) < 3600000 // Within 1 hour
          );
        }

        // Add all message IDs to processed set
        sessionMessages.forEach((msg) => processedIds.add(msg.id));
        processedIds.add(chat.id);

        // Create session object
        chatSessions.push({
          id: chat.id,
          docId: chat.doc_id,
          docName: chat.doc_name || 'Untitled Document',
          docType: chat.doc_type || 'unknown',
          createdAt: chat.created_at,
          chatSessionId: chat.chat_session_id,
          messageCount: sessionMessages.length,
          lastMessage:
            sessionMessages.length > 0
              ? sessionMessages.sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )[0].question
              : 'New chat',
        });
      }
      // If not a session marker and not part of a known session, create a new session for it
      else if (
        !chat.chat_session_id ||
        !allChats.some(
          (c) =>
            c.question === '__new_chat_session__' &&
            c.chat_session_id === chat.chat_session_id
        )
      ) {
        // Find messages that might be part of the same conversation
        const chatTime = new Date(chat.created_at).getTime();
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('doc_id', chat.doc_id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching related messages:', error);
          return res
            .status(500)
            .json({ error: 'Failed to fetch related messages' });
        }

        // Filter messages by time proximity
        const relatedMessages = (data || []).filter(
          (msg) =>
            msg.id === chat.id || // Include the message itself
            (msg.question !== '__new_chat_session__' &&
              Math.abs(new Date(msg.created_at).getTime() - chatTime) < 3600000) // Within 1 hour
        );

        // Add all message IDs to processed set
        relatedMessages.forEach((msg) => processedIds.add(msg.id));
        processedIds.add(chat.id);

        // Create session object
        chatSessions.push({
          id: chat.id,
          docId: chat.doc_id,
          docName: chat.doc_name || 'Untitled Document',
          docType: chat.doc_type || 'unknown',
          createdAt: chat.created_at,
          messageCount: relatedMessages.length,
          lastMessage: chat.question || 'No message',
          chatSessionId: chat.chat_session_id,
        });
      }
    }

    // Log the result for debugging
    console.log(
      `Found ${chatSessions.length} chat sessions for user ${userId}`
    );

    res.status(200).json({ sessions: chatSessions });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res
      .status(500)
      .json({ error: 'Server error while fetching chat sessions' });
  }
});

// Add a route to get messages for a specific chat session
app.get('/api/chat-session/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (!supabase) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // First, get the session entry to check if it has chat_session_id
    const { data: sessionEntry, error: sessionError } = await supabase
      .from('chat_history')
      .select('*')
      .eq('chat_session_id', sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error('Error fetching session entry:', sessionError);
      return res.status(500).json({ error: 'Failed to fetch session entry' });
    }

    if (!sessionEntry) {
      return res.status(404).json({ error: 'Session not found' });
    }

    let messages = [];

    // If the session has a chat_session_id, use it to find related messages
    if (sessionEntry.chat_session_id) {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('chat_session_id', sessionEntry.chat_session_id)
        .neq('question', '__new_chat_session__')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching session messages:', error);
        return res
          .status(500)
          .json({ error: 'Failed to fetch session messages' });
      }

      messages = data || [];
    } else {
      // Otherwise, find messages by time proximity
      const sessionTime = new Date(sessionEntry.created_at).getTime();
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('doc_id', sessionEntry.doc_id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching related messages:', error);
        return res
          .status(500)
          .json({ error: 'Failed to fetch related messages' });
      }

      // Filter messages by time proximity
      messages = (data || []).filter(
        (msg) =>
          msg.id === sessionId || // Include the session message itself
          (msg.question !== '__new_chat_session__' &&
            Math.abs(new Date(msg.created_at).getTime() - sessionTime) <
              3600000) // Within 1 hour
      );
    }

    // Format messages for the client
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      question: msg.question,
      answer: msg.answer,
      createdAt: msg.created_at,
    }));

    console.log(
      `Found ${formattedMessages.length} messages for session ${sessionId}`
    );

    res.status(200).json({
      messages: formattedMessages,
      docName: sessionEntry.doc_name || 'Untitled Document',
      docId: sessionEntry.doc_id,
      docType: sessionEntry.doc_type || 'unknown',
    });
  } catch (error) {
    console.error('Error fetching session messages:', error);
    res
      .status(500)
      .json({ error: 'Server error while fetching session messages' });
  }
});

// Get chat sessions
app.get('/api/chat-sessions', async (req, res) => {
  try {
    let sessions = [];

    if (supabase) {
      // Get unique chat sessions with their latest messages
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat sessions:', error);
      } else if (data) {
        // Group by chat_session_id and get the latest message
        const sessionMap = new Map();
        data.forEach((chat) => {
          if (!sessionMap.has(chat.chat_session_id)) {
            sessionMap.set(chat.chat_session_id, {
              id: chat.chat_session_id,
              doc_name: chat.doc_name,
              doc_type: chat.doc_type,
              created_at: chat.created_at,
              last_message: chat.question,
              user_id: chat.user_id,
            });
          }
        });
        sessions = Array.from(sessionMap.values());
      }
    }

    // If no sessions from database or database error, use local storage
    if (sessions.length === 0 && global.chatHistory) {
      const sessionMap = new Map();
      global.chatHistory.forEach((chat) => {
        if (!sessionMap.has(chat.chat_session_id)) {
          sessionMap.set(chat.chat_session_id, {
            id: chat.chat_session_id,
            doc_name: chat.doc_name,
            doc_type: chat.doc_type,
            created_at: chat.created_at,
            last_message: chat.question,
            user_id: chat.user_id,
          });
        }
      });
      sessions = Array.from(sessionMap.values());
    }

    res.status(200).json({ sessions });
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    res.status(500).json({ error: 'Failed to get chat sessions' });
  }
});

// Get chat history for a session
app.get('/api/chat-history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Get chat history from database
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('chat_session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat history:', error);
      return res.status(500).json({ error: 'Failed to fetch chat history' });
    }

    // If no chat history from database or database error, use local storage
    if (!data || (data.length === 0 && global.chatHistory)) {
      const chatHistory = global.chatHistory.filter(
        (chat) => chat.chat_session_id === sessionId
      );
      return res.status(200).json({ chatHistory });
    }

    res.status(200).json({ chatHistory: data });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

// Save chat message
app.post('/api/save-chat', async (req, res) => {
  try {
    const { userId, docId, docName, docType, question, answer, chatSessionId } =
      req.body;

    if (!userId || !docId || !question || !answer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const chatMessage = {
      user_id: userId,
      doc_id: docId,
      doc_name: docName,
      doc_type: docType,
      question,
      answer,
      chat_session_id: chatSessionId,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from('chat_history').insert(chatMessage);

      if (error) {
        console.error('Error saving chat message to database:', error);
      }
    }

    // Always save to local storage as backup
    if (!global.chatHistory) {
      global.chatHistory = [];
    }
    global.chatHistory.push(chatMessage);

    res.status(200).json({ message: 'Chat message saved successfully' });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Failed to save chat message' });
  }
});

// Add a test upload endpoint
app.post('/api/test-upload', (req, res) => {
  console.log('Test upload endpoint called');

  // Use a simple in-memory upload for testing
  const simpleUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for test
  }).single('file');

  simpleUpload(req, res, (err) => {
    if (err) {
      console.error('Test upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log('Test file received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Return success without processing the file
    return res.status(200).json({
      message: 'Test upload successful',
      fileInfo: {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
      },
    });
  });
});

// Endpoint to store document content in global store
app.post('/api/store-document', (req, res) => {
  try {
    const { docId, content } = req.body;

    if (!docId || !content) {
      return res
        .status(400)
        .json({ error: 'Document ID and content are required' });
    }

    console.log(
      `Storing document content for ID: ${docId}, content length: ${content.length}`
    );

    // Check if document already exists in global store
    const existingIndex = global.docStore.findIndex((doc) => doc.id === docId);

    if (existingIndex !== -1) {
      // Update existing document
      global.docStore[existingIndex].content = content;
      console.log(
        `Updated existing document in global store with ID: ${docId}`
      );
    } else {
      // Add new document
      global.docStore.push({
        id: docId,
        content: content,
      });
      console.log(`Added new document to global store with ID: ${docId}`);
    }

    // Log the current state of the document store
    console.log(
      `Global document store now has ${global.docStore.length} documents`
    );
    console.log(
      'Document IDs in store:',
      global.docStore.map((doc) => doc.id)
    );

    res
      .status(200)
      .json({ success: true, message: 'Document content stored successfully' });
  } catch (error) {
    console.error('Error storing document content:', error);
    res
      .status(500)
      .json({ error: 'Server error while storing document content' });
  }
});

// Web article processing endpoint
app.post('/api/process-web', async (req, res) => {
  try {
    const { webUrl } = req.body;

    if (!webUrl) {
      return res.status(400).json({ error: 'Web URL is required' });
    }

    console.log('Processing web article URL:', webUrl);

    // Validate URL
    let url;
    try {
      url = new URL(webUrl);
      if (!url.protocol.startsWith('http')) {
        throw new Error('Invalid URL protocol');
      }
    } catch (error) {
      console.error('URL validation error:', error);
      return res.status(400).json({
        error: 'Invalid URL. Please provide a valid web article URL.',
      });
    }

    // Extract domain and path for better context
    const domain = url.hostname;
    const path = url.pathname;

    // Function to attempt content extraction with different user agents
    const attemptContentExtraction = async (userAgents) => {
      for (const userAgent of userAgents) {
        try {
          console.log(`Attempting fetch with user agent: ${userAgent.name}`);

          const response = await fetch(webUrl, {
            headers: {
              'User-Agent': userAgent.agent,
              Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              Referer: 'https://www.google.com/',
              DNT: '1',
              Connection: 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Cache-Control': 'max-age=0',
            },
            redirect: 'follow',
            follow: 10,
          });

          if (response.ok) {
            const html = await response.text();
            console.log(
              `Successfully fetched content with ${userAgent.name}, HTML length: ${html.length}`
            );
            return { success: true, html, userAgent: userAgent.name };
          } else {
            console.log(
              `Fetch with ${userAgent.name} failed: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(`Error with ${userAgent.name}:`, error.message);
        }
      }

      return { success: false };
    };

    // Define different user agents to try
    const userAgents = [
      {
        name: 'Chrome Desktop',
        agent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      {
        name: 'Mobile Android',
        agent:
          'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
      },
      {
        name: 'Safari',
        agent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
      },
      {
        name: 'Firefox',
        agent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
      },
    ];

    // Try to extract content with different user agents
    const extractionResult = await attemptContentExtraction(userAgents);

    if (!extractionResult.success) {
      console.log(
        'All extraction attempts failed, creating enhanced text-only version'
      );

      // Create an enhanced text-only version with domain-specific information
      let enhancedContent = '';

      // Add domain-specific information based on the URL
      if (domain.includes('hostinger') || domain.includes('hosting')) {
        enhancedContent = `This article appears to be from ${domain}, which is a web hosting provider. 
        
The article likely discusses web hosting services, server options, pricing plans, features, or comparisons with other hosting providers.

Common topics on ${domain} include:
1. Web hosting plans and pricing
2. Domain registration services
3. Website builders and CMS compatibility
4. Server specifications and performance
5. Customer support options
6. Control panel features
7. Security features and SSL certificates
8. Email hosting capabilities
9. Uptime guarantees and reliability
10. Comparisons with other hosting providers

The specific article at ${path} might focus on one or more of these topics.

Original URL: ${webUrl}`;
      } else if (domain.includes('wordpress') || path.includes('wordpress')) {
        enhancedContent = `This article appears to be from ${domain} and relates to WordPress.
        
The article likely discusses WordPress themes, plugins, development techniques, or best practices.

Common topics related to WordPress include:
1. Theme development and customization
2. Plugin recommendations and reviews
3. WordPress security best practices
4. Performance optimization techniques
5. Content management strategies
6. WooCommerce and e-commerce
7. WordPress hosting options
8. Gutenberg editor tips and tricks
9. WordPress updates and new features
10. SEO optimization for WordPress sites

The specific article at ${path} might focus on one or more of these topics.

Original URL: ${webUrl}`;
      } else if (domain.includes('seo') || path.includes('seo')) {
        enhancedContent = `This article appears to be from ${domain} and relates to SEO (Search Engine Optimization).
        
The article likely discusses SEO strategies, techniques, tools, or case studies.

Common SEO topics include:
1. On-page optimization techniques
2. Off-page SEO and link building
3. Technical SEO audits and fixes
4. Keyword research and analysis
5. Content optimization strategies
6. Local SEO best practices
7. Mobile SEO considerations
8. SEO tools and software
9. Algorithm updates and their impact
10. Analytics and performance tracking

The specific article at ${path} might focus on one or more of these topics.

Original URL: ${webUrl}`;
      } else {
        // Generic enhanced content based on domain and path
        enhancedContent = `This article is from ${domain}${path}.

Based on the URL, this article might discuss topics related to ${
          domain.split('.')[0]
        }.

While the specific content couldn't be accessed directly due to website restrictions, the article likely covers information relevant to the URL path: ${path}

Some possible topics that might be covered in this article:
1. Overview or introduction to ${path
          .split('/')
          .filter((p) => p)
          .join(' ')}
2. Key features or aspects of ${domain.split('.')[0]}
3. Comparisons with alternatives or competitors
4. Best practices or recommendations
5. Recent developments or news in this area

Original URL: ${webUrl}`;
      }

      // Create document record with enhanced content
      const docId = uuidv4();
      const title = `Article from ${domain}`;

      const docData = {
        id: docId,
        type: 'web',
        filename: title,
        url: webUrl,
        content: enhancedContent,
        metadata: {
          title,
          url: webUrl,
          summary: 'Enhanced text-only view with domain-specific information',
        },
        isTextOnly: true,
        domainInfo: domain,
      };

      console.log('Created enhanced text-only document record with ID:', docId);

      // Add to global document store
      if (!global.docStore) {
        global.docStore = [];
      }
      global.docStore.push(docData);

      // Return success response with warning
      return res.status(200).json({
        message: 'Web article processed in enhanced text-only mode',
        document: docData,
        warning:
          'The article content could not be directly accessed. An enhanced text-only version has been created.',
      });
    }

    // If we successfully extracted content, process it with Cheerio
    const html = extractionResult.html;
    console.log(
      `Processing HTML content extracted with ${extractionResult.userAgent}, length: ${html.length}`
    );

    // Use Cheerio to extract article content
    const $ = cheerio.load(html);

    // Extract title
    let title = $('title').text().trim();
    if (!title) {
      title = url.hostname + url.pathname;
    }
    console.log('Extracted title:', title);

    // Extract metadata
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDescription =
      $('meta[property="og:description"]').attr('content') || '';

    // Try to find the main article content using common selectors
    let articleContent = '';

    // Array of common article content selectors
    const contentSelectors = [
      'article',
      'main',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content-area',
      '#content',
      '.main-content',
      '[role="main"]',
      '.story-body',
      '.story-content',
      '.news-article',
      '.article-body',
      '.article',
    ];

    // Try each selector until we find content
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        // Found a matching element
        console.log(`Found content using selector: ${selector}`);

        // Extract text content
        let content = element.text();

        // Clean up whitespace
        content = content.replace(/\s+/g, ' ').trim();

        if (content.length > 500) {
          // Ensure we have substantial content
          articleContent = content;
          break;
        }
      }
    }

    // If no content found with selectors, extract paragraphs
    if (!articleContent || articleContent.length < 500) {
      console.log('No content found with selectors, extracting paragraphs');

      // Extract all paragraphs
      const paragraphs = $('p')
        .map((i, el) => $(el).text().trim())
        .get();

      // Filter out short paragraphs and join
      articleContent = paragraphs
        .filter((p) => p.length > 20) // Filter out very short paragraphs
        .join('\n\n');
    }

    // If still no substantial content, use all body text as fallback
    if (!articleContent || articleContent.length < 500) {
      console.log('No substantial content found, using body text');
      articleContent = $('body').text().replace(/\s+/g, ' ').trim();
    }

    console.log('Extracted article content, length:', articleContent.length);

    // Create a summary
    let summary = ogDescription || metaDescription || '';
    if (!summary) {
      // Create a summary from the first 200 characters of content
      summary = articleContent.substring(0, 200) + '...';
    }

    // Create document record
    const docId = uuidv4();
    const docData = {
      id: docId,
      type: 'web',
      filename: title,
      url: webUrl,
      content: articleContent,
      metadata: {
        title: ogTitle || title,
        url: webUrl,
        summary,
      },
    };

    console.log('Created document record with ID:', docId);

    // Add to global document store
    if (!global.docStore) {
      global.docStore = [];
    }
    global.docStore.push(docData);
    console.log(
      'Added document to global store. Total documents:',
      global.docStore.length
    );

    // Return success response
    return res.status(200).json({
      message: 'Web article processed successfully',
      document: docData,
    });
  } catch (error) {
    console.error('Error processing web article:', error);
    return res
      .status(500)
      .json({ error: 'Error processing web article: ' + error.message });
  }
});

// Simple upload endpoint - stripped down to basics
app.post('/api/simple-upload', (req, res) => {
  console.log('Simple upload endpoint called');

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads directory');
  }

  // Use a simple multer instance for this endpoint
  const simpleUpload = multer({
    dest: uploadDir,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  }).single('file');

  simpleUpload(req, res, async (err) => {
    if (err) {
      console.error('Simple upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      console.error('No file provided');
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log('File received:', req.file.originalname);

    // Rename the file to include the original extension
    const originalExt = path.extname(req.file.originalname);
    const newFilename = `${req.file.filename}${originalExt}`;
    const newPath = path.join(uploadDir, newFilename);

    try {
      fs.renameSync(req.file.path, newPath);
      console.log(`Renamed file to: ${newFilename}`);
    } catch (renameError) {
      console.error('Error renaming file:', renameError);
      // Continue with the original filename if rename fails
    }

    // Create a simple document record
    const docId = uuidv4();
    const timestamp = new Date().toISOString();

    // Try to extract text from the document
    let extractedText = '';
    try {
      extractedText = await extractTextFromDocument(newPath, req.file.mimetype);
      console.log('Text extraction successful');
    } catch (extractError) {
      console.error('Text extraction failed:', extractError);
      extractedText =
        'Text extraction failed. You can still chat with this document.';
    }

    // Determine document type
    const docType = req.file.mimetype.includes('pdf') ? 'pdf' : 'word';

    // Save to Supabase
    try {
      const { error } = await supabase.from('documents').insert([
        {
          id: docId,
          filename: req.file.originalname,
          type: docType,
          content: extractedText,
          created_at: timestamp,
          url: `/uploads/${newFilename}`,
          file_path: newPath,
        },
      ]);

      if (error) {
        console.warn('Failed to save document to Supabase:', error);
      } else {
        console.log('Document saved to Supabase successfully');
      }
    } catch (supabaseError) {
      console.error('Error saving to Supabase:', supabaseError);
    }

    // Save to in-memory store
    const docData = {
      id: docId,
      filename: req.file.originalname,
      type: docType,
      content: extractedText,
      url: `/uploads/${newFilename}`,
      path: newPath,
      uploadTime: timestamp,
    };

    global.docStore.unshift(docData);
    console.log('Document saved to memory store');

    // Return success response
    return res.status(200).json({
      message: 'Document uploaded successfully',
      document: {
        id: docId,
        filename: req.file.originalname,
        type: docType,
        url: `/uploads/${newFilename}`,
        content: extractedText,
        uploadTime: timestamp,
      },
    });
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Subscription
app.post('/api/webhook-event', async (req, res) => {
  const { id, eventName, processed, body } = req.body;

  try {
    const { error } = await supabase.from('webhook-event').insert([
      {
        id,
        eventName,
        processed,
        body,
      },
    ]);

    if (error) {
      console.warn('Failed to save webhook event to Supabase:', error);
    } else {
      console.log('Webhook event saved to Supabase successfully');
    }

    return res.status(200).json({
      message: 'Webhook event saved successfully',
      document: {
        id: id,
        eventName,
        processed,
        body,
      },
    });
  } catch (superbaseError) {
    console.error('Error processing webhook event:', superbaseError);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
