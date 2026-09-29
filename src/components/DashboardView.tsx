import React from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Upload,
  ArrowRight,
  Download,
  BookOpen,
  Layers,
  GraduationCap,
  FileCheck2,
  CheckCheck
} from 'lucide-react';
import { ProtaData, RPPDocument, CPItem } from '../types/rpp';
import { ActiveTab } from './Header';

interface DashboardViewProps {
  protaList: ProtaData[];
  currentProta: ProtaData;
  rppList: RPPDocument[];
  onSelectCpForGenerator: (cp: CPItem) => void;
  onNavigate: (tab: ActiveTab) => void;
  onDownloadAllRpps: () => void;
  onDownloadCombinedPdf: () => void;
  onLoadSampleProta: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  protaList,
  currentProta,
  rppList,
  onSelectCpForGenerator,
  onNavigate,
  onDownloadAllRpps,
  onDownloadCombinedPdf,
  onLoadSampleProta
}) => {
  const totalCp = currentProta.items.length;
  const selesaiCp = currentProta.items.filter((c) => c.status === 'selesai' || c.status === 'pdf').length;
  const draftCp = currentProta.items.filter((c) => c.status === 'draft').length;
  const belumCp = currentProta.items.filter((c) => c.status === 'belum' || !c.status).length;
  const progressPercent = totalCp > 0 ? Math.round((selesaiCp / totalCp) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/70 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-700/60">
            <GraduationCap className="w-4 h-4" />
            Sistem Perencanaan Pembelajaran Terintegrasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            RPP Auto Generator – SMK Negeri 2 Magelang
          </h2>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mb-6">
            Menghasilkan dokumen <strong>Perencanaan Pembelajaran Mendalam (PPM) / RPP</strong> otomatis per CP secara
            presisi mengacu pada template resmi <em>format perangkat.docx</em>, lengkap dengan 8 Dimensi Profil Lulusan,
            kegiatan berbasis fase kontekstual, asesmen terpadu, dan pembagian alokasi waktu presisi menit.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('generator')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-sm rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Mulai Generate RPP
            </button>
            <button
              onClick={() => onNavigate('import-prota')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Import File PROTA Baru
            </button>
            {currentProta.items.length === 0 && (
              <button
                onClick={onLoadSampleProta}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 font-medium text-sm rounded-xl border border-sky-400/30 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                Muat Contoh PROTA PPLG
              </button>
            )}
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stats Dashboard Grid (Requirement #30) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total PROTA</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{protaList.length}</div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">{currentProta.mataPelajaran}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total CP</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalCp}</div>
          <div className="text-[11px] text-slate-500 mt-1">Capaian Pembelajaran</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-medium mb-1">
            <span>RPP Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800">{selesaiCp}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Siap Ekspor PDF</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/40 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-medium mb-1">
            <span>RPP Draft</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800">{draftCp}</div>
          <div className="text-[11px] text-amber-600 mt-1">Sedang Diedit</div>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Belum Dibuat</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-700">{belumCp}</div>
          <div className="text-[11px] text-slate-500 mt-1">Menunggu Generate</div>
        </div>
      </div>

      {/* Progress Bar & Batch Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Progress Penyelesaian RPP ({currentProta.title})</span>
            <span className="text-blue-700">{progressPercent}% Selesai</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={onDownloadAllRpps}
            disabled={selesaiCp === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Semua RPP
          </button>
          <button
            onClick={onDownloadCombinedPdf}
            disabled={selesaiCp === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            Gabungkan Jadi 1 Dokumen PDF
          </button>
        </div>
      </div>

      {/* Workflow Stepper Diagram (Requirement #1) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          Alur Kerja Pembuatan RPP Otomatis SMK Negeri 2 Magelang
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { step: '1', title: 'Data Identitas', desc: 'Guru, Sekolah, Model Pembelajaran', tab: 'identitas' as ActiveTab },
            { step: '2', title: 'Import PROTA', desc: 'Unggah file Excel/CSV/DOCX', tab: 'import-prota' as ActiveTab },
            { step: '3', title: 'Pilih CP', desc: '1 Dokumen PDF per 1 CP', tab: 'daftar-cp' as ActiveTab },
            { step: '4', title: 'Generate AI', desc: 'Karakteristik, Waktu, Fase PjBL', tab: 'generator' as ActiveTab },
            { step: '5', title: '13 Validasi', desc: 'Pemeriksaan checklist kelengkapan', tab: 'preview' as ActiveTab },
            { step: '6', title: 'Ekspor PDF', desc: 'Unduh per CP atau gabungan', tab: 'riwayat' as ActiveTab },
          ].map((item, idx) => (
            <div
              key={item.step}
              onClick={() => onNavigate(item.tab)}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                  {item.step}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-0.5">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CP Quick List with Direct [BUAT RPP] Button */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Daftar Capaian Pembelajaran ({currentProta.mataPelajaran})
            </h3>
            <p className="text-xs text-slate-500">
              Setiap CP menghasilkan 1 dokumen PDF tersendiri sesuai standar resmi.
            </p>
          </div>
          <button
            onClick={() => onNavigate('daftar-cp')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            Lihat Tabel Lengkap &amp; Mapping
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {currentProta.items.map((cp) => {
            const hasRpp = rppList.some((r) => r.cpId === cp.id);
            return (
              <div
                key={cp.id}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                      CP #{cp.no}
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">{cp.elemen}</span>
                    <span className="text-xs text-slate-500 font-medium">({cp.alokasiWaktu} / {cp.semester})</span>

                    {/* Status badge */}
                    {cp.status === 'selesai' || cp.status === 'pdf' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCheck className="w-3 h-3" />
                        Sudah Selesai
                      </span>
                    ) : cp.status === 'draft' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3" />
                        Draft Tersimpan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Belum Dibuat
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    <strong className="text-slate-800">Materi:</strong> {cp.materi} — <strong className="text-slate-800">CP:</strong> {cp.cp}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectCpForGenerator(cp)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer ${
                      hasRpp
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-blue-700 hover:bg-blue-800 text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {hasRpp ? 'Buka / Edit RPP' : 'BUAT RPP'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
