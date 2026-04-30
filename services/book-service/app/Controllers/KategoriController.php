<?php

namespace App\Controllers;

use App\Models\KategoriModel;
use CodeIgniter\RESTful\ResourceController;

class KategoriController extends ResourceController
{
    protected $modelName = KategoriModel::class;
    protected $format    = 'json';

    // GET /kategori
    public function index()
    {
        $page     = $this->request->getGet('page') ?? 1;
        $per_page = $this->request->getGet('per_page') ?? 10;
        $search   = $this->request->getGet('search');

        $model = new KategoriModel();

        if ($search) {
            $model->like('nama_kategori', $search);
        }

        $data  = $model->paginate($per_page, 'default', $page);
        $pager = $model->pager;

        return $this->respond([
            'success' => true,
            'message' => 'GET all kategori success',
            'data'    => $data,
            'pager'   => [
                'page'     => (int) $page,
                'per_page' => (int) $per_page,
                'total'    => $pager->getTotal('default'),
            ]
        ]);
    }

    // GET /kategori/:id
    public function show($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Kategori tidak ditemukan');
        }

        return $this->respond([
            'success' => true,
            'message' => 'GET kategori by id success',
            'data'    => $data
        ]);
    }

    // POST /kategori
    public function create()
    {
        $input = $this->request->getJSON(true);

        if (!isset($input['nama_kategori'])) {
            return $this->fail('nama_kategori wajib diisi', 400);
        }

        $this->model->insert($input);

        return $this->respondCreated([
            'success' => true,
            'message' => 'POST kategori success',
            'data'    => $input
        ]);
    }

    // PUT /kategori/:id
    public function update($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Kategori tidak ditemukan');
        }

        $input = $this->request->getJSON(true);

        if (!isset($input['nama_kategori'])) {
            return $this->fail('nama_kategori wajib diisi', 400);
        }

        $this->model->update($id, $input);

        return $this->respond([
            'success' => true,
            'message' => 'PUT kategori success',
            'data'    => $input
        ]);
    }

    // DELETE /kategori/:id
    public function delete($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Kategori tidak ditemukan');
        }

        $this->model->delete($id);

        return $this->respond([
            'success' => true,
            'message' => 'DELETE kategori success',
            'data'    => null
        ]);
    }
}