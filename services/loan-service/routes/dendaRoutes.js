const express = require('express');
const router  = express.Router();
const dbPool  = require('../db/connection');

// GET semua denda
router.get('/denda', async (req, res) => {
    const [data] = await dbPool.execute('SELECT * FROM denda');
    res.json({ success: true, message: 'GET all denda success', data: data });
});

// GET denda by id
router.get('/denda/:id', async (req, res) => {
    const { id } = req.params;
    const [data] = await dbPool.execute('SELECT * FROM denda WHERE id = ?', [id]);
    res.json({ success: true, message: 'GET denda by id success', data: data[0] });
});

// POST tambah denda
router.post('/denda', async (req, res) => {
    const { id_peminjaman, jumlah_hari_telat, total_denda } = req.body;
    await dbPool.execute(
        'INSERT INTO denda (id_peminjaman, jumlah_hari_telat, total_denda) VALUES (?, ?, ?)',
        [id_peminjaman, jumlah_hari_telat, total_denda]
    );
    res.status(201).json({ success: true, message: 'POST denda success', data: { id_peminjaman, jumlah_hari_telat, total_denda } });
});

// PUT update status denda
router.put('/denda/:id', async (req, res) => {
    const { id }     = req.params;
    const { status } = req.body;
    await dbPool.execute('UPDATE denda SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'PUT denda success', data: { id, status } });
});

// DELETE denda
router.delete('/denda/:id', async (req, res) => {
    const { id } = req.params;
    await dbPool.execute('DELETE FROM denda WHERE id = ?', [id]);
    res.json({ success: true, message: 'DELETE denda success', data: null });
});

module.exports = router;