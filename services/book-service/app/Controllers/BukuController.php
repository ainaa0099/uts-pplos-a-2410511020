<?php

namespace App\Controllers;

use App\Models\BukuModel;
use CodeIgniter\RESTful\ResourceController;

class BukuController extends ResourceController
{
    protected $modelName = BukuModel::class;
    protected $format    = 'json';

    // GET /buku
    public function index()
    {
        $page      = $this->request->getGet('page') ?? 1;
        $per_page  = $this->request->getGet('per_page') ?? 10;
        $search    = $this->request->getGet('search');
        $kategori  = $this->request->getGet('id_kategori');

        $model = new BukuModel();

        if ($search) {
            $model->like('judul', $search);
        }

        if ($kategori) {
            $model->where('id_kategori', $kategori);
        }

        $data  = $model->paginate($per_page, 'default', $page);
        $pager = $model->pager;

        return $this->respond([
            'success' => true,
            'message' => 'GET all buku success',
            'data'    => $data,
            'pager'   => [
                'page'     => (int) $page,
                'per_page' => (int) $per_page,
                'total'    => $pager->getTotal('default'),
            ]
        ]);
    }

    // GET /buku/:id
    public function show($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Buku tidak ditemukan');
        }

        return $this->respond([
            'success' => true,
            'message' => 'GET buku by id success',
            'data'    => $data
        ]);
    }

    // POST /buku
    public function create()
    {
        $input = $this->request->getJSON(true);

        $required = ['judul', 'id_penulis', 'id_kategori', 'id_rak', 'stok'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                return $this->fail("$field wajib diisi", 400);
            }
        }

        $this->model->insert($input);

        return $this->respondCreated([
            'success' => true,
            'message' => 'POST buku success',
            'data'    => $input
        ]);
    }

    // PUT /buku/:id
    public function update($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Buku tidak ditemukan');
        }

        $input = $this->request->getJSON(true);

        $this->model->update($id, $input);

        return $this->respond([
            'success' => true,
            'message' => 'PUT buku success',
            'data'    => $input
        ]);
    }

    // DELETE /buku/:id
    public function delete($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Buku tidak ditemukan');
        }

        $this->model->delete($id);

        return $this->respond([
            'success' => true,
            'message' => 'DELETE buku success',
            'data'    => null
        ]);
    }
}