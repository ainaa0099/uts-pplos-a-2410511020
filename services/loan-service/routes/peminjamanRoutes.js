const express = require('express');
const router  = express.Router();
const dbPool  = require('../db/connection');

// GET semua peminjaman
router.get('/peminjaman', async (req, res) => {
    const [data] = await dbPool.execute('SELECT * FROM peminjaman');
    res.json({ success: true, message: 'GET all peminjaman success', data: data });
});

// GET peminjaman by id
router.get('/peminjaman/:id', async (req, res) => {
    const { id } = req.params;
    const [data] = await dbPool.execute('SELECT * FROM peminjaman WHERE id = ?', [id]);
    res.json({ success: true, message: 'GET peminjaman by id success', data: data[0] });
});

// POST tambah peminjaman
router.post('/peminjaman', async (req, res) => {
    const { id_anggota, id_buku, tanggal_pinjam, tanggal_kembali_rencana } = req.body;
    await dbPool.execute(
        'INSERT INTO peminjaman (id_anggota, id_buku, tanggal_pinjam, tanggal_kembali_rencana) VALUES (?, ?, ?, ?)',
        [id_anggota, id_buku, tanggal_pinjam, tanggal_kembali_rencana]
    );
    res.status(201).json({ success: true, message: 'POST peminjaman success', data: { id_anggota, id_buku, tanggal_pinjam, tanggal_kembali_rencana } });
});

// PUT update status peminjaman
router.put('/peminjaman/:id', async (req, res) => {
    const { id }     = req.params;
    const { status } = req.body;
    await dbPool.execute('UPDATE peminjaman SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'PUT peminjaman success', data: { id, status } });
});

// DELETE peminjaman
router.delete('/peminjaman/:id', async (req, res) => {
    const { id } = req.params;
    await dbPool.execute('DELETE FROM peminjaman WHERE id = ?', [id]);
    res.json({ success: true, message: 'DELETE peminjaman success', data: null });
});

module.exports = router;