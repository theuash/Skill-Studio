require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDB, getDBStatus } = require('./config/db');
const { globalLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { verifyEmailConnection } = require('./utils/emailService');

// ─── Route Imports ────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const sectorRoutes = require('./routes/sectors');
const roadmapRoutes = require('./routes/roadmap');
const projectRoutes = require('./routes/project');
const userRoutes = require('./routes/user');
const newsRoutes = require('./routes/news');
const jobsRoutes = require('./routes/jobs');
const projectsRoutes = require('./routes/projects');

// ─── App Init ─────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Trust Proxy (for rate limiting behind reverse proxy) ─────────────────────
app.set('trust proxy', 1);

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin} is not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
  );
}

// ─── Global Rate Limit ────────────────────────────────────────────────────────
app.use('/api/', globalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const db = getDBStatus();
  const status = db.connected ? 'healthy' : 'degraded';

  return res.status(db.connected ? 200 : 503).json({
    success: db.connected,
    status,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      database: {
        status: db.stateLabel,
        connected: db.connected,
      },
      groq: {
        configured: !!process.env.GROQ_API_KEY,
      },
      huggingface: {
        configured: !!process.env.HUGGINGFACE_API_KEY,
      },
      email: {
        configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
      },
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/sectors', sectorRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/jobs', jobsRoutes);

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌉 SkillBridge API — Bridge the Gap Between Learning and Earning',
    version: '1.0.0',
    docs: '/api/health',
    endpoints: {
      auth: '/api/auth',
      sectors: '/api/sectors',
      roadmap: '/api/roadmap',
      project: '/api/project',
      user: '/api/user',
    },
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: ['/api/auth', '/api/sectors', '/api/roadmap', '/api/project', '/api/user'],
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Warm up email service (non-blocking)
    verifyEmailConnection().catch(() => {});

    // Start listening
    app.listen(PORT, () => {
      console.log('\n══════════════════════════════════════════');
      console.log('  🌉 SkillBridge API Server');
      console.log('══════════════════════════════════════════');
      console.log(`  🚀 Running on: http://localhost:${PORT}`);
      console.log(`  📍 Health:     http://localhost:${PORT}/api/health`);
      console.log(`  🌍 Env:        ${process.env.NODE_ENV || 'development'}`);
      console.log(`  🔑 Groq:       ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing'}`);
      console.log(`  🤗 HuggingFace:${process.env.HUGGINGFACE_API_KEY ? '✅ Configured' : '❌ Missing'}`);
      console.log(`  📧 Email:      ${process.env.EMAIL_USER ? '✅ Configured' : '❌ Missing'}`);
      console.log('══════════════════════════════════════════\n');
    });

  } catch (err) {
    console.error('💥 Failed to start server:', err.message);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\n📴 ${signal} received. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  process.exit(1);
});

startServer();

module.exports = app;
