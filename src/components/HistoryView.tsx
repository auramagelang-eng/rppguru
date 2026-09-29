import React, { useState } from 'react';
import {
  History,
  FileText,
  Download,
  Eye,
  Trash2,
  Copy,
  Search,
  CheckCircle2,
  Clock,
  FileCheck2,
  Layers,
  ArrowRight,
  Camera
} from 'lucide-react';
import { RPPDocument } from '../types/rpp';
import { getRppFileName, downloadAllPageScreenshots } from '../utils/pdfExport';

interface HistoryViewProps {
  rppList: RPPDocument[];
  onOpenInEditor: (rppId: string) => void;
  onPreviewRpp: (rppId: string) => void;
  onDownloadPdf: (doc: RPPDocument) => void;
  onDownloadWord: (doc: RPPDocument) => void;
  onDuplicateRpp: (rppId: string) => void;
  onDeleteRpp: (rppId: string) => void;
  onDownloadAllRpps: () => void;
  onDownloadCombinedPdf: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  rppList,
  onOpenInEditor,
  onPreviewRpp,
  onDownloadPdf,
  onDownloadWord,
  onDuplicateRpp,
  onDeleteRpp,
  onDownloadAllRpps,
  onDownloadCombinedPdf
}) => {
  const [search, setSearch] = useState('');

  const filtered = rppList.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.guru.mataPelajaran.toLowerCase().includes(q) ||
      d.guru.kelas.toLowerCase().includes(q) ||
      d.guru.namaGuru.toLowerCase().includes(q) ||
      (d.karakteristik.strukturMateri || '').toLowerCase().includes(q) ||
      d.capaianPembelajaran.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-700" />
            Riwayat Dokumen &amp; Arsip RPP
          </h2>
          <p className="text-xs text-slate-500">
            Daftar seluruh dokumen RPP yang telah dibuat, tersimpan otomatis dalam database lokal aplikasi.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onDownloadAllRpps}
            disabled={rppList.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Semua ({rppList.length})
          </button>
          <button
            onClick={onDownloadCombinedPdf}
            disabled={rppList.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            Gabungkan Seluruh Dokumen Menjadi 1 PDF
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 text-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari mata pelajaran, kelas, materi, atau nama guru..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium shrink-0">
          Total: <strong>{filtered.length}</strong> Dokumen
        </span>
      </div>

      {/* Document Grid / Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Belum ada riwayat dokumen RPP.</p>
          <p className="text-xs text-slate-400">
            Generate RPP baru melalui menu <strong>Daftar CP</strong> atau <strong>Generator RPP</strong>.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3 min-w-[200px]">Mata Pelajaran &amp; Kelas</th>
                  <th className="p-3 min-w-[240px]">Materi / CP</th>
                  <th className="p-3 w-32">Alokasi &amp; Model</th>
                  <th className="p-3 w-28 text-center">Tanggal Dibuat</th>
                  <th className="p-3 w-20 text-center">Versi</th>
                  <th className="p-3 w-24 text-center">Status</th>
                  <th className="p-3 w-48 text-center">Aksi Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-sm">{item.guru.mataPelajaran}</div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {item.guru.kelas} &bull; {item.guru.namaGuru}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800 line-clamp-1">
                        {item.karakteristik.strukturMateri || 'Elemen Pembelajaran'}
                      </div>
                      <div className="text-[11px] text-slate-600 line-clamp-2 italic">
                        {item.capaianPembelajaran}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-blue-800">
                        {item.pengaturan.jumlahJp} JP ({item.pengaturan.jumlahJp * item.pengaturan.durasiJp} Menit)
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                        {item.pengaturan.modelPembelajaran}
                      </div>
                    </td>
                    <td className="p-3 text-center text-slate-600">
                      {new Date(item.updatedAt || item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                        v{item.version || 1}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {item.status === 'selesai' || item.status === 'pdf' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <button
                          onClick={() => onOpenInEditor(item.id)}
                          className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                          title="Buka Dokumen di Editor"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onPreviewRpp(item.id)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                          title="Preview Dokumen"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDownloadPdf(item)}
                          className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition-colors cursor-pointer"
                          title="Unduh PDF Resmi"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => downloadAllPageScreenshots(item, 'modern')}
                          className="p-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded transition-colors cursor-pointer"
                          title="Unduh Screenshot Dokumen Penuh (4 Halaman PNG HD)"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicateRpp(item.id)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                          title="Duplikasi Dokumen"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Yakin ingin menghapus dokumen RPP ini?')) {
                              onDeleteRpp(item.id);
                            }
                          }}
                          className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors cursor-pointer"
                          title="Hapus Dokumen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
