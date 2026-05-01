require('dotenv').config();

const express = require('express');
const app     = express();
const port    = process.env.PORT || 3001;

// middleware
app.use(express.json());

// logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.path}`);
    next();
});

// routes
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

// jalankan server
app.listen(port, () => {
    console.log(`server berjalan di http://localhost:${port}`);
});