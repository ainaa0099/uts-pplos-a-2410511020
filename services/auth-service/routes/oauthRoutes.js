require('dotenv').config();

const express        = require('express');
const router         = express.Router();
const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dbPool         = require('../db/connection');
const jwt            = require('jsonwebtoken');

const JWT_SECRET         = process.env.JWT_SECRET;
const JWT_EXPIRES_IN     = process.env.JWT_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN;

// konfigurasi passport google strategy
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email   = profile.emails[0].value;
        const nama    = profile.displayName;
        const foto    = profile.photos[0].value;
        const oauthId = profile.id;

        const [existing] = await dbPool.execute(
            'SELECT * FROM users WHERE email = ? OR oauth_id = ?',
            [email, oauthId]
        );

        if (existing.length > 0) return done(null, existing[0]);

        await dbPool.execute(
            'INSERT INTO users (nama, email, foto_profil, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?)',
            [nama, email, foto, 'google', oauthId]
        );

        const [newUser] = await dbPool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return done(null, newUser[0]);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/google/failed' }),
    async (req, res) => {
        try {
            const user = req.user;

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
                message: 'Login Google berhasil',
                data: {
                    access_token:  accessToken,
                    refresh_token: refreshToken,
                    user: {
                        id:          user.id,
                        nama:        user.nama,
                        email:       user.email,
                        foto_profil: user.foto_profil,
                        role:        user.role,
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server Error',
                serverMessage: error,
            });
        }
    }
);

// GET /api/auth/google/failed
router.get('/google/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Login Google gagal',
        data: null
    });
});

module.exports = router;