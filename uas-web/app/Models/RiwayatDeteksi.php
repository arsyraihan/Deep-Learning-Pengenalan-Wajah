<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatDeteksi extends Model
{
    use HasFactory;

    // Menghubungkan ke nama tabel di database Supabase
    protected $table = 'riwayat_deteksis';

    // Mengizinkan semua kolom untuk diisi secara otomatis (Mass Assignment)
    protected $guarded = []; 
}