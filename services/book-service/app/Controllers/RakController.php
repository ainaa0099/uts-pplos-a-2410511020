<?php

namespace App\Controllers;

use App\Models\RakModel;
use CodeIgniter\RESTful\ResourceController;

class RakController extends ResourceController
{
    protected $modelName = RakModel::class;
    protected $format    = 'json';

    // GET /rak
    public function index()
    {
        $page     = $this->request->getGet('page') ?? 1;
        $per_page = $this->request->getGet('per_page') ?? 10;

        $model = new RakModel();
        $data  = $model->paginate($per_page, 'default', $page);
        $pager = $model->pager;

        return $this->respond([
            'success' => true,
            'message' => 'GET all rak success',
            'data'    => $data,
            'pager'   => [
                'page'     => (int) $page,
                'per_page' => (int) $per_page,
                'total'    => $pager->getTotal('default'),
            ]
        ]);
    }

    // GET /rak/:id
    public function show($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Rak tidak ditemukan');
        }

        return $this->respond([
            'success' => true,
            'message' => 'GET rak by id success',
            'data'    => $data
        ]);
    }

    // POST /rak
    public function create()
    {
        $input = $this->request->getJSON(true);

        if (!isset($input['kode_rak'])) {
            return $this->fail('kode_rak wajib diisi', 400);
        }

        $this->model->insert($input);

        return $this->respondCreated([
            'success' => true,
            'message' => 'POST rak success',
            'data'    => $input
        ]);
    }

    // PUT /rak/:id
    public function update($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Rak tidak ditemukan');
        }

        $input = $this->request->getJSON(true);

        if (!isset($input['kode_rak'])) {
            return $this->fail('kode_rak wajib diisi', 400);
        }

        $this->model->update($id, $input);

        return $this->respond([
            'success' => true,
            'message' => 'PUT rak success',
            'data'    => $input
        ]);
    }

    // DELETE /rak/:id
    public function delete($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Rak tidak ditemukan');
        }

        $this->model->delete($id);

        return $this->respond([
            'success' => true,
            'message' => 'DELETE rak success',
            'data'    => null
        ]);
    }
}