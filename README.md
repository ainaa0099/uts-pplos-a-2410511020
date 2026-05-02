# Sistem Informasi Perpustakaan Digital
### UTS Pembangunan Perangkat Lunak Berorientasi Service
### Kelas A Informatika

## Identitas
- Nama  : Aina Annisa
- NIM   : 2410511020
- Kelas : A

## Deskripsi
Sistem perpustakaan digital berbasis microservice yang terdiri dari
4 service independen dan 1 API Gateway.

## Teknologi
- Node.js + Express (Auth Service, Member Service, Loan Service, API Gateway)
- PHP CodeIgniter 4 (Book Service)
- MySQL / MariaDB
- JWT Authentication
- Google OAuth 2.0

## Cara Menjalankan

### 1. Clone Repository
```bash
git clone https://github.com/ainaa0099/uts-pplos-a-2410511020.git
cd uts-pplos-a-2410511020
```

### 2. Setup Database
Import file `docs/sql/init.sql` ke MySQL.

### 3. Jalankan Semua Service

**Auth Service (port 3001)**
```bash
cd services/auth-service
npm install
node index.js
```

**Member Service (port 3002)**
```bash
cd services/member-service
npm install
node index.js
```

**Loan Service (port 3003)**
```bash
cd services/loan-service
npm install
node index.js
```

**Book Service (port 8080)**
```bash
cd services/book-service
composer install
php spark serve
```

**API Gateway (port 8000)**
```bash
cd gateway
npm install
node index.js
```

## Peta Endpoint

Semua request melalui API Gateway di `http://localhost:8000`

### Auth Service
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | /api/auth/register | Register user baru |
| POST | /api/auth/login | Login user |
| POST | /api/auth/refresh-token | Refresh access token |
| POST | /api/auth/logout | Logout user |
| GET | /api/auth/google | Login dengan Google |

### Book Service
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /api/buku | Get semua buku |
| GET | /api/buku/:id | Get buku by id |
| POST | /api/buku | Tambah buku |
| PUT | /api/buku/:id | Update buku |
| DELETE | /api/buku/:id | Hapus buku |
| GET | /api/kategori | Get semua kategori |
| GET | /api/penulis | Get semua penulis |
| GET | /api/rak | Get semua rak |

### Member Service
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /api/anggota | Get semua anggota |
| GET | /api/anggota/:id | Get anggota by id |
| POST | /api/anggota | Tambah anggota |
| PUT | /api/anggota/:id | Update anggota |
| DELETE | /api/anggota/:id | Hapus anggota |
| GET | /api/kartu-anggota | Get semua kartu anggota |

### Loan Service
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /api/peminjaman | Get semua peminjaman |
| POST | /api/peminjaman | Tambah peminjaman |
| PUT | /api/peminjaman/:id | Update status peminjaman |
| GET | /api/pengembalian | Get semua pengembalian |
| POST | /api/pengembalian | Tambah pengembalian + hitung denda |
| GET | /api/denda | Get semua denda |
| PUT | /api/denda/:id | Update status denda |

## Demo Video
https://youtu.be/-ROdmqMksnc