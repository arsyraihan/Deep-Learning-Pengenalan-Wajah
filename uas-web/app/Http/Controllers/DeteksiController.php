<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RiwayatDeteksi; 
use Illuminate\Support\Facades\Http; 

class DeteksiController extends Controller
{
    public function analisisWajah(Request $request)
    {
        // 1. Pastikan React benar-benar mengirim file
        $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        try {
            $foto = $request->file('foto');

            // 2. Teruskan file fisik tersebut ke Flask API menggunakan 'attach'
            $response = Http::attach(
                'foto', file_get_contents($foto->path()), $foto->getClientOriginalName()
            )->post('http://127.0.0.1:5000/predict');

            // 3. Jika AI Python berhasil membalas (Status 200)
            if ($response->successful()) {
                $hasil = $response->json();

                // 4. Simpan hasilnya ke Supabase
                RiwayatDeteksi::create([
                    'umur' => $hasil['data']['umur'],
                    'gender' => $hasil['data']['gender'],
                    'ras' => $hasil['data']['ras'],
                ]);

                // 5. Kembalikan jawaban ke React untuk ditampilkan
                return response()->json($hasil);
            }

            // Jika Python error
            return response()->json([
                'status' => 'error', 
                'message' => 'AI Python gagal merespons gambar ini.'
            ], 500);

        } catch (\Exception $e) { 
            return response()->json([
                'status' => 'error', 
                'message' => 'Gagal terhubung ke server Flask: ' . $e->getMessage()
            ], 500);
        }
    }
}