require('dotenv').config();

const jwt    = require('jsonwebtoken');
const dbPool = require('../db/connection');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token      = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ditemukan',
            data: null
        });
    }

    const [blacklisted] = await dbPool.execute('SELECT * FROM token_blacklist WHERE token = ?', [token]);
    if (blacklisted.length > 0) {
        return res.status(401).json({
            success: false,
            message: 'Token sudah tidak valid',
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

module.exports = verifyToken;