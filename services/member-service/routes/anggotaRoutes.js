const express = require('express');
const router = express.Router();
const dbPool = require('../db/connection');

// GET semua anggota
router.get('/anggota', async (req, res) => {
    const [data] = await dbPool.execute('SELECT * FROM anggota');
    res.json({ success: true, message: 'GET all anggota success', data: data });
});

// GET anggota by id
router.get('/anggota/:id', async (req, res) => {
    const { id } = req.params;
    const [data] = await dbPool.execute('SELECT * FROM anggota WHERE id = ?', [id]);
    res.json({ success: true, message: 'GET anggota by id success', data: data[0] });
});

// POST tambah anggota
router.post('/anggota', async (req, res) => {
    const { user_id, nama, email, no_hp, alamat } = req.body;
    await dbPool.execute('INSERT INTO anggota (user_id, nama, email, no_hp, alamat) VALUES (?, ?, ?, ?, ?)', [user_id, nama, email, no_hp, alamat]);
    res.status(201).json({ success: true, message: 'POST anggota success', data: { user_id, nama, email } });
});

// PUT update anggota
router.put('/anggota/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, no_hp, alamat } = req.body;
    await dbPool.execute('UPDATE anggota SET nama = ?, no_hp = ?, alamat = ? WHERE id = ?', [nama, no_hp, alamat, id]);
    res.json({ success: true, message: 'PUT anggota success', data: { id, nama, no_hp, alamat } });
});

// DELETE anggota
router.delete('/anggota/:id', async (req, res) => {
    const { id } = req.params;
    await dbPool.execute('DELETE FROM anggota WHERE id = ?', [id]);
    res.json({ success: true, message: 'DELETE anggota success', data: null });
});

module.exports = router;