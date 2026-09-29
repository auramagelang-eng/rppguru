import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  RotateCw,
  Eye,
  Download,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  Camera
} from 'lucide-react';
import {
  RPPDocument,
  CPItem,
  SchoolProfile,
  TeacherProfile,
  LearningSettings,
  GlosariumItem,
  KegiatanFase
} from '../types/rpp';
import { validateRppDocument } from '../utils/storage';
import { downloadAllPageScreenshots } from '../utils/pdfExport';

interface RppEditorViewProps {
  rpp: RPPDocument | null;
  selectedCp: CPItem | null;
  school: SchoolProfile;
  teacher: TeacherProfile;
  settings: LearningSettings;
  onSaveRpp: (doc: RPPDocument, markStatus?: 'draft' | 'selesai') => void;
  onPreviewRpp: (rppId: string) => void;
  onExportPdf: (doc: RPPDocument) => void;
  onExportWord: (doc: RPPDocument) => void;
  onDuplicateRpp: (rppId: string) => void;
  onGenerateFullAi: (cp: CPItem) => Promise<RPPDocument | null>;
  onRegenerateSection: (section: string, rpp: RPPDocument) => Promise<any>;
}

export const RppEditorView: React.FC<RppEditorViewProps> = ({
  rpp: initialRpp,
  selectedCp,
  school,
  teacher,
  settings,
  onSaveRpp,
  onPreviewRpp,
  onExportPdf,
  onExportWord,
  onDuplicateRpp,
  onGenerateFullAi,
  onRegenerateSection
}) => {
  const [doc, setDoc] = useState<RPPDocument | null>(initialRpp);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<Record<string, boolean>>({
    profilLulusan: true,
    karakteristik: true,
    komponenInti: true,
    kemitraan: false,
    digital: false,
    pengalaman: true,
    asesmen: true,
    remedial: false,
    glosarium: false,
    pustaka: false
  });

  useEffect(() => {
    setDoc(initialRpp);
  }, [initialRpp]);

  // If no RPP exists yet for the selected CP, provide an immediate "Generate" call-to-action
  if (!doc) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-2xl mx-auto my-8 space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shadow-inner">
          <Sparkles className="w-8 h-8 animate-pulse text-amber-500" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            Generator Perencanaan Pembelajaran Mendalam (RPP)
          </h2>
          <p className="text-xs text-slate-500">
            SMK NEGERI 2 MAGELANG &mdash; Kurikulum Merdeka Terintegrasi
          </p>
        </div>

        {selectedCp ? (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-800">CP #{selectedCp.no}:</span>
              <span className="font-semibold text-slate-800">{selectedCp.elemen}</span>
            </div>
            <div className="text-slate-700 leading-relaxed italic">{selectedCp.cp}</div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
              <span>Materi: <strong>{selectedCp.materi}</strong></span>
              <span>Alokasi: <strong>{selectedCp.alokasiWaktu || '4 JP'} ({teacher.kelas})</strong></span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-xs">
            Belum ada CP yang dipilih. Silakan pilih salah satu CP di menu <strong>Daftar CP</strong> atau klik tombol generate di bawah untuk memulai.
          </div>
        )}

        <button
          onClick={async () => {
            if (!selectedCp) return;
            setIsGenerating(true);
            try {
              const res = await onGenerateFullAi(selectedCp);
              if (res) setDoc(res);
            } finally {
              setIsGenerating(false);
            }
          }}
          disabled={!selectedCp || isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          {isGenerating ? 'AI Sedang Menyusun RPP Lengkap...' : 'Generate RPP Sekarang dengan AI'}
        </button>
      </div>
    );
  }

  const toggleAccordion = (key: string) => {
    setActiveAccordion((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleManualSave = (status: 'draft' | 'selesai' = 'draft') => {
    if (!doc) return;
    const updated = {
      ...doc,
      status,
      updatedAt: new Date().toISOString()
    };
    setDoc(updated);
    onSaveRpp(updated, status);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Section Regenerator Handler
  const handleRegenerate = async (sectionKey: string) => {
    if (!doc) return;
    setGeneratingSection(sectionKey);
    try {
      const data = await onRegenerateSection(sectionKey, doc);
      if (data) {
        setDoc((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            [sectionKey]: data
          };
        });
      }
    } finally {
      setGeneratingSection(null);
    }
  };

  // Time Calculation helpers
  const targetMenit = (doc.pengaturan.jumlahJp || 4) * (doc.pengaturan.durasiJp || 45);
  const pendahuluanMin = doc.pengalamanPembelajaran.pendahuluan.waktuMenit || parseInt(doc.pengalamanPembelajaran.pendahuluan.waktu || '0', 10) || 0;
  const penutupMin = doc.pengalamanPembelajaran.penutup.waktuMenit || parseInt(doc.pengalamanPembelajaran.penutup.waktu || '0', 10) || 0;
  const intiMin = doc.pengalamanPembelajaran.kegiatanInti.reduce((acc, f) => {
    return acc + (f.waktuMenit || parseInt(f.waktu || '0', 10) || 0);
  }, 0);
  const totalRincianMenit = pendahuluanMin + intiMin + penutupMin;
  const isTimeBalanced = Math.abs(totalRincianMenit - targetMenit) <= 2;

  // Validation
  const validation = validateRppDocument(doc);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Floating Action Bar */}
      <div className="sticky top-[95px] z-30 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
            PPM
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm truncate">
                {doc.guru.mataPelajaran} &mdash; {doc.guru.kelas}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                v{doc.version || 1}
              </span>
              {doc.status === 'selesai' ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  Selesai
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                  Draft
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {doc.karakteristik.strukturMateri || 'Elemen Pembelajaran'}
            </p>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time & Validation Status Badges */}
          <div
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border ${
              isTimeBalanced
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
            title="Total Alokasi Waktu Aktivitas vs Alokasi JP"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{totalRincianMenit}/{targetMenit} Mnt</span>
          </div>

          <button
            type="button"
            onClick={() => handleManualSave('draft')}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Draft
          </button>

          <button
            type="button"
            onClick={() => handleManualSave('selesai')}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tandai Selesai
          </button>

          <button
            type="button"
            onClick={() => onPreviewRpp(doc.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Dokumen
          </button>

          <button
            type="button"
            onClick={() => onExportPdf(doc)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh PDF
          </button>

          <button
            type="button"
            onClick={async () => {
              try {
                await downloadAllPageScreenshots(doc, 'modern');
              } catch (e) {
                console.error(e);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Unduh seluruh 4 halaman dokumen sebagai gambar PNG resolusi tinggi (300 DPI, format anti-geser)"
          >
            <Camera className="w-3.5 h-3.5" />
            Screenshot HD
          </button>

          <button
            type="button"
            onClick={() => onDuplicateRpp(doc.id)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Duplikasi RPP ini"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md text-center flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> Perubahan Dokumen RPP Berhasil Disimpan!
        </div>
      )}

      {/* Validation Checklist Banner (Requirement #20) */}
      <div className={`p-4 rounded-xl border text-xs ${
        validation.isValid
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          : 'bg-amber-50/80 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center justify-between font-bold mb-2">
          <span className="flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            Hasil Uji Kelayakan &amp; Validasi RPP (13 Pemeriksaan Resmi):
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-white border font-bold">
            {validation.passedChecks} / {validation.totalChecks} Lolos
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
          {validation.checks.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5 text-[11px]">
              {c.isValid ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              <span className={c.isValid ? 'text-slate-700' : 'font-semibold text-amber-900'}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN I: PROFIL LULUSAN (8 DIMENSI)                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleAccordion('profilLulusan')}
          className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">I</span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">DIMENSI PROFIL LULUSAN (8 Dimensi)</h3>
              <p className="text-[11px] text-slate-500">
                Dimensi yang tidak termasuk otomatis dihapus dari tabel RPP resmi.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRegenerate('dimensiProfilLulusan');
              }}
              disabled={generatingSection === 'dimensiProfilLulusan'}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:bg-cyan-50 text-cyan-800 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className={`w-3 h-3 ${generatingSection === 'dimensiProfilLulusan' ? 'animate-spin' : ''}`} />
              Generate Ulang Profil
            </button>
            {activeAccordion.profilLulusan ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
        </div>

        {activeAccordion.profilLulusan && (
          <div className="p-5 space-y-4 text-xs">
            {/* Rule Callout Banner */}
            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0" />
                <span>
                  <strong>Aturan Format Resmi:</strong> Dimensi yang tidak dicentang otomatis dihapus dari tabel dokumen RPP dan tidak ditampilkan.
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setDoc({
                      ...doc,
                      dimensiProfilLulusan: {
                        keimanan: true,
                        kewarganegaraan: false,
                        penalaranKritis: true,
                        kreatif: true,
                        kolaborasi: true,
                        kemandirian: true,
                        kesehatan: false,
                        komunikasi: true,
                        catatanBukti: doc.dimensiProfilLulusan.catatanBukti
                      }
                    });
                  }}
                  className="px-2 py-1 bg-white hover:bg-cyan-100 text-cyan-800 font-semibold rounded border border-cyan-300 text-[10px] cursor-pointer"
                >
                  Standar Vokasi (5)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDoc({
                      ...doc,
                      dimensiProfilLulusan: {
                        keimanan: true,
                        kewarganegaraan: true,
                        penalaranKritis: true,
                        kreatif: false,
                        kolaborasi: true,
                        kemandirian: false,
                        kesehatan: false,
                        komunikasi: true,
                        catatanBukti: doc.dimensiProfilLulusan.catatanBukti
                      }
                    });
                  }}
                  className="px-2 py-1 bg-white hover:bg-cyan-100 text-cyan-800 font-semibold rounded border border-cyan-300 text-[10px] cursor-pointer"
                >
                  Sosial & Karakter (4)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDoc({
                      ...doc,
                      dimensiProfilLulusan: {
                        keimanan: true,
                        kewarganegaraan: true,
                        penalaranKritis: true,
                        kreatif: true,
                        kolaborasi: true,
                        kemandirian: true,
                        kesehatan: true,
                        komunikasi: true,
                        catatanBukti: doc.dimensiProfilLulusan.catatanBukti
                      }
                    });
                  }}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded border border-slate-300 text-[10px] cursor-pointer"
                >
                  Pilih Semua (8)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDoc({
                      ...doc,
                      dimensiProfilLulusan: {
                        keimanan: false,
                        kewarganegaraan: false,
                        penalaranKritis: false,
                        kreatif: false,
                        kolaborasi: false,
                        kemandirian: false,
                        kesehatan: false,
                        komunikasi: false,
                        catatanBukti: doc.dimensiProfilLulusan.catatanBukti
                      }
                    });
                  }}
                  className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-700 font-semibold rounded border border-rose-300 text-[10px] cursor-pointer"
                >
                  Kosongkan
                </button>
              </div>
            </div>

            {/* Checkbox Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { key: 'keimanan', label: '1. Keimanan & Ketakwaan Tuhan YME' },
                { key: 'kewarganegaraan', label: '2. Kewarganegaraan' },
                { key: 'penalaranKritis', label: '3. Penalaran Kritis' },
                { key: 'kreatif', label: '4. Kreatif' },
                { key: 'kolaborasi', label: '5. Kolaborasi' },
                { key: 'kemandirian', label: '6. Kemandirian' },
                { key: 'kesehatan', label: '7. Kesehatan' },
                { key: 'komunikasi', label: '8. Komunikasi' }
              ].map((dim) => {
                const isChecked = !!(doc.dimensiProfilLulusan as any)[dim.key];
                return (
                  <label
                    key={dim.key}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-cyan-50/90 border-cyan-500 font-bold text-cyan-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setDoc({
                          ...doc,
                          dimensiProfilLulusan: {
                            ...doc.dimensiProfilLulusan,
                            [dim.key]: e.target.checked
                          }
                        });
                      }}
                      className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                    />
                    <span className="leading-snug">{dim.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Live Visual Table Preview Matching Screenshot */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs">
                  Hasil Tampilan Tabel di Dokumen RPP (Sesuai Pilihan Anda):
                </span>
                <span className="text-[10px] text-cyan-800 font-semibold bg-cyan-100 px-2 py-0.5 rounded">
                  {Object.entries(doc.dimensiProfilLulusan).filter(([k, v]) => k !== 'catatanBukti' && !!v).length} Dimensi Ditampilkan
                </span>
              </div>

              <div className="border border-slate-400 rounded overflow-hidden max-w-lg bg-white shadow-2xs">
                <div className="bg-[#00b0f0] text-black font-bold text-center py-1.5 text-xs border-b border-slate-400 uppercase tracking-wide">
                  DIMENSI PROFIL LULUSAN
                </div>
                <div className="divide-y divide-slate-300 text-xs">
                  {[
                    { key: 'keimanan', label: 'Keimanan dan Ketakwaan terhadap Tuhan YME' },
                    { key: 'kewarganegaraan', label: 'Kewarganegaraan' },
                    { key: 'penalaranKritis', label: 'Penalaran Kritis' },
                    { key: 'kreatif', label: 'Kreatif' },
                    { key: 'kolaborasi', label: 'Kolaborasi' },
                    { key: 'kemandirian', label: 'Kemandirian' },
                    { key: 'kesehatan', label: 'Kesehatan' },
                    { key: 'komunikasi', label: 'Komunikasi' }
                  ]
                    .filter((d) => !!(doc.dimensiProfilLulusan as any)[d.key])
                    .map((d) => (
                      <div key={d.key} className="flex items-center px-3 py-1 font-medium text-slate-900">
                        <span className="w-8 font-bold text-center text-sm text-cyan-900">&#8730;</span>
                        <span className="w-5 text-center">:</span>
                        <span>{d.label}</span>
                      </div>
                    ))}
                  {Object.entries(doc.dimensiProfilLulusan).filter(([k, v]) => k !== 'catatanBukti' && !!v).length === 0 && (
                    <div className="px-3 py-3 text-center text-slate-500 italic">
                      Tidak ada dimensi yang dicentang. Tabel pada dokumen RPP tidak akan memuat dimensi apapun (dihapus).
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catatan Bukti Pembelajaran Dimensi Profil Lulusan:</label>
              <textarea
                rows={2}
                value={doc.dimensiProfilLulusan.catatanBukti || ''}
                onChange={(e) =>
                  setDoc({
                    ...doc,
                    dimensiProfilLulusan: {
                      ...doc.dimensiProfilLulusan,
                      catatanBukti: e.target.value
                    }
                  })
                }
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN II: KARAKTERISTIK MATA PELAJARAN                                  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleAccordion('karakteristik')}
          className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">II</span>
            <h3 className="font-bold text-slate-800 text-sm">KARAKTERISTIK MATA PELAJARAN</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRegenerate('karakteristik');
              }}
              disabled={generatingSection === 'karakteristik'}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className={`w-3 h-3 ${generatingSection === 'karakteristik' ? 'animate-spin' : ''}`} />
              Generate Ulang Karakteristik
            </button>
            {activeAccordion.karakteristik ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
        </div>

        {activeAccordion.karakteristik && (
          <div className="p-5 space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">a. Jenis Pengetahuan yang Akan Dicapai</label>
                <textarea
                  rows={2}
                  value={doc.karakteristik.jenisPengetahuan}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      karakteristik: { ...doc.karakteristik, jenisPengetahuan: e.target.value }
                    })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">b. Relevansi dengan Kehidupan Nyata Peserta Didik</label>
                <textarea
                  rows={2}
                  value={doc.karakteristik.relevansiKehidupanNyata}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      karakteristik: { ...doc.karakteristik, relevansiKehidupanNyata: e.target.value }
                    })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">c. Tingkat Kesulitan</label>
                <textarea
                  rows={2}
                  value={doc.karakteristik.tingkatKesulitan}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      karakteristik: { ...doc.karakteristik, tingkatKesulitan: e.target.value }
                    })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">d. Struktur Materi Pokok</label>
                <textarea
                  rows={2}
                  value={doc.karakteristik.strukturMateri}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      karakteristik: { ...doc.karakteristik, strukturMateri: e.target.value }
                    })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">e. Integrasi Nilai dan Karakter (5R, Etos Kerja Vokasi)</label>
                <textarea
                  rows={2}
                  value={doc.karakteristik.integrasiNilaiKarakter}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      karakteristik: { ...doc.karakteristik, integrasiNilaiKarakter: e.target.value }
                    })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN III: KOMPONEN INTI (CP & TP)                                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleAccordion('komponenInti')}
          className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">III</span>
            <h3 className="font-bold text-slate-800 text-sm">KOMPONEN INTI (CP &amp; TP)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRegenerate('tujuanPembelajaran');
              }}
              disabled={generatingSection === 'tujuanPembelajaran'}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className={`w-3 h-3 ${generatingSection === 'tujuanPembelajaran' ? 'animate-spin' : ''}`} />
              Generate Ulang TP
            </button>
            {activeAccordion.komponenInti ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
        </div>

        {activeAccordion.komponenInti && (
          <div className="p-5 space-y-4 text-xs">
            {/* CP Box */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-800">
                  Capaian Pembelajaran (CP) &mdash; <span className="text-emerald-700 font-normal">Dari PROTA Resmi (Substansi Asli)</span>
                </label>
              </div>
              <textarea
                rows={3}
                value={doc.capaianPembelajaran}
                onChange={(e) => setDoc({ ...doc, capaianPembelajaran: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none text-slate-800 leading-relaxed"
              />
            </div>

            {/* TP List with "Murid mampu..." */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800">
                  Tujuan Pembelajaran (TP) &mdash; <span className="text-blue-700 font-normal">Wajib diawali frasa &quot;Murid mampu ...&quot;</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setDoc({
                      ...doc,
                      tujuanPembelajaran: [...doc.tujuanPembelajaran, 'Murid mampu ...']
                    });
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Tambah Butir TP
                </button>
              </div>

              {doc.tujuanPembelajaran.map((tp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center font-bold text-slate-500 shrink-0">{idx + 1}.</span>
                  <input
                    type="text"
                    value={tp}
                    onChange={(e) => {
                      const updated = [...doc.tujuanPembelajaran];
                      updated[idx] = e.target.value;
                      setDoc({ ...doc, tujuanPembelajaran: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  {doc.tujuanPembelajaran.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = doc.tujuanPembelajaran.filter((_, i) => i !== idx);
                        setDoc({ ...doc, tujuanPembelajaran: updated });
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN IV: KEMITRAAN & DIGITAL                                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kemitraan */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleAccordion('kemitraan')}
            className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">IV</span>
              <h3 className="font-bold text-slate-800 text-sm">Kemitraan Pembelajaran</h3>
            </div>
            {activeAccordion.kemitraan ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
          {activeAccordion.kemitraan && (
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lingkungan Sekolah</label>
                <textarea
                  rows={2}
                  value={doc.kemitraan.lingkunganSekolah}
                  onChange={(e) => setDoc({ ...doc, kemitraan: { ...doc.kemitraan, lingkunganSekolah: e.target.value } })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lingkungan Luar Sekolah (DU-DI)</label>
                <textarea
                  rows={2}
                  value={doc.kemitraan.lingkunganLuarSekolah}
                  onChange={(e) => setDoc({ ...doc, kemitraan: { ...doc.kemitraan, lingkunganLuarSekolah: e.target.value } })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Masyarakat / Komunitas</label>
                <textarea
                  rows={2}
                  value={doc.kemitraan.masyarakat}
                  onChange={(e) => setDoc({ ...doc, kemitraan: { ...doc.kemitraan, masyarakat: e.target.value } })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Digital */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleAccordion('digital')}
            className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">V</span>
              <h3 className="font-bold text-slate-800 text-sm">Pemanfaatan Digital</h3>
            </div>
            {activeAccordion.digital ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
          {activeAccordion.digital && (
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perencanaan Pembelajaran</label>
                <textarea
                  rows={2}
                  value={doc.pemanfaatanDigital.perencanaan}
                  onChange={(e) => setDoc({ ...doc, pemanfaatanDigital: { ...doc.pemanfaatanDigital, perencanaan: e.target.value } })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pelaksanaan Pembelajaran</label>
                <textarea
                  rows={2}
                  value={doc.pemanfaatanDigital.pelaksanaan}
                  onChange={(e) => setDoc({ ...doc, pemanfaatanDigital: { ...doc.pemanfaatanDigital, pelaksanaan: e.target.value } })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asesmen Pembelajaran</label>
                <textarea
                  rows={2}
                  value={doc.pemanfaatanDigital.asesmen}
                  onChange={(e) => setDoc({ ...doc, pemanfaatanDigital: { ...doc.pemanfaatanDigital, asesmen: e.target.value } })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN VI: PENGALAMAN PEMBELAJARAN (TABEL KEGIATAN | DESKRIPSI | WAKTU)  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleAccordion('pengalaman')}
          className="p-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer border-b border-slate-200"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">VI</span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">PENGALAMAN PEMBELAJARAN</h3>
              <p className="text-[11px] text-slate-500">
                Pendahuluan (Mindful, Meaningful, Joyful), Inti (Fase Terstruktur), &amp; Penutup
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRegenerate('pengalamanPembelajaran');
              }}
              disabled={generatingSection === 'pengalamanPembelajaran'}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className={`w-3 h-3 ${generatingSection === 'pengalamanPembelajaran' ? 'animate-spin' : ''}`} />
              Generate Ulang Kegiatan
            </button>
            {activeAccordion.pengalaman ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
        </div>

        {activeAccordion.pengalaman && (
          <div className="p-5 space-y-5 text-xs">
            {/* 1. Pendahuluan */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">
                  1. Pendahuluan (Mindful, Meaningful, Joyful)
                </span>
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] text-slate-500 font-semibold">Waktu:</label>
                  <input
                    type="text"
                    value={doc.pengalamanPembelajaran.pendahuluan.waktu}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = parseInt(val, 10) || 0;
                      setDoc({
                        ...doc,
                        pengalamanPembelajaran: {
                          ...doc.pengalamanPembelajaran,
                          pendahuluan: {
                            ...doc.pengalamanPembelajaran.pendahuluan,
                            waktu: val,
                            waktuMenit: num
                          }
                        }
                      });
                    }}
                    className="w-24 px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-center text-blue-700"
                  />
                </div>
              </div>
              <textarea
                rows={4}
                value={doc.pengalamanPembelajaran.pendahuluan.deskripsi}
                onChange={(e) =>
                  setDoc({
                    ...doc,
                    pengalamanPembelajaran: {
                      ...doc.pengalamanPembelajaran,
                      pendahuluan: {
                        ...doc.pengalamanPembelajaran.pendahuluan,
                        deskripsi: e.target.value
                      }
                    }
                  })
                }
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none leading-relaxed"
              />
            </div>

            {/* 2. Kegiatan Inti */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">
                  2. Kegiatan Inti ({doc.pengaturan.modelPembelajaran})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const nextFaseNum = doc.pengalamanPembelajaran.kegiatanInti.length + 1;
                    const newFase: KegiatanFase = {
                      fase: `Fase ${nextFaseNum}. Aktivitas Lanjutan`,
                      waktu: '20 Menit',
                      waktuMenit: 20,
                      deskripsi: 'Deskripsi aktivitas murid dan guru...'
                    };
                    setDoc({
                      ...doc,
                      pengalamanPembelajaran: {
                        ...doc.pengalamanPembelajaran,
                        kegiatanInti: [...doc.pengalamanPembelajaran.kegiatanInti, newFase]
                      }
                    });
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Tambah Fase Inti
                </button>
              </div>

              {doc.pengalamanPembelajaran.kegiatanInti.map((fase, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={fase.fase}
                      onChange={(e) => {
                        const updated = [...doc.pengalamanPembelajaran.kegiatanInti];
                        updated[idx].fase = e.target.value;
                        setDoc({
                          ...doc,
                          pengalamanPembelajaran: {
                            ...doc.pengalamanPembelajaran,
                            kegiatanInti: updated
                          }
                        });
                      }}
                      className="w-2/3 px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800"
                    />
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={fase.waktu}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = parseInt(val, 10) || 0;
                          const updated = [...doc.pengalamanPembelajaran.kegiatanInti];
                          updated[idx].waktu = val;
                          updated[idx].waktuMenit = num;
                          setDoc({
                            ...doc,
                            pengalamanPembelajaran: {
                              ...doc.pengalamanPembelajaran,
                              kegiatanInti: updated
                            }
                          });
                        }}
                        className="w-24 px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-center text-blue-700"
                      />
                      {doc.pengalamanPembelajaran.kegiatanInti.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = doc.pengalamanPembelajaran.kegiatanInti.filter((_, i) => i !== idx);
                            setDoc({
                              ...doc,
                              pengalamanPembelajaran: {
                                ...doc.pengalamanPembelajaran,
                                kegiatanInti: updated
                              }
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={fase.deskripsi}
                    onChange={(e) => {
                      const updated = [...doc.pengalamanPembelajaran.kegiatanInti];
                      updated[idx].deskripsi = e.target.value;
                      setDoc({
                        ...doc,
                        pengalamanPembelajaran: {
                          ...doc.pengalamanPembelajaran,
                          kegiatanInti: updated
                        }
                      });
                    }}
                    className="w-full p-2 bg-white border border-slate-300 rounded focus:outline-none leading-relaxed"
                  />
                </div>
              ))}
            </div>

            {/* 3. Penutup */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">
                  3. Penutup (Refleksi &amp; Rencana Tindak Lanjut)
                </span>
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] text-slate-500 font-semibold">Waktu:</label>
                  <input
                    type="text"
                    value={doc.pengalamanPembelajaran.penutup.waktu}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = parseInt(val, 10) || 0;
                      setDoc({
                        ...doc,
                        pengalamanPembelajaran: {
                          ...doc.pengalamanPembelajaran,
                          penutup: {
                            ...doc.pengalamanPembelajaran.penutup,
                            waktu: val,
                            waktuMenit: num
                          }
                        }
                      });
                    }}
                    className="w-24 px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-center text-blue-700"
                  />
                </div>
              </div>
              <textarea
                rows={3}
                value={doc.pengalamanPembelajaran.penutup.deskripsi}
                onChange={(e) =>
                  setDoc({
                    ...doc,
                    pengalamanPembelajaran: {
                      ...doc.pengalamanPembelajaran,
                      penutup: {
                        ...doc.pengalamanPembelajaran.penutup,
                        deskripsi: e.target.value
                      }
                    }
                  })
                }
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN VII: ASESMEN PEMBELAJARAN                                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleAccordion('asesmen')}
          className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">VII</span>
            <h3 className="font-bold text-slate-800 text-sm">ASESMEN PEMBELAJARAN (Awal, Proses, Akhir)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRegenerate('asesmen');
              }}
              disabled={generatingSection === 'asesmen'}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className={`w-3 h-3 ${generatingSection === 'asesmen' ? 'animate-spin' : ''}`} />
              Generate Ulang Asesmen
            </button>
            {activeAccordion.asesmen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
        </div>

        {activeAccordion.asesmen && (
          <div className="p-5 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Asesmen Awal (Diagnostik / Formatif Awal)
              </label>
              <textarea
                rows={2}
                value={doc.asesmen.asesmenAwal}
                onChange={(e) => setDoc({ ...doc, asesmen: { ...doc.asesmen, asesmenAwal: e.target.value } })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Asesmen Proses (Formatif Proses &mdash; Observasi Sikap 5R, LKPD, Diskusi)
              </label>
              <textarea
                rows={2}
                value={doc.asesmen.asesmenProses}
                onChange={(e) => setDoc({ ...doc, asesmen: { ...doc.asesmen, asesmenProses: e.target.value } })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Asesmen Akhir (Sumatif &mdash; Produk Projek, Rubrik Kinerja, Presentasi)
              </label>
              <textarea
                rows={2}
                value={doc.asesmen.asesmenAkhir}
                onChange={(e) => setDoc({ ...doc, asesmen: { ...doc.asesmen, asesmenAkhir: e.target.value } })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN VIII: REMEDIAL & PENGAYAAN                                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleAccordion('remedial')}
          className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">VIII</span>
            <h3 className="font-bold text-slate-800 text-sm">REMEDIAL DAN PENGAYAAN</h3>
          </div>
          {activeAccordion.remedial ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>

        {activeAccordion.remedial && (
          <div className="p-5 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                A. Program Remedial (Bagi murid &lt; KKTP {doc.pengaturan.kktp})
              </label>
              <textarea
                rows={4}
                value={doc.remedialDanPengayaan.remedial}
                onChange={(e) =>
                  setDoc({
                    ...doc,
                    remedialDanPengayaan: { ...doc.remedialDanPengayaan, remedial: e.target.value }
                  })
                }
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                B. Program Pengayaan (Peningkatan kompleksitas / tantangan)
              </label>
              <textarea
                rows={3}
                value={doc.remedialDanPengayaan.pengayaan}
                onChange={(e) =>
                  setDoc({
                    ...doc,
                    remedialDanPengayaan: { ...doc.remedialDanPengayaan, pengayaan: e.target.value }
                  })
                }
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN IX & X: GLOSARIUM & DAFTAR PUSTAKA                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Glosarium */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleAccordion('glosarium')}
            className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">IX</span>
              <h3 className="font-bold text-slate-800 text-sm">Glosarium ({doc.glosarium?.length || 0})</h3>
            </div>
            {activeAccordion.glosarium ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
          {activeAccordion.glosarium && (
            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const newItem: GlosariumItem = { istilah: 'Istilah Baru', definisi: 'Definisi istilah...' };
                    setDoc({ ...doc, glosarium: [...(doc.glosarium || []), newItem] });
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-blue-700 border border-blue-200 rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Tambah Istilah
                </button>
              </div>
              {(doc.glosarium || []).map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.istilah}
                      onChange={(e) => {
                        const updated = [...doc.glosarium];
                        updated[idx].istilah = e.target.value;
                        setDoc({ ...doc, glosarium: updated });
                      }}
                      className="font-bold text-slate-800 bg-white px-2 py-0.5 border rounded w-1/2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = doc.glosarium.filter((_, i) => i !== idx);
                        setDoc({ ...doc, glosarium: updated });
                      }}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={1}
                    value={item.definisi}
                    onChange={(e) => {
                      const updated = [...doc.glosarium];
                      updated[idx].definisi = e.target.value;
                      setDoc({ ...doc, glosarium: updated });
                    }}
                    className="w-full bg-white p-1.5 border rounded text-[11px]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daftar Pustaka */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleAccordion('pustaka')}
            className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">X</span>
              <h3 className="font-bold text-slate-800 text-sm">Daftar Pustaka ({doc.daftarPustaka?.length || 0})</h3>
            </div>
            {activeAccordion.pustaka ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
          {activeAccordion.pustaka && (
            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setDoc({ ...doc, daftarPustaka: [...(doc.daftarPustaka || []), 'Referensi Buku/Sumber...'] });
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-blue-700 border border-blue-200 rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Tambah Pustaka
                </button>
              </div>
              {(doc.daftarPustaka || []).map((ref, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 text-center font-bold text-slate-400">{idx + 1}.</span>
                  <input
                    type="text"
                    value={ref}
                    onChange={(e) => {
                      const updated = [...doc.daftarPustaka];
                      updated[idx] = e.target.value;
                      setDoc({ ...doc, daftarPustaka: updated });
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = doc.daftarPustaka.filter((_, i) => i !== idx);
                      setDoc({ ...doc, daftarPustaka: updated });
                    }}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
