import React, { useState } from 'react';
import { SchoolProfile, TeacherProfile, LearningSettings } from '../types/rpp';
import { DEFAULT_SCHOOL_PROFILE, DEFAULT_TEACHER_PROFILE, DEFAULT_LEARNING_SETTINGS } from '../utils/sampleData';
import { Save, RotateCcw, Check, Building2, User, BookOpen, Clock } from 'lucide-react';

interface IdentityFormViewProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  settings: LearningSettings;
  onSave: (school: SchoolProfile, teacher: TeacherProfile, settings: LearningSettings) => void;
}

export const IdentityFormView: React.FC<IdentityFormViewProps> = ({
  school: initialSchool,
  teacher: initialTeacher,
  settings: initialSettings,
  onSave
}) => {
  const [school, setSchool] = useState<SchoolProfile>(initialSchool);
  const [teacher, setTeacher] = useState<TeacherProfile>(initialTeacher);
  const [settings, setSettings] = useState<LearningSettings>(initialSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(school, teacher, settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToSmkn2 = () => {
    if (confirm('Pulihkan identitas sekolah ke standar master SMK Negeri 2 Magelang?')) {
      setSchool(DEFAULT_SCHOOL_PROFILE);
      setTeacher(DEFAULT_TEACHER_PROFILE);
      setSettings(DEFAULT_LEARNING_SETTINGS);
    }
  };

  const totalMenit = (settings.jumlahJp || 6) * (settings.durasiJp || 45);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-700" />
            Pengaturan Identitas &amp; Pembelajaran
          </h2>
          <p className="text-xs text-slate-500">
            Data ini akan otomatis disematkan pada kop surat, identitas PPM, alokasi waktu, dan tanda tangan resmi RPP.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToSmkn2}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Standar SMK N 2
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {savedSuccess ? 'Tersimpan!' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. IDENTITAS SEKOLAH */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              I. Identitas Satuan Pendidikan
            </h3>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">Master Data</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
              <input
                type="text"
                value={school.namaSekolah}
                onChange={(e) => setSchool({ ...school, namaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
                <input
                  type="text"
                  value={school.npsn}
                  onChange={(e) => setSchool({ ...school, npsn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={school.tahunAjaran}
                  onChange={(e) => setSchool({ ...school, tahunAjaran: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Sekolah</label>
              <input
                type="text"
                value={school.alamat}
                onChange={(e) => setSchool({ ...school, alamat: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={school.kotaKabupaten}
                  onChange={(e) => setSchool({ ...school, kotaKabupaten: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
                <input
                  type="text"
                  value={school.provinsi}
                  onChange={(e) => setSchool({ ...school, provinsi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={school.namaKepalaSekolah}
                  onChange={(e) => setSchool({ ...school, namaKepalaSekolah: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={school.nipKepalaSekolah}
                  onChange={(e) => setSchool({ ...school, nipKepalaSekolah: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. IDENTITAS GURU */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              II. Identitas Guru Pengampu
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">Profil Guru</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Guru (Lengkap dg Gelar)</label>
              <input
                type="text"
                value={teacher.namaGuru}
                onChange={(e) => setTeacher({ ...teacher, namaGuru: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP / NIPPK Guru</label>
              <input
                type="text"
                value={teacher.nip}
                onChange={(e) => setTeacher({ ...teacher, nip: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="19880512 201502 1 002 atau - jika non-PNS"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
              <input
                type="text"
                value={teacher.mataPelajaran}
                onChange={(e) => setTeacher({ ...teacher, mataPelajaran: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-blue-900"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Program Keahlian</label>
              <input
                type="text"
                value={teacher.programKeahlian}
                onChange={(e) => setTeacher({ ...teacher, programKeahlian: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Misal: PPLG, MPLB, AKL, DKV, dll."
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fase</label>
                <select
                  value={teacher.fase}
                  onChange={(e) => setTeacher({ ...teacher, fase: e.target.value })}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Fase E">Fase E (Kelas X)</option>
                  <option value="Fase F">Fase F (Kelas XI/XII)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
                <input
                  type="text"
                  value={teacher.kelas}
                  onChange={(e) => setTeacher({ ...teacher, kelas: e.target.value })}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="XI PPLG 1"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                <select
                  value={teacher.semester}
                  onChange={(e) => setTeacher({ ...teacher, semester: e.target.value })}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PENGATURAN PEMBELAJARAN */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              III. Parameter Pembelajaran
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">Pedagogi</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Model Pembelajaran</label>
              <select
                value={settings.modelPembelajaran}
                onChange={(e) => setSettings({ ...settings, modelPembelajaran: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL) - 6 Fase</option>
                <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL) - 5 Fase</option>
                <option value="Discovery Learning">Discovery Learning - 6 Sintaks</option>
                <option value="Inquiry Learning">Inquiry Learning</option>
                <option value="Teaching Factory (TeFa)">Teaching Factory (TeFa)</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Model PjBL akan mengaktifkan 6 fase terstruktur pada Kegiatan Inti.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jumlah JP</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={settings.jumlahJp}
                  onChange={(e) => setSettings({ ...settings, jumlahJp: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Durasi 1 JP (Menit)</label>
                <input
                  type="number"
                  min={30}
                  max={60}
                  value={settings.durasiJp}
                  onChange={(e) => setSettings({ ...settings, durasiJp: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Total Minutes Calculator Box */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <span className="font-semibold text-blue-900 text-xs">Total Waktu Belajar:</span>
              </div>
              <span className="font-black text-blue-800 text-sm">{totalMenit} Menit</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standar KKTP</label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={settings.kktp}
                  onChange={(e) => setSettings({ ...settings, kktp: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Dokumen RPP</label>
                <input
                  type="text"
                  value={settings.tanggalRpp}
                  onChange={(e) => setSettings({ ...settings, tanggalRpp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="15 Juli 2025"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
