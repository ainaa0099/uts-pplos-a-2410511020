require('dotenv').config();

const express            = require('express');
const router             = express.Router();
const dbPool             = require('../db/connection');
const bcrypt             = require('bcryptjs');
const jwt                = require('jsonwebtoken');

const JWT_SECRET         = process.env.JWT_SECRET;
const JWT_EXPIRES_IN     = process.env.JWT_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN;

// POST register
router.post('/register', async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        if (!nama || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'nama, email, dan password wajib diisi',
                data: null
            });
        }

        const [existing] = await dbPool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar',
                data: null
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await dbPool.execute(
            'INSERT INTO users (nama, email, password) VALUES (?, ?, ?)',
            [nama, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'Register berhasil',
            data: { nama, email }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// POST login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'email dan password wajib diisi',
                data: null
            });
        }

        const [users] = await dbPool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah',
                data: null
            });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah',
                data: null
            });
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: REFRESH_EXPIRES_IN }
        );

        const expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + 7);

        await dbPool.execute(
            'INSERT INTO refresh_tokens (user_id, token, expired_at) VALUES (?, ?, ?)',
            [user.id, refreshToken, expiredAt]
        );

        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                access_token:  accessToken,
                refresh_token: refreshToken,
                user: { id: user.id, nama: user.nama, email: user.email, role: user.role }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// POST refresh token
router.post('/refresh-token', async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(400).json({
                success: false,
                message: 'refresh_token wajib diisi',
                data: null
            });
        }

        const [tokens] = await dbPool.execute('SELECT * FROM refresh_tokens WHERE token = ?', [refresh_token]);
        if (tokens.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token tidak valid',
                data: null
            });
        }

        const decoded = jwt.verify(refresh_token, JWT_SECRET);
        const [users] = await dbPool.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);

        const accessToken = jwt.sign(
            { id: users[0].id, email: users[0].email, role: users[0].role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Refresh token berhasil',
            data: { access_token: accessToken }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// POST logout
router.post('/logout', async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(400).json({
                success: false,
                message: 'refresh_token wajib diisi',
                data: null
            });
        }

        await dbPool.execute('DELETE FROM refresh_tokens WHERE token = ?', [refresh_token]);

        const authHeader = req.headers['authorization'];
        const token      = authHeader && authHeader.split(' ')[1];

        if (token) {
            await dbPool.execute('INSERT INTO token_blacklist (token) VALUES (?)', [token]);
        }

        res.json({
            success: true,
            message: 'Logout berhasil',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

module.exports = router;