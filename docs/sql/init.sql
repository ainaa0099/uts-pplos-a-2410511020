-- =============================================
-- database schema sistem perpustakaan digital
-- =============================================


-- auth service
CREATE database if not exists db_auth_service;
use db_auth_service;

CREATE TABLE users (
    id int primary key auto_increment,
    nama varchar(100) not null,
    email varchar(100) not null unique,
    password varchar(255),
    foto_profil varchar(255),
    oauth_provider varchar(50),
    oauth_id varchar(255),
    role enum('admin', 'anggota') default 'anggota',
    created_at timestamp default current_timestamp
);

CREATE TABLE refresh_tokens (
    id int primary key auto_increment,
    user_id int not null,
    token text not null,
    expired_at timestamp not null,
    created_at timestamp default current_timestamp,
    foreign key (user_id) references users(id)
);

CREATE TABLE token_blacklist (
    id int primary key auto_increment,
    token text not null,
    created_at timestamp default current_timestamp
);


-- book service
CREATE database if not exists db_book_service;
use db_book_service;

CREATE TABLE kategori_buku (
    id int primary key auto_increment,
    nama_kategori varchar(100) not null,
    deskripsi text,
    created_at timestamp default current_timestamp
);

CREATE TABLE penulis (
    id int primary key auto_increment,
    nama varchar(100) not null,
    biografi text,
    created_at timestamp default current_timestamp
);

CREATE TABLE rak (
    id int primary key auto_increment,
    kode_rak varchar(20) not null,
    lokasi varchar(100),
    created_at timestamp default current_timestamp
);

CREATE TABLE buku (
    id int primary key auto_increment,
    judul varchar(200) not null,
    isbn varchar(50) unique,
    id_penulis int not null,
    id_kategori int not null,
    id_rak int not null,
    tahun_terbit year,
    stok int not null default 0,
    deskripsi text,
    cover_url varchar(255),
    created_at timestamp default current_timestamp,
    foreign key (id_penulis) references penulis(id),
    foreign key (id_kategori) references kategori_buku(id),
    foreign key (id_rak) references rak(id)
);


-- member service
CREATE database if not exists db_member_service;
use db_member_service;

CREATE TABLE anggota (
    id int primary key auto_increment,
    user_id int not null,
    nama varchar(100) not null,
    email varchar(100) not null unique,
    no_hp varchar(20),
    alamat text,
    created_at timestamp default current_timestamp
);

CREATE TABLE kartu_anggota (
    id int primary key auto_increment,
    id_anggota int not null,
    nomor_kartu varchar(50) not null unique,
    tanggal_berlaku date not null,
    status enum('aktif', 'nonaktif') default 'aktif',
    created_at timestamp default current_timestamp,
    foreign key (id_anggota) references anggota(id)
);


-- loan service
CREATE database if not exists db_loan_service;
use db_loan_service;

CREATE TABLE peminjaman (
    id int primary key auto_increment,
    id_anggota int not null,
    id_buku int not null,
    tanggal_pinjam date not null,
    tanggal_kembali_rencana date not null,
    tanggal_kembali_aktual date,
    status enum('dipinjam', 'dikembalikan', 'terlambat') default 'dipinjam',
    created_at timestamp default current_timestamp
);

CREATE TABLE pengembalian (
    id int primary key auto_increment,
    id_peminjaman int not null,
    tanggal_kembali date not null,
    kondisi_buku enum('baik', 'rusak_ringan', 'rusak_berat') default 'baik',
    catatan text,
    created_at timestamp default current_timestamp,
    foreign key (id_peminjaman) references peminjaman(id)
);

CREATE TABLE denda (
    id int primary key auto_increment,
    id_peminjaman int not null,
    jumlah_hari_telat int not null,
    total_denda decimal(10,2) not null,
    status enum('belum_bayar', 'sudah_bayar') default 'belum_bayar',
    created_at timestamp default current_timestamp,
    foreign key (id_peminjaman) references peminjaman(id)
);


-- =============================================
-- data dummy
-- =============================================


-- auth service
use db_auth_service;

