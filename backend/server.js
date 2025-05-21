process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception:', err, err && err.message, err && err.stack);
});
process.on('unhandledRejection', function (reason, promise) {
  console.error('Unhandled Rejection:', reason);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const mfaRoutes = require('./routes/mfa');
const adminRoutes = require('./routes/admin');
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/mfa', mfaRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('SecureCloudVault Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));