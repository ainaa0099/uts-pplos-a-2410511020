const express = require('express');
const router  = express.Router();
const dbPool  = require('../db/connection');

// GET semua pengembalian
router.get('/pengembalian', async (req, res) => {
    try {
        const [data] = await dbPool.execute('SELECT * FROM pengembalian');

        res.json({
            success: true,
            message: 'GET all pengembalian success',
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

// GET pengembalian by id
router.get('/pengembalian/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await dbPool.execute('SELECT * FROM pengembalian WHERE id = ?', [id]);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pengembalian tidak ditemukan',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'GET pengembalian by id success',
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

// POST tambah pengembalian
router.post('/pengembalian', async (req, res) => {
    try {
        const { id_peminjaman, tanggal_kembali, kondisi_buku, catatan } = req.body;

        if (!id_peminjaman || !tanggal_kembali) {
            return res.status(400).json({
                success: false,
                message: 'id_peminjaman dan tanggal_kembali wajib diisi',
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
            'INSERT INTO pengembalian (id_peminjaman, tanggal_kembali, kondisi_buku, catatan) VALUES (?, ?, ?, ?)',
            [id_peminjaman, tanggal_kembali, kondisi_buku, catatan]
        );

        // hitung denda otomatis jika terlambat
        const rencana      = new Date(peminjaman[0].tanggal_kembali_rencana);
        const aktual       = new Date(tanggal_kembali);
        const selisihHari  = Math.floor((aktual - rencana) / (1000 * 60 * 60 * 24));

        if (selisihHari > 0) {
            const totalDenda = selisihHari * 1000;
            await dbPool.execute(
                'INSERT INTO denda (id_peminjaman, jumlah_hari_telat, total_denda) VALUES (?, ?, ?)',
                [id_peminjaman, selisihHari, totalDenda]
            );

            await dbPool.execute(
                'UPDATE peminjaman SET status = ?, tanggal_kembali_aktual = ? WHERE id = ?',
                ['terlambat', tanggal_kembali, id_peminjaman]
            );
        } else {
            await dbPool.execute(
                'UPDATE peminjaman SET status = ?, tanggal_kembali_aktual = ? WHERE id = ?',
                ['dikembalikan', tanggal_kembali, id_peminjaman]
            );
        }

        res.status(201).json({
            success: true,
            message: 'POST pengembalian success',
            data:    { id_peminjaman, tanggal_kembali, kondisi_buku, catatan }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            serverMessage: error,
        });
    }
});

// DELETE pengembalian
router.delete('/pengembalian/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [pengembalian] = await dbPool.execute('SELECT * FROM pengembalian WHERE id = ?', [id]);
        if (pengembalian.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pengembalian tidak ditemukan',
                data: null
            });
        }

        await dbPool.execute('DELETE FROM pengembalian WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'DELETE pengembalian success',
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