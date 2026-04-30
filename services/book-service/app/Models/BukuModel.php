<?php

namespace App\Models;

use CodeIgniter\Model;

class BukuModel extends Model
{
    protected $table         = 'buku';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'judul', 'isbn', 'id_penulis', 'id_kategori',
        'id_rak', 'tahun_terbit', 'stok', 'deskripsi', 'cover_url'
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}