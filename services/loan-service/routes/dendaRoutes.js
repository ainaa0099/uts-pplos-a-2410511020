const express = require('express');
const router  = express.Router();
const dbPool  = require('../db/connection');

// GET semua denda
router.get('/denda', async (req, res) => {
    try {
        const [data] = await dbPool.execute('SELECT * FROM denda');

        res.json({
            success: true,
            message: 'GET all denda success',
            data:    data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// GET denda by id
router.get('/denda/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await dbPool.execute('SELECT * FROM denda WHERE id = ?', [id]);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Denda tidak ditemukan',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'GET denda by id success',
            data:    data[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// POST tambah denda
router.post('/denda', async (req, res) => {
    try {
        const { id_peminjaman, jumlah_hari_telat, total_denda } = req.body;

        if (!id_peminjaman || !jumlah_hari_telat || !total_denda) {
            return res.status(400).json({
                success: false,
                message: 'id_peminjaman, jumlah_hari_telat, dan total_denda wajib diisi',
                data: null
            });
        }

        const [peminjaman] = await dbPool.execute('SELECT * FROM peminjaman WHERE id = ?', [id_peminjaman]);
        if (peminjaman.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Peminjaman tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute(
            'INSERT INTO denda (id_peminjaman, jumlah_hari_telat, total_denda) VALUES (?, ?, ?)',
            [id_peminjaman, jumlah_hari_telat, total_denda]
        );

        res.status(201).json({
            success: true,
            message: 'POST denda success',
            data:    { id_peminjaman, jumlah_hari_telat, total_denda }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// PUT update status denda
router.put('/denda/:id', async (req, res) => {
    try {
        const { id }     = req.params;
        const { status } = req.body;

        const validStatus = ['belum_bayar', 'sudah_bayar'];
        if (!status || !validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid, pilih: belum_bayar atau sudah_bayar',
                data: null
            });
        }

        const [denda] = await dbPool.execute('SELECT * FROM denda WHERE id = ?', [id]);
        if (denda.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Denda tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute('UPDATE denda SET status = ? WHERE id = ?', [status, id]);

        res.json({
            success: true,
            message: 'PUT denda success',
            data:    { id, status }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// DELETE denda
router.delete('/denda/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [denda] = await dbPool.execute('SELECT * FROM denda WHERE id = ?', [id]);
        if (denda.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Denda tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute('DELETE FROM denda WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'DELETE denda success',
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