const express = require('express');
const router  = express.Router();
const dbPool  = require('../db/connection');

// GET semua peminjaman
router.get('/peminjaman', async (req, res) => {
    try {
        const page     = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;
        const search   = req.query.search || '';
        const offset   = (page - 1) * per_page;

        let query  = 'SELECT * FROM peminjaman';
        let params = [];

        if (search) {
            query += ' WHERE status LIKE ?';
            params.push(`%${search}%`);
        }

        const [total] = await dbPool.execute(
            `SELECT COUNT(*) as total FROM peminjaman ${search ? 'WHERE status LIKE ?' : ''}`,
            search ? [`%${search}%`] : []
        );
        const [data] = await dbPool.execute(query + ' LIMIT ? OFFSET ?', [...params, per_page, offset]);

        res.json({
            success: true,
            message: 'GET all peminjaman success',
            data:    data,
            pager:   {
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

// GET peminjaman by id
router.get('/peminjaman/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await dbPool.execute('SELECT * FROM peminjaman WHERE id = ?', [id]);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Peminjaman tidak ditemukan',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'GET peminjaman by id success',
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

// POST tambah peminjaman
router.post('/peminjaman', async (req, res) => {
    try {
        const { id_anggota, id_buku, tanggal_pinjam, tanggal_kembali_rencana } = req.body;

        if (!id_anggota || !id_buku || !tanggal_pinjam || !tanggal_kembali_rencana) {
            return res.status(400).json({
                success: false,
                message: 'id_anggota, id_buku, tanggal_pinjam, dan tanggal_kembali_rencana wajib diisi',
                data: null
            });
        }

        await dbPool.execute(
            'INSERT INTO peminjaman (id_anggota, id_buku, tanggal_pinjam, tanggal_kembali_rencana) VALUES (?, ?, ?, ?)',
            [id_anggota, id_buku, tanggal_pinjam, tanggal_kembali_rencana]
        );

        res.status(201).json({
            success: true,
            message: 'POST peminjaman success',
            data:    { id_anggota, id_buku, tanggal_pinjam, tanggal_kembali_rencana }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// PUT update status peminjaman
router.put('/peminjaman/:id', async (req, res) => {
    try {
        const { id }     = req.params;
        const { status } = req.body;

        const validStatus = ['dipinjam', 'dikembalikan', 'terlambat'];
        if (!status || !validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid, pilih: dipinjam, dikembalikan, atau terlambat',
                data: null
            });
        }

        const [peminjaman] = await dbPool.execute('SELECT * FROM peminjaman WHERE id = ?', [id]);
        if (peminjaman.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Peminjaman tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute('UPDATE peminjaman SET status = ? WHERE id = ?', [status, id]);

        res.json({
            success: true,
            message: 'PUT peminjaman success',
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

// DELETE peminjaman
router.delete('/peminjaman/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [peminjaman] = await dbPool.execute('SELECT * FROM peminjaman WHERE id = ?', [id]);
        if (peminjaman.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Peminjaman tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute('DELETE FROM peminjaman WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'DELETE peminjaman success',
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