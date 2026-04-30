<?php

namespace App\Models;

use CodeIgniter\Model;

class KategoriModel extends Model
{
    protected $table         = 'kategori_buku';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['nama_kategori', 'deskripsi'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}