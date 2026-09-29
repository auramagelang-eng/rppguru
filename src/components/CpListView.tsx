import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  FileCheck2,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Plus
} from 'lucide-react';
import { ProtaData, CPItem, RPPDocument } from '../types/rpp';

interface CpListViewProps {
  currentProta: ProtaData;
  rppList: RPPDocument[];
  onSelectCp: (cp: CPItem) => void;
  onPreviewRpp: (rppId: string) => void;
  onDownloadSinglePdf: (rpp: RPPDocument) => void;
  onDownloadAllRpps: () => void;
  onDownloadCombinedPdf: () => void;
  onNavigateToImport: () => void;
  onResetToProta2026?: () => void;
}

export const CpListView: React.FC<CpListViewProps> = ({
  currentProta,
  rppList,
  onSelectCp,
  onPreviewRpp,
  onDownloadSinglePdf,
  onDownloadAllRpps,
  onDownloadCombinedPdf,
  onNavigateToImport,
  onResetToProta2026
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');

  const filteredItems = currentProta.items.filter((item) => {
    const matchSearch =
      item.elemen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cp.toLowerCase().includes(searchTerm.toLowerCase());

    const rpp = rppList.find((r) => r.cpId === item.id);
    const effectiveStatus = rpp ? rpp.status : item.status || 'belum';

    const matchStatus = statusFilter === 'all' || effectiveStatus === statusFilter;
    const matchSemester = semesterFilter === 'all' || item.semester === semesterFilter;

    return matchSearch && matchStatus && matchSemester;
  });

  const totalFinished = rppList.filter((r) => r.status === 'selesai' || r.status === 'pdf').length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
              PROTA Aktif: {currentProta.mataPelajaran}
            </span>
            <span className="text-xs text-slate-500 font-medium">({currentProta.kelas})</span>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              T.A. {currentProta.tahunAjaran || '2026/2027'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Daftar Capaian Pembelajaran (CP) &amp; Perangkat RPP
          </h2>
          <p className="text-xs text-slate-500">
            Setiap baris CP dapat menghasilkan <strong>1 dokumen PDF RPP tersendiri</strong> sesuai template resmi SMK Negeri 2 Magelang.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onResetToProta2026 && (
            <button
              onClick={onResetToProta2026}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
              title="Perbarui data dan muat master PROTA 2026/2027 beserta seluruh RPP"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Sinkronkan PROTA 2026/2027
            </button>
          )}
          <button
            onClick={onDownloadAllRpps}
            disabled={totalFinished === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="Download seluruh RPP yang sudah selesai secara satu per satu"
          >
            <Download className="w-4 h-4" />
            Download Semua ({totalFinished})
          </button>
          <button
            onClick={onDownloadCombinedPdf}
            disabled={totalFinished === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Gabungkan seluruh RPP yang telah dibuat menjadi 1 file PDF"
          >
            <FileCheck2 className="w-4 h-4" />
            Gabung Jadi 1 PDF
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari elemen, materi, atau kata kunci CP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="selesai">Selesai</option>
              <option value="draft">Draft</option>
              <option value="belum">Belum Dibuat</option>
            </select>
          </div>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="all">Semua Semester</option>
            <option value="Ganjil">Semester Ganjil</option>
            <option value="Genap">Semester Genap</option>
          </select>
        </div>
      </div>

      {/* Main CP Table (Requirement #17) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3 w-40">Elemen</th>
                <th className="p-3 min-w-[260px]">Capaian Pembelajaran (CP)</th>
                <th className="p-3 min-w-[200px]">Tujuan Pembelajaran (TP)</th>
                <th className="p-3 w-44">Materi</th>
                <th className="p-3 w-16 text-center">JP</th>
                <th className="p-3 w-20 text-center">Semester</th>
                <th className="p-3 w-28 text-center">Status</th>
                <th className="p-3 w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    Tidak ditemukan Capaian Pembelajaran yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const rpp = rppList.find((r) => r.cpId === item.id);
                  const effectiveStatus = rpp ? rpp.status : item.status || 'belum';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-500">{item.no || idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-900">{item.elemen}</td>
                      <td className="p-3 text-slate-700 leading-relaxed">
                        <div className="line-clamp-3">{item.cp}</div>
                      </td>
                      <td className="p-3 text-slate-600 leading-relaxed">
                        <div className="line-clamp-3 italic">{item.tp || '-'}</div>
                      </td>
                      <td className="p-3 font-medium text-slate-800">{item.materi}</td>
                      <td className="p-3 text-center font-bold text-blue-700">{item.alokasiWaktu || `${item.jp} JP`}</td>
                      <td className="p-3 text-center text-slate-600">{item.semester}</td>

                      {/* Status Column */}
                      <td className="p-3 text-center">
                        {effectiveStatus === 'selesai' || effectiveStatus === 'pdf' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Selesai
                          </span>
                        ) : effectiveStatus === 'draft' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" />
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            <AlertCircle className="w-3 h-3" />
                            Belum
                          </span>
                        )}
                      </td>

                      {/* Action Column */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectCp(item)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer ${
                              rpp
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-blue-700 hover:bg-blue-800 text-white'
                            }`}
                            title="Generate atau Buka Editor RPP untuk CP ini"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {rpp ? 'Edit RPP' : 'BUAT RPP'}
                          </button>

                          {rpp && (
                            <>
                              <button
                                onClick={() => onPreviewRpp(rpp.id)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                title="Preview Dokumen RPP"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDownloadSinglePdf(rpp)}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                                title="Download PDF RPP CP ini"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
