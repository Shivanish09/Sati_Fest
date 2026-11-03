import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure database directory and file exist
function initDatabase() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      registrations: [],
      events: null,
      festivalDetails: null,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

initDatabase();

function readDb() {
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { registrations: [], events: null, festivalDetails: null };
  }
}

function writeDb(data: any) {
  try {
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
}

app.use(express.json());

// API: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Sati-Fest Backend Database Service' });
});

// API: Registrations Database Endpoints
app.get('/api/registrations', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.registrations || []);
});

app.post('/api/registrations', (req: Request, res: Response) => {
  const pass = req.body;
  if (!pass || !pass.passId) {
    res.status(400).json({ error: 'Invalid registration payload: passId is required' });
    return;
  }

  const db = readDb();
  const registrations = Array.isArray(db.registrations) ? db.registrations : [];

  // Remove existing with same passId if updating
  const filtered = registrations.filter((r: any) => r.passId !== pass.passId);
  filtered.unshift(pass);
  db.registrations = filtered;

  if (writeDb(db)) {
    res.status(201).json({ success: true, pass });
  } else {
    res.status(500).json({ error: 'Failed to write to database' });
  }
});

app.delete('/api/registrations/:passId', (req: Request, res: Response) => {
  const { passId } = req.params;
  const db = readDb();
  const registrations = Array.isArray(db.registrations) ? db.registrations : [];
  db.registrations = registrations.filter((r: any) => r.passId !== passId);

  if (writeDb(db)) {
    res.json({ success: true, message: `Pass ${passId} removed from database` });
  } else {
    res.status(500).json({ error: 'Failed to update database' });
  }
});

app.delete('/api/registrations', (_req: Request, res: Response) => {
  const db = readDb();
  db.registrations = [];
  if (writeDb(db)) {
    res.json({ success: true, message: 'All registrations cleared from database' });
  } else {
    res.status(500).json({ error: 'Failed to reset registrations in database' });
  }
});

// API: Events Endpoints
app.get('/api/events', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.events || []);
});

app.put('/api/events', (req: Request, res: Response) => {
  const events = req.body;
  const db = readDb();
  db.events = events;
  if (writeDb(db)) {
    res.json({ success: true, count: events?.length });
  } else {
    res.status(500).json({ error: 'Failed to save events' });
  }
});

// API: Festival Details Endpoints
app.get('/api/festival-details', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.festivalDetails || null);
});

app.put('/api/festival-details', (req: Request, res: Response) => {
  const details = req.body;
  const db = readDb();
  db.festivalDetails = details;
  if (writeDb(db)) {
    res.json({ success: true, details });
  } else {
    res.status(500).json({ error: 'Failed to save festival details' });
  }
});

// Full-stack Vite integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Sati-Fest Server & Database running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
