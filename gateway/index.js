require('dotenv').config();

const express      = require('express');
const rateLimit    = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt          = require('jsonwebtoken');
const app          = express();
const port         = process.env.PORT || 8000;

const JWT_SECRET = process.env.JWT_SECRET;

// rate limiting 60 request per menit per IP
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max:      60,
    message:  { success: false, message: 'Terlalu banyak request, coba lagi nanti' }
});

app.use(limiter);

// middleware verifikasi JWT
const verifyToken = (req, res, next) => {
    const publicRoutes = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/google',
        '/api/auth/google/callback',
        '/api/auth/refresh-token',
    ];

    if (publicRoutes.some(route => req.path.startsWith(route))) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token      = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ditemukan',
            data: null
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid atau sudah expired',
                data: null
            });
        }
        req.user = decoded;
        next();
    });
};

app.use(verifyToken);

// logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.path}`);
    next();
});

// routing ke masing-masing service
app.use('/api/auth', createProxyMiddleware({
    target:      process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
}));

app.use('/api/buku', createProxyMiddleware({
    target:      process.env.BOOK_SERVICE_URL,
    changeOrigin: true,
    pathRewrite:  { '^/api/buku': '/buku' },
}));

app.use('/api/kategori', createProxyMiddleware({
    target:      process.env.BOOK_SERVICE_URL,
    changeOrigin: true,
    pathRewrite:  { '^/api/kategori': '/kategori' },
}));

app.use('/api/penulis', createProxyMiddleware({
    target:      process.env.BOOK_SERVICE_URL,
    changeOrigin: true,
    pathRewrite:  { '^/api/penulis': '/penulis' },
}));

app.use('/api/rak', createProxyMiddleware({
    target:      process.env.BOOK_SERVICE_URL,
    changeOrigin: true,
    pathRewrite:  { '^/api/rak': '/rak' },
}));

app.use('/api/anggota', createProxyMiddleware({
    target:      process.env.MEMBER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite:  { '^/api/anggota': '/anggota' },
}));

app.use('/api/kartu-anggota', createProxyMiddleware({
    target:      process.env.MEMBER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite:  { '^/api/kartu-anggota': '/kartu-anggota' },
}));

app.use('/api/peminjaman', createProxyMiddleware({
    target:      process.env.LOAN_SERVICE_URL,
    changeOrigin: true,
    pathRewrite:  { '^/api/peminjaman': '/peminjaman' },
}));

app.use('/api/pengembalian', createProxyMiddleware({
    target:      process.env.LOAN_SERVICE_URL,
    changeOrigin: true,
    pathRewrite:  { '^/api/pengembalian': '/pengembalian' },
}));

app.use('/api/denda', createProxyMiddleware({
    target:      process.env.LOAN_SERVICE_URL,
    changeOrigin: true,
    pathRewrite:  { '^/api/denda': '/denda' },
}));

// jalankan server
app.listen(port, () => {
    console.log(`API Gateway berjalan di http://localhost:${port}`);
});