INSERT INTO users (nama, email, password, role) values
('Admin Perpustakaan', 'admin@perpustakaan.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Aina Annisa', 'aina@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'anggota'),
('Budi Santoso', 'budi@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'anggota');


-- book service
use db_book_service;

INSERT INTO kategori_buku (nama_kategori, deskripsi) values
('Novel', 'Buku fiksi berupa novel'),
('Ilmu Pengetahuan', 'Buku ilmu pengetahuan umum'),
('Teknologi', 'Buku seputar teknologi dan komputer'),
('Sejarah', 'Buku sejarah Indonesia dan dunia'),
('Biografi', 'Buku biografi tokoh terkenal');

INSERT INTO penulis (nama, biografi) values
('Andrea Hirata', 'Penulis novel Laskar Pelangi asal Belitung'),
('Pramoedya Ananta Toer', 'Sastrawan besar Indonesia'),
('Habibie', 'Presiden RI ke-3 dan ilmuwan penerbangan'),
('Raditya Dika', 'Penulis dan komedian Indonesia'),
('Tere Liye', 'Penulis novel populer Indonesia');

INSERT INTO rak (kode_rak, lokasi) values
('A1', 'Lantai 1 sebelah kiri'),
('A2', 'Lantai 1 sebelah kanan'),
('B1', 'Lantai 2 sebelah kiri'),
('B2', 'Lantai 2 sebelah kanan'),
('C1', 'Lantai 3 sebelah kiri');

INSERT INTO buku (judul, isbn, id_penulis, id_kategori, id_rak, tahun_terbit, stok, deskripsi) values
('Laskar Pelangi', '978-979-1477-78-5', 1, 1, 1, 2005, 10, 'Novel karya Andrea Hirata'),
('Sang Pemimpi', '978-979-1477-79-2', 1, 1, 1, 2006, 8, 'Sekuel Laskar Pelangi'),
('Bumi Manusia', '978-979-407-539-5', 2, 1, 2, 1980, 5, 'Novel karya Pramoedya Ananta Toer'),
('Habibie dan Ainun', '978-979-22-7606-5', 3, 5, 3, 2010, 7, 'Biografi BJ Habibie'),
('Kambing Jantan', '978-979-22-2765-5', 4, 1, 2, 2005, 12, 'Novel komedi Raditya Dika'),
('Bumi', '978-602-03-1295-1', 5, 1, 1, 2014, 9, 'Novel fantasi karya Tere Liye'),
('Pengantar Teknologi Informasi', '978-979-29-1234-5', 3, 3, 4, 2015, 6, 'Buku teknologi informasi'),
('Sejarah Indonesia Modern', '978-979-29-5678-9', 2, 4, 5, 2000, 4, 'Sejarah Indonesia');


-- member service
use db_member_service;

INSERT INTO anggota (user_id, nama, email, no_hp, alamat) values
(2, 'Aina Annisa', 'aina@test.com', '081234567890', 'Jakarta Selatan'),
(3, 'Budi Santoso', 'budi@test.com', '082345678901', 'Jakarta Utara');

INSERT INTO kartu_anggota (id_anggota, nomor_kartu, tanggal_berlaku, status) values
(1, 'KA-001', '2027-12-31', 'aktif'),
(2, 'KA-002', '2027-12-31', 'aktif');


-- loan service
use db_loan_service;

INSERT INTO peminjaman (id_anggota, id_buku, tanggal_pinjam, tanggal_kembali_rencana, status) values
(1, 1, '2026-04-01', '2026-04-08', 'dikembalikan'),
(1, 2, '2026-04-10', '2026-04-17', 'dipinjam'),
(2, 3, '2026-04-05', '2026-04-12', 'terlambat'),
(2, 4, '2026-04-20', '2026-04-27', 'dipinjam');

INSERT INTO pengembalian (id_peminjaman, tanggal_kembali, kondisi_buku, catatan) values
(1, '2026-04-08', 'baik', 'buku dikembalikan tepat waktu'),
(3, '2026-04-20', 'rusak_ringan', 'buku terlambat dikembalikan');

INSERT INTO denda (id_peminjaman, jumlah_hari_telat, total_denda, status) values
(3, 8, 8000, 'belum_bayar');