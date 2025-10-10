import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5174;

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins for API access
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later."
});
app.use('/api/', limiter);

// Import and mount API routes
// Note: These are Vercel serverless functions, so we import their handlers
const loginHandler = (await import('../api/login.js')).default;
const propertiesHandler = (await import('../api/properties.js')).default;
const propertyByIdHandler = (await import('../api/properties/[id].js')).default;
const adminPropertiesHandler = (await import('../api/admin/properties/index.js')).default;
const adminPropertyByIdHandler = (await import('../api/admin/properties/[id].js')).default;

// Routes
app.post('/api/login', loginHandler);
app.get('/api/properties', propertiesHandler);
app.get('/api/properties/:id', (req, res) => {
  req.query = { ...req.query, id: req.params.id };
  return propertyByIdHandler(req, res);
});
app.get('/api/admin/properties', adminPropertiesHandler);
app.post('/api/admin/properties', adminPropertiesHandler);
app.put('/api/admin/properties/:id', (req, res) => {
  req.query = { ...req.query, id: req.params.id };
  return adminPropertyByIdHandler(req, res);
});
app.delete('/api/admin/properties/:id', (req, res) => {
  req.query = { ...req.query, id: req.params.id };
  return adminPropertyByIdHandler(req, res);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});