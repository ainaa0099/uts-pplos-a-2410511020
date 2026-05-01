require('dotenv').config();

const express        = require('express');
const router         = express.Router();
const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dbPool         = require('../db/connection');

// konfigurasi passport google strategy
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    const email   = profile.emails[0].value;
    const nama    = profile.displayName;
    const foto    = profile.photos[0].value;
    const oauthId = profile.id;

    const [existing] = await dbPool.execute(
        'SELECT * FROM users WHERE email = ?', [email]
    );

    if (existing.length > 0) return done(null, existing[0]);

    await dbPool.execute(
        'INSERT INTO users (nama, email, foto_profil, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?)',
        [nama, email, foto, 'google', oauthId]
    );

    const [newUser] = await dbPool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return done(null, newUser[0]);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/google/failed' }),
    (req, res) => {
        res.json({ success: true, message: 'Login Google berhasil', data: req.user });
    }
);

// GET /api/auth/google/failed
router.get('/google/failed', (req, res) => {
    res.status(401).json({ success: false, message: 'Login Google gagal', data: null });
});

module.exports = router;