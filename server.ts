import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_COLLEGES,
  INITIAL_PRODUCTS, 
  INITIAL_GIGS, 
  INITIAL_SETTINGS, 
  INITIAL_ORDERS
} from './src/data/initialData';
import { 
  Product, 
  Order, 
  AdminSettings, 
  ServiceGig, 
  SMSNotification,
  ChatMessage 
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  gigs: ServiceGig[];
  settings: AdminSettings;
  sms: SMSNotification[];
  chats: ChatMessage[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.products)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading database file, resetting to initial seed:', err);
  }

  const initialDb: DatabaseSchema = {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    gigs: INITIAL_GIGS,
    settings: INITIAL_SETTINGS,
    sms: [
      {
        id: 'sms-welcome-1',
        recipientPhone: '9876543210',
        recipientRole: 'seller',
        sender: 'UniTrade-HQ',
        message: 'Welcome to UniTrade! Campus marketplace for CU University & Punjab University.',
        timestamp: new Date().toISOString(),
        isRead: true
      }
    ],
    chats: []
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  let db = loadDatabase();

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'UniTrade', colleges: INITIAL_COLLEGES });
  });

  // University list
  app.get('/api/colleges', (_req: Request, res: Response) => {
    res.json(INITIAL_COLLEGES);
  });

  // Products API
  app.get('/api/products', (req: Request, res: Response) => {
    const { role, college, category } = req.query;
    let list = db.products;

    if (role !== 'admin') {
      list = list.filter(p => p.approvalStatus === 'approved');
    }

    if (college && typeof college === 'string' && college !== 'All Campuses') {
      list = list.filter(p => p.college === college);
    }

    if (category && typeof category === 'string' && category !== 'All') {
      list = list.filter(p => p.category === category);
    }

    res.json(list);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const { title, description, category, price, sellerSuggestedPrice, condition, college, sellerPhone, sellerName, imageUrl, stock } = req.body;
      if (!title || !category || typeof price !== 'number') {
        return res.status(400).json({ error: 'Title, category, and price are required.' });
      }

      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: title.trim(),
        description: description?.trim() || '',
        category,
        price,
        sellerSuggestedPrice: sellerSuggestedPrice || price,
        condition: condition || 'Like New',
        college: college || INITIAL_COLLEGES[0],
        sellerPhone: sellerPhone || '',
        sellerName: sellerName || '',
        imageUrl: imageUrl || '',
        isBoosted: false,
        stock: typeof stock === 'number' ? stock : 1,
        status: 'available',
        approvalStatus: 'pending_admin',
        createdAt: new Date().toISOString().split('T')[0]
      };

      db.products.unshift(newProd);
      saveDatabase(db);
      res.status(201).json(newProd);
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Orders API
  app.get('/api/orders', (_req: Request, res: Response) => {
    res.json(db.orders);
  });

  // Settings API
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json(db.settings);
  });

  // In Development, mount Vite middlewares
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UniTrade server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
