const express = require('express');
const router  = express.Router();
const dbPool  = require('../db/connection');

// GET semua kartu anggota
router.get('/kartu-anggota', async (req, res) => {
    try {
        const [data] = await dbPool.execute('SELECT * FROM kartu_anggota');

        res.json({
            success: true,
            message: 'GET all kartu anggota success',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// GET kartu anggota by id
router.get('/kartu-anggota/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await dbPool.execute('SELECT * FROM kartu_anggota WHERE id = ?', [id]);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kartu anggota tidak ditemukan',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'GET kartu anggota by id success',
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

// POST tambah kartu anggota
router.post('/kartu-anggota', async (req, res) => {
    try {
        const { id_anggota, nomor_kartu, tanggal_berlaku } = req.body;

        if (!id_anggota || !nomor_kartu || !tanggal_berlaku) {
            return res.status(400).json({
                success: false,
                message: 'id_anggota, nomor_kartu, dan tanggal_berlaku wajib diisi',
                data: null
            });
        }

        const [anggota] = await dbPool.execute('SELECT * FROM anggota WHERE id = ?', [id_anggota]);
        if (anggota.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Anggota tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute(
            'INSERT INTO kartu_anggota (id_anggota, nomor_kartu, tanggal_berlaku) VALUES (?, ?, ?)',
            [id_anggota, nomor_kartu, tanggal_berlaku]
        );

        res.status(201).json({
            success: true,
            message: 'POST kartu anggota success',
            data: { id_anggota, nomor_kartu, tanggal_berlaku }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// PUT update kartu anggota
router.put('/kartu-anggota/:id', async (req, res) => {
    try {
        const { id }     = req.params;
        const { status } = req.body;

        const validStatus = ['aktif', 'nonaktif'];
        if (!status || !validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid, pilih: aktif atau nonaktif',
                data: null
            });
        }

        const [kartu] = await dbPool.execute('SELECT * FROM kartu_anggota WHERE id = ?', [id]);
        if (kartu.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kartu anggota tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute('UPDATE kartu_anggota SET status = ? WHERE id = ?', [status, id]);

        res.json({
            success: true,
            message: 'PUT kartu anggota success',
            data: { id, status }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// DELETE kartu anggota
router.delete('/kartu-anggota/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [kartu] = await dbPool.execute('SELECT * FROM kartu_anggota WHERE id = ?', [id]);
        if (kartu.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kartu anggota tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute('DELETE FROM kartu_anggota WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'DELETE kartu anggota success',
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