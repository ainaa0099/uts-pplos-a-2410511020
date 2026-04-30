<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// kategori routes
$routes->get('kategori', 'KategoriController::index');
$routes->get('kategori/(:num)', 'KategoriController::show/$1');
$routes->post('kategori', 'KategoriController::create');
$routes->put('kategori/(:num)', 'KategoriController::update/$1');
$routes->delete('kategori/(:num)', 'KategoriController::delete/$1');

// penulis routes
$routes->get('penulis', 'PenulisController::index');
$routes->get('penulis/(:num)', 'PenulisController::show/$1');
$routes->post('penulis', 'PenulisController::create');
$routes->put('penulis/(:num)', 'PenulisController::update/$1');
$routes->delete('penulis/(:num)', 'PenulisController::delete/$1');

// rak routes
$routes->get('rak', 'RakController::index');
$routes->get('rak/(:num)', 'RakController::show/$1');
$routes->post('rak', 'RakController::create');
$routes->put('rak/(:num)', 'RakController::update/$1');
$routes->delete('rak/(:num)', 'RakController::delete/$1');

// buku routes
$routes->get('buku', 'BukuController::index');
$routes->get('buku/(:num)', 'BukuController::show/$1');
$routes->post('buku', 'BukuController::create');
$routes->put('buku/(:num)', 'BukuController::update/$1');
$routes->delete('buku/(:num)', 'BukuController::delete/$1');
