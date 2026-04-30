<?php

namespace App\Models;

use CodeIgniter\Model;

class RakModel extends Model
{
    protected $table         = 'rak';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['kode_rak', 'lokasi'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}