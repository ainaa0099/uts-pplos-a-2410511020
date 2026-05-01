require('dotenv').config();

const express        = require('express');
const session        = require('express-session');
const passport       = require('passport');
const app            = express();
const port           = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(session({
    secret:            process.env.JWT_SECRET,
    resave:            false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.path}`);
    next();
});

// routes
const authRoutes  = require('./routes/authRoutes');
const oauthRoutes = require('./routes/oauthRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);

// jalankan server
app.listen(port, () => {
    console.log(`server berjalan di http://localhost:${port}`);
});