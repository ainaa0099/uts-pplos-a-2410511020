const express = require('express');
const router  = express.Router();
const dbPool  = require('../db/connection');

// GET semua pengembalian
router.get('/pengembalian', async (req, res) => {
    const [data] = await dbPool.execute('SELECT * FROM pengembalian');
    res.json({ success: true, message: 'GET all pengembalian success', data: data });
});

// GET pengembalian by id
router.get('/pengembalian/:id', async (req, res) => {
    const { id } = req.params;
    const [data] = await dbPool.execute('SELECT * FROM pengembalian WHERE id = ?', [id]);
    res.json({ success: true, message: 'GET pengembalian by id success', data: data[0] });
});

// POST tambah pengembalian
router.post('/pengembalian', async (req, res) => {
    const { id_peminjaman, tanggal_kembali, kondisi_buku, catatan } = req.body;
    await dbPool.execute(
        'INSERT INTO pengembalian (id_peminjaman, tanggal_kembali, kondisi_buku, catatan) VALUES (?, ?, ?, ?)',
        [id_peminjaman, tanggal_kembali, kondisi_buku, catatan]
    );
    res.status(201).json({ success: true, message: 'POST pengembalian success', data: { id_peminjaman, tanggal_kembali, kondisi_buku, catatan } });
});

// DELETE pengembalian
router.delete('/pengembalian/:id', async (req, res) => {
    const { id } = req.params;
    await dbPool.execute('DELETE FROM pengembalian WHERE id = ?', [id]);
    res.json({ success: true, message: 'DELETE pengembalian success', data: null });
});

module.exports = router;