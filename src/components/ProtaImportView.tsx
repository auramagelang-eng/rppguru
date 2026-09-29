import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Table,
  Check
} from 'lucide-react';
import {
  parseExcelOrCsvFile,
  parseDocxFile,
  downloadProtaTemplateExcel,
  ColumnMapping,
  buildCpItemsFromRows
} from '../utils/protaParser';
import { ProtaData, CPItem } from '../types/rpp';
import {
  SAMPLE_PROTA_PPLG,
  SAMPLE_PROTA_INFORMATIKA,
  SAMPLE_PROTA_MPLB
} from '../utils/sampleData';

interface ProtaImportViewProps {
  onProtaImported: (prota: ProtaData) => void;
  onNavigateToCpList: () => void;
}

export const ProtaImportView: React.FC<ProtaImportViewProps> = ({
  onProtaImported,
  onNavigateToCpList
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Parsed stage state
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    elemen: '',
    cp: '',
    tp: '',
    materi: '',
    alokasiWaktu: '',
    semester: ''
  });
  const [previewItems, setPreviewItems] = useState<CPItem[]>([]);
  const [protaTitle, setProtaTitle] = useState('PROTA Kurikulum Merdeka');
  const [mapelTitle, setMapelTitle] = useState('Mata Pelajaran Kejuruan');
  const [kelasTitle, setKelasTitle] = useState('XI');

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let res;
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        res = await parseExcelOrCsvFile(file);
      } else if (ext === 'docx') {
        res = await parseDocxFile(file);
      } else {
        throw new Error('Format file tidak didukung. Harap unggah file .xlsx, .csv, atau .docx.');
      }

      setParsedHeaders(res.headers);
      setRawRows(res.rawRows);
      setColumnMapping(res.detectedMapping);
      setPreviewItems(res.items);
      setProtaTitle(`PROTA - ${res.title}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Gagal memproses file. Periksa format berkas Anda.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    const updated = { ...columnMapping, [field]: value };
    setColumnMapping(updated);
    const updatedItems = buildCpItemsFromRows(rawRows, updated);
    setPreviewItems(updatedItems);
  };

  const handleApplyImport = () => {
    if (previewItems.length === 0) {
      setErrorMessage('Tidak ada data Capaian Pembelajaran yang valid untuk diimpor.');
      return;
    }

    const newProta: ProtaData = {
      id: `prota-${Date.now()}`,
      title: protaTitle,
      mataPelajaran: mapelTitle,
      kelas: kelasTitle,
      tahunAjaran: '2026/2027',
      uploadedAt: new Date().toISOString(),
      items: previewItems
    };

    onProtaImported(newProta);
    onNavigateToCpList();
  };

  const handleLoadSample = (sample: ProtaData) => {
    onProtaImported(sample);
    onNavigateToCpList();
  };

  return (
    <div className="space-y-6">
      {/* Top Description & Action Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-700" />
            Import Dokumen PROTA / PROMES
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Unggah file Program Tahunan (PROTA) atau Program Semester (PROMES) dalam format Excel (.xlsx), CSV,
            atau Word (.docx). Sistem membaca Capaian Pembelajaran, Elemen, Materi, dan Alokasi Waktu secara otomatis untuk Tahun Ajaran 2026/2027.
          </p>
        </div>

        <button
          onClick={downloadProtaTemplateExcel}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          Unduh Template Excel PROTA
        </button>
      </div>

      {/* Instant Sample Selectors */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-blue-700 shrink-0" />
          <div>
            <div className="text-xs font-bold text-blue-900">Kurikulum Master SMK Negeri 2 Magelang (T.A. 2026/2027)</div>
            <div className="text-[11px] text-blue-700">Pilih kurikulum terverifikasi berikut untuk langsung memuat data dan mengaktifkan RPP:</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleLoadSample(SAMPLE_PROTA_PPLG)}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
            PROTA 2026/2027 (PPLG XI)
          </button>
          <button
            onClick={() => handleLoadSample(SAMPLE_PROTA_INFORMATIKA)}
            className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-blue-800 text-xs font-semibold rounded-lg border border-blue-200 shadow-2xs transition-all cursor-pointer"
          >
            Informatika Fase E 2026/2027
          </button>
          <button
            onClick={() => handleLoadSample(SAMPLE_PROTA_MPLB)}
            className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-blue-800 text-xs font-semibold rounded-lg border border-blue-200 shadow-2xs transition-all cursor-pointer"
          >
            Manajemen Perkantoran (MPLB)
          </button>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-600 bg-blue-50/70 scale-101'
            : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv,.docx"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-3 shadow-inner">
          <Upload className="w-7 h-7" />
        </div>
        <div className="text-base font-bold text-slate-800 mb-1">
          {isProcessing ? 'Sedang Membaca & Memproses Berkas...' : 'Klik atau Seret Berkas PROTA ke Sini'}
        </div>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          Mendukung format <strong>.XLSX</strong>, <strong>.XLS</strong>, <strong>.CSV</strong>, dan <strong>.DOCX</strong>
        </p>

        <div className="inline-flex items-center gap-4 text-xs text-slate-400 justify-center">
          <span className="flex items-center gap-1">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel Spreadsheet
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4 text-blue-600" /> Word / DOCX
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Column Mapping Section (Requirement #16) */}
      {parsedHeaders.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-4 h-4 text-indigo-600" />
                Pemetaan Kolom (Column Mapping): Kolom PROTA &rarr; Field Aplikasi
              </h3>
              <p className="text-xs text-slate-500">
                Cocokkan nama kolom di file Anda dengan data yang dibutuhkan aplikasi.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full self-start sm:self-auto">
              {previewItems.length} CP Terdeteksi
            </span>
          </div>

          {/* Quick Metadata Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Judul PROTA</label>
              <input
                type="text"
                value={protaTitle}
                onChange={(e) => setProtaTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
              <input
                type="text"
                value={mapelTitle}
                onChange={(e) => setMapelTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tingkat Kelas</label>
              <input
                type="text"
                value={kelasTitle}
                onChange={(e) => setKelasTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 6 Mapping Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
              { key: 'elemen', label: 'Elemen / Domain', req: true },
              { key: 'cp', label: 'Capaian Pembelajaran (CP)', req: true },
              { key: 'tp', label: 'Tujuan Pembelajaran (TP)', req: false },
              { key: 'materi', label: 'Materi Pokok', req: true },
              { key: 'alokasiWaktu', label: 'Alokasi Waktu (JP)', req: true },
              { key: 'semester', label: 'Semester (Ganjil/Genap)', req: false }
            ].map((f) => (
              <div key={f.key} className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg">
                <label className="block font-semibold text-slate-700 mb-1">
                  Field: <span className="text-blue-700">{f.label}</span> {f.req && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={columnMapping[f.key as keyof ColumnMapping] || ''}
                  onChange={(e) => handleMappingChange(f.key as keyof ColumnMapping, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Pilih Kolom File --</option>
                  {parsedHeaders.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Live Preview Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700">Preview Data Hasil Parsing ({previewItems.length} Baris):</h4>
            <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 sticky top-0 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 w-10 text-center">No</th>
                    <th className="p-2.5 w-32">Elemen</th>
                    <th className="p-2.5">Capaian Pembelajaran (CP)</th>
                    <th className="p-2.5 w-40">Materi</th>
                    <th className="p-2.5 w-20 text-center">Alokasi</th>
                    <th className="p-2.5 w-20 text-center">Semester</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 font-medium text-slate-800">{item.elemen}</td>
                      <td className="p-2.5 text-slate-600 line-clamp-2">{item.cp}</td>
                      <td className="p-2.5 text-slate-700">{item.materi}</td>
                      <td className="p-2.5 text-center font-semibold text-blue-700">{item.alokasiWaktu}</td>
                      <td className="p-2.5 text-center text-slate-600">{item.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Commit Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={handleApplyImport}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Terapkan &amp; Simpan ke Daftar CP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
