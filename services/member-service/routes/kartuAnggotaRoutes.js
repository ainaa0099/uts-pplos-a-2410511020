const express = require('express');
const router = express.Router();
const dbPool = require('../db/connection');

// GET semua kartu anggota
router.get('/kartu-anggota', async (req, res) => {
    const [data] = await dbPool.execute('SELECT * FROM kartu_anggota');
    res.json({ success: true, message: 'GET all kartu anggota success', data: data });
});

// GET kartu anggota by id
router.get('/kartu-anggota/:id', async (req, res) => {
    const { id } = req.params;
    const [data] = await dbPool.execute('SELECT * FROM kartu_anggota WHERE id = ?', [id]);
    res.json({ success: true, message: 'GET kartu anggota by id success', data: data[0] });
});

// POST tambah kartu anggota
router.post('/kartu-anggota', async (req, res) => {
    const { id_anggota, nomor_kartu, tanggal_berlaku } = req.body;
    await dbPool.execute('INSERT INTO kartu_anggota (id_anggota, nomor_kartu, tanggal_berlaku) VALUES (?, ?, ?)', [id_anggota, nomor_kartu, tanggal_berlaku]);
    res.status(201).json({ success: true, message: 'POST kartu anggota success', data: { id_anggota, nomor_kartu, tanggal_berlaku } });
});

// PUT update kartu anggota
router.put('/kartu-anggota/:id', async (req, res) => {
    const { id }     = req.params;
    const { status } = req.body;
    await dbPool.execute('UPDATE kartu_anggota SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'PUT kartu anggota success', data: { id, status } });
});

// DELETE kartu anggota
router.delete('/kartu-anggota/:id', async (req, res) => {
    const { id } = req.params;
    await dbPool.execute('DELETE FROM kartu_anggota WHERE id = ?', [id]);
    res.json({ success: true, message: 'DELETE kartu anggota success', data: null });
});

module.exports = router;