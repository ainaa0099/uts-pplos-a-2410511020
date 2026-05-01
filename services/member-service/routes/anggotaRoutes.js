const express = require('express');
const router  = express.Router();
const dbPool  = require('../db/connection');

// GET semua anggota
router.get('/anggota', async (req, res) => {
    try {
        const page     = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;
        const search   = req.query.search || '';
        const offset   = (page - 1) * per_page;

        let query  = 'SELECT * FROM anggota';
        let params = [];

        if (search) {
            query += ' WHERE nama LIKE ? OR email LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [total] = await dbPool.execute(
            `SELECT COUNT(*) as total FROM anggota ${search ? 'WHERE nama LIKE ? OR email LIKE ?' : ''}`,
            search ? [`%${search}%`, `%${search}%`] : []
        );
        const [data] = await dbPool.execute(query + ' LIMIT ? OFFSET ?', [...params, per_page, offset]);

        res.json({
            success: true,
            message: 'GET all anggota success',
            data: data,
            pager: {
                page:     page,
                per_page: per_page,
                total:    total[0].total,
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

// GET anggota by id
router.get('/anggota/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await dbPool.execute('SELECT * FROM anggota WHERE id = ?', [id]);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Anggota tidak ditemukan',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'GET anggota by id success',
            data: data[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// POST tambah anggota
router.post('/anggota', async (req, res) => {
    try {
        const { user_id, nama, email, no_hp, alamat } = req.body;

        if (!user_id || !nama || !email) {
            return res.status(400).json({
                success: false,
                message: 'user_id, nama, dan email wajib diisi',
                data: null
            });
        }

        const [existing] = await dbPool.execute('SELECT * FROM anggota WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar',
                data: null
            });
        }

        await dbPool.execute(
            'INSERT INTO anggota (user_id, nama, email, no_hp, alamat) VALUES (?, ?, ?, ?, ?)',
            [user_id, nama, email, no_hp, alamat]
        );

        res.status(201).json({
            success: true,
            message: 'POST anggota success',
            data: { user_id, nama, email, no_hp, alamat }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// PUT update anggota
router.put('/anggota/:id', async (req, res) => {
    try {
        const { id }            = req.params;
        const { nama, no_hp, alamat } = req.body;

        if (!nama) {
            return res.status(400).json({
                success: false,
                message: 'nama wajib diisi',
                data: null
            });
        }

        const [anggota] = await dbPool.execute('SELECT * FROM anggota WHERE id = ?', [id]);
        if (anggota.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Anggota tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute(
            'UPDATE anggota SET nama = ?, no_hp = ?, alamat = ? WHERE id = ?',
            [nama, no_hp, alamat, id]
        );

        res.json({
            success: true,
            message: 'PUT anggota success',
            data: { id, nama, no_hp, alamat }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// DELETE anggota
router.delete('/anggota/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [anggota] = await dbPool.execute('SELECT * FROM anggota WHERE id = ?', [id]);
        if (anggota.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Anggota tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute('DELETE FROM anggota WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'DELETE anggota success',
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