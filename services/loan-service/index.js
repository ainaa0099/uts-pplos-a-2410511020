require('dotenv').config();

const express          = require('express');
const app              = express();
const port             = process.env.PORT || 3003;

// middleware
app.use(express.json());

// logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.path}`);
    next();
});

// routes
const peminjamanRoutes   = require('./routes/peminjamanRoutes');
const pengembalianRoutes = require('./routes/pengembalianRoutes');
const dendaRoutes        = require('./routes/dendaRoutes');

app.use(peminjamanRoutes);
app.use(pengembalianRoutes);
app.use(dendaRoutes);

// jalankan server
app.listen(port, () => {
    console.log(`server berjalan di http://localhost:${port}`);
});