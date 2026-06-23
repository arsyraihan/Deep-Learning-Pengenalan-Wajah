import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { UploadCloud, User, Globe, Calendar, ScanFace, Loader2, Image as ImageIcon } from 'lucide-react';

export default function Welcome() {
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [hasil, setHasil] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setPreview(URL.createObjectURL(file));
            setHasil(null);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!foto) return alert("Pilih foto terlebih dahulu!");

        setLoading(true);
        const formData = new FormData();
        formData.append('foto', foto);

        try {
            const response = await axios.post('/api/deteksi', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.status === 'success') {
                setHasil(response.data.data);
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Terjadi kesalahan pada server AI.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="AI Face Analyzer - UAS" />
            
            {/* Latar Belakang Gradien Modern */}
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100 flex flex-col items-center justify-center p-6 font-sans text-slate-800">
                
                {/* Kartu Utama dengan Efek Glassmorphism */}
                <div className="max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-white/50 overflow-hidden transition-all duration-300">
                    
                    {/* Header Aplikasi */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center relative overflow-hidden">
                        {/* Aksen Dekoratif */}
                        <div className="absolute top-0 left-0 w-full h-full bg-white/5 transform -skew-y-12 scale-150 origin-top-left pointer-events-none"></div>
                        
                        <ScanFace className="w-16 h-16 mx-auto mb-4 text-white/90 drop-shadow-md" strokeWidth={1.5} />
                        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                            AI Face Analyzer
                        </h1>
                        <p className="text-blue-100 mt-2 font-medium">Sistem Deteksi Multi-Atribut Berbasis AI</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleUpload} className="space-y-6">
                            
                            {/* Area Upload (Dropzone Style) */}
                            <label className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 group ${preview ? 'border-blue-300 bg-blue-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400'}`}>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="hidden"
                                />
                                
                                {preview ? (
                                    <div className="relative w-full h-full p-2">
                                        <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl drop-shadow-sm" />
                                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                            <ImageIcon className="w-8 h-8 mb-2" />
                                            <span className="font-semibold text-sm">Ganti Foto</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500 group-hover:text-indigo-500 transition-colors">
                                        <UploadCloud className="w-12 h-12 mb-3" />
                                        <p className="mb-2 text-sm font-semibold">
                                            Klik atau Seret foto ke sini
                                        </p>
                                        <p className="text-xs text-slate-400">PNG, JPG, atau JPEG (Maks. 5MB)</p>
                                    </div>
                                )}
                            </label>

                            {/* Tombol Analisis */}
                            <button 
                                type="submit" 
                                disabled={loading || !foto}
                                className={`relative w-full py-3.5 px-4 rounded-xl text-white font-bold text-lg shadow-lg overflow-hidden transition-all duration-300 focus:ring-4 focus:ring-indigo-300
                                    ${loading || !foto 
                                        ? 'bg-slate-400 shadow-none cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-0.5'
                                    }`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            AI Sedang Bekerja...
                                        </>
                                    ) : (
                                        <>
                                            <ScanFace className="w-5 h-5" />
                                            Mulai Analisis
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Area Hasil Prediksi yang Menawan */}
                        {hasil && (
                            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">
                                    Hasil Identifikasi AI
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Card Ras */}
                                    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3">
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ras / Etnis</span>
                                        <span className="text-lg font-bold text-slate-800 mt-1">{hasil.ras}</span>
                                    </div>

                                    {/* Card Gender */}
                                    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-indigo-50 to-white rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-3">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gender</span>
                                        <span className="text-lg font-bold text-slate-800 mt-1">{hasil.gender}</span>
                                    </div>

                                    {/* Card Umur */}
                                    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-purple-50 to-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full mb-3">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Usia</span>
                                        <span className="text-lg font-bold text-slate-800 mt-1">{hasil.umur} Thn</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer Tipis */}
                <p className="mt-8 text-sm text-slate-400 font-medium">
                    &copy; 2026 Proyek UAS Data Mining
                </p>
            </div>
        </>
    );
}