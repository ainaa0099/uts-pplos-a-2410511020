const express = require('express');
const app = express();
const port = 3002;

// middleware
app.use(express.json());

// logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.path}`);
    next();
});

// routes
const anggotaRoutes      = require('./routes/anggotaRoutes');
const kartuAnggotaRoutes = require('./routes/kartuAnggotaRoutes');

app.use(anggotaRoutes);
app.use(kartuAnggotaRoutes);

// jalankan server
app.listen(port, () => {
    console.log(`server berjalan di http://localhost:${port}`);
});