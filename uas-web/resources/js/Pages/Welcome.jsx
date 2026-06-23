import React, { useState } from 'react';
import { UploadCloud, ScanFace, Activity, User, Globe, Cpu, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function FaceAnalyzer() {
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasil, setHasil] = useState(null);
    const [error, setError] = useState('');

    // Fungsi menangani gambar yang diunggah
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setPreview(URL.createObjectURL(file));
            setHasil(null);
            setError('');
        }
    };

    // Fungsi untuk mengirim ke Laravel menggunakan Axios (Anti CSRF Error)
    const mulaiAnalisis = async () => {
        if (!foto) return;
        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('foto', foto);

        try {
            // Axios otomatis mengurus CSRF token yang dibutuhkan Laravel
            // Jika URL API Anda berbeda, silakan ubah 'http://localhost:8000/api/deteksi' ini
            const response = await axios.post('/api/deteksi', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // Memastikan kredensial/cookies Laravel (termasuk CSRF) ikut terkirim
                withCredentials: true 
            });

            // Menyimpan hasil balasan dari server
            setHasil(response.data.data);
            
        } catch (err) {
            // Menangkap pesan error spesifik jika gagal
            setError(err.response?.data?.message || 'Gagal terhubung ke server AI.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans p-6 flex flex-col items-center">
            {/* Header / Navbar */}
            <header className="w-full max-w-5xl flex justify-between items-center py-6 border-b border-slate-800 mb-8">
                <div className="flex items-center gap-3">
                    <ScanFace className="text-cyan-400 w-10 h-10" />
                    <h1 className="text-2xl font-bold text-white tracking-widest">
                        NEXUS<span className="text-cyan-400">VISION</span> AI
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono text-cyan-500 bg-cyan-900/20 px-4 py-2 rounded-full border border-cyan-800">
                    <Activity className="w-4 h-4 animate-pulse" />
                    SYSTEM ONLINE
                </div>
            </header>

            {/* Main Content Dashboard */}
            <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Kolom Kiri: Input & Kamera */}
                <div className="flex flex-col gap-6">
                    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <UploadCloud className="w-4 h-4" /> Input Citra Wajah
                        </h2>
                        
                        {!preview ? (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-cyan-500 hover:bg-slate-800/50 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-12 h-12 text-slate-500 mb-3" />
                                    <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-cyan-400">Klik untuk unggah</span> atau drag and drop</p>
                                    <p className="text-xs text-slate-500">PNG, JPG, atau JPEG (Max. 5MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        ) : (
                            <div className="relative w-full h-auto rounded-xl overflow-hidden border border-slate-700 group">
                                <img src={preview} alt="Preview" className="w-full h-auto object-cover" />
                                
                                {/* Efek Scanner Keren saat Loading */}
                                {loading && (
                                    <>
                                        <div className="absolute top-0 left-0 w-full h-full bg-cyan-900/30 mix-blend-overlay"></div>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[scan_2s_ease-in-out_infinite]"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black/70 text-cyan-400 px-6 py-3 rounded-full font-mono text-sm flex items-center gap-3 backdrop-blur-sm border border-cyan-500/50">
                                                <Cpu className="w-5 h-5 animate-spin" /> MENGANALISIS...
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                {!loading && (
                                    <button onClick={() => setPreview(null)} className="absolute top-3 right-3 bg-red-500/80 text-white text-xs px-3 py-1 rounded-full hover:bg-red-500 backdrop-blur-sm transition-all">
                                        Ganti Foto
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={mulaiAnalisis}
                        disabled={!preview || loading}
                        className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2
                            ${!preview || loading 
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 hover:shadow-[0_0_20px_#22d3ee]'}`}
                    >
                        {loading ? 'Processing...' : 'Inisialisasi Deteksi'}
                    </button>

                    {error && (
                        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                {/* Kolom Kanan: Hasil Analisis AI */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Hasil Ekstraksi AI
                    </h2>

                    {hasil ? (
                        <div className="grid grid-cols-1 gap-4 h-full">
                            {/* Card Ras */}
                            <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl flex items-center gap-5 hover:border-cyan-500/50 transition-colors">
                                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                                    <Globe className="w-8 h-8 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Klasifikasi Ras</p>
                                    <p className="text-2xl font-bold text-white">{hasil.ras}</p>
                                </div>
                            </div>

                            {/* Card Gender */}
                            <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl flex items-center gap-5 hover:border-pink-500/50 transition-colors">
                                <div className="bg-pink-500/10 p-4 rounded-lg border border-pink-500/20">
                                    <User className="w-8 h-8 text-pink-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Identifikasi Gender</p>
                                    <p className="text-2xl font-bold text-white">{hasil.gender}</p>
                                </div>
                            </div>

                            {/* Card Umur */}
                            <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl flex items-center gap-5 hover:border-green-500/50 transition-colors">
                                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                                    <Activity className="w-8 h-8 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Estimasi Usia</p>
                                    <p className="text-2xl font-bold text-white">{hasil.umur} <span className="text-lg font-normal text-slate-400">Tahun</span></p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl min-h-[300px]">
                            <Cpu className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-sm font-mono text-center px-8">MENUNGGU DATA CITRA...<br/>Sistem AI dalam posisi standby.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}