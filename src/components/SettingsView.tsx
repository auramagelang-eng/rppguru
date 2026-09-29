import React, { useState } from 'react';
import {
  Settings,
  Database,
  Download,
  Upload,
  CheckCircle2,
  Server,
  FileCode,
  RotateCcw,
  Save,
  Building2,
  ShieldCheck,
  Image as ImageIcon,
  Trash2,
  Eye,
  Sparkles
} from 'lucide-react';
import { SchoolProfile } from '../types/rpp';
import { DEFAULT_SCHOOL_PROFILE } from '../utils/sampleData';
import { LOGO_JATENG_SVG, LOGO_SMKN2_SVG } from '../utils/pdfExport';

interface SettingsViewProps {
  school: SchoolProfile;
  onSaveSchool: (school: SchoolProfile) => void;
  onExportAllJson: () => void;
  onImportJson: (jsonString: string) => void;
  onResetFactory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  school,
  onSaveSchool,
  onExportAllJson,
  onImportJson,
  onResetFactory
}) => {
  const [formData, setFormData] = useState<SchoolProfile>(school);
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [logoSaveSuccess, setLogoSaveSuccess] = useState(false);

  // File Upload Handlers for Logos
  const handleUploadLogoJateng = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const updated = { ...formData, logoJatengUrl: base64 };
        setFormData(updated);
        onSaveSchool(updated);
        setLogoSaveSuccess(true);
        setTimeout(() => setLogoSaveSuccess(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLogoSekolah = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const updated = { ...formData, logoSekolahUrl: base64 };
        setFormData(updated);
        onSaveSchool(updated);
        setLogoSaveSuccess(true);
        setTimeout(() => setLogoSaveSuccess(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogoJateng = () => {
    const updated = { ...formData, logoJatengUrl: undefined };
    setFormData(updated);
    onSaveSchool(updated);
    setLogoSaveSuccess(true);
    setTimeout(() => setLogoSaveSuccess(false), 2000);
  };

  const handleResetLogoSekolah = () => {
    const updated = { ...formData, logoSekolahUrl: undefined };
    setFormData(updated);
    onSaveSchool(updated);
    setLogoSaveSuccess(true);
    setTimeout(() => setLogoSaveSuccess(false), 2000);
  };

  const sqlSchema = `-- ==============================================================
-- STRUKTUR DATABASE RPP AUTO GENERATOR - SMK NEGERI 2 MAGELANG
-- Compatible with MySQL 5.7+ / MariaDB 10.3+ / XAMPP / WAMP
-- ==============================================================

CREATE DATABASE IF NOT EXISTS \`db_rpp_smkn2\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`db_rpp_smkn2\`;

-- 1. Tabel users
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`nama_lengkap\` VARCHAR(100) NOT NULL,
  \`role\` ENUM('admin', 'guru') DEFAULT 'guru',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel school_profiles
CREATE TABLE IF NOT EXISTS \`school_profiles\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama_sekolah\` VARCHAR(150) NOT NULL,
  \`npsn\` VARCHAR(20) NOT NULL,
  \`alamat\` TEXT NOT NULL,
  \`kota_kabupaten\` VARCHAR(50) NOT NULL,
  \`provinsi\` VARCHAR(50) NOT NULL,
  \`tahun_ajaran\` VARCHAR(20) NOT NULL,
  \`nama_kepala_sekolah\` VARCHAR(100) NOT NULL,
  \`nip_kepala_sekolah\` VARCHAR(30) NOT NULL,
  \`logo_sekolah_url\` MEDIUMTEXT,
  \`logo_jateng_url\` MEDIUMTEXT,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabel teacher_profiles
CREATE TABLE IF NOT EXISTS \`teacher_profiles\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT,
  \`nama_guru\` VARCHAR(100) NOT NULL,
  \`nip\` VARCHAR(30),
  \`mata_pelajaran\` VARCHAR(100) NOT NULL,
  \`program_keahlian\` VARCHAR(100) NOT NULL,
  \`fase\` VARCHAR(20) NOT NULL,
  \`kelas\` VARCHAR(50) NOT NULL,
  \`semester\` ENUM('Ganjil', 'Genap') DEFAULT 'Ganjil',
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Tabel prota
CREATE TABLE IF NOT EXISTS \`prota\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`title\` VARCHAR(200) NOT NULL,
  \`mata_pelajaran\` VARCHAR(100) NOT NULL,
  \`kelas\` VARCHAR(50) NOT NULL,
  \`tahun_ajaran\` VARCHAR(20) NOT NULL,
  \`uploaded_at\` DATETIME NOT NULL
) ENGINE=InnoDB;

-- 5. Tabel cp (Capaian Pembelajaran)
CREATE TABLE IF NOT EXISTS \`cp\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`prota_id\` VARCHAR(50),
  \`no_urut\` INT NOT NULL,
  \`elemen\` VARCHAR(150) NOT NULL,
  \`cp_text\` TEXT NOT NULL,
  \`tp_text\` TEXT,
  \`materi\` VARCHAR(255) NOT NULL,
  \`alokasi_waktu\` VARCHAR(50) NOT NULL,
  \`jp\` INT NOT NULL,
  \`semester\` ENUM('Ganjil', 'Genap') NOT NULL,
  \`status\` ENUM('belum', 'draft', 'selesai', 'pdf') DEFAULT 'belum',
  FOREIGN KEY (\`prota_id\`) REFERENCES \`prota\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Tabel rpp_documents
CREATE TABLE IF NOT EXISTS \`rpp_documents\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`cp_id\` VARCHAR(50) NOT NULL,
  \`prota_id\` VARCHAR(50) NOT NULL,
  \`status\` ENUM('draft', 'selesai', 'pdf') DEFAULT 'draft',
  \`version\` INT DEFAULT 1,
  \`created_at\` DATETIME NOT NULL,
  \`updated_at\` DATETIME NOT NULL,
  \`rpp_json\` LONGTEXT NOT NULL,
  FOREIGN KEY (\`cp_id\`) REFERENCES \`cp\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;
`;

  const phpConnection = `<?php
/**
 * Koneksi Database RPP Auto Generator - SMK Negeri 2 Magelang
 * Silakan sesuaikan host, user, password, dan database sesuai pengaturan XAMPP/WAMP Anda.
 */
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_rpp_smkn2";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("Koneksi gagal: " . $e->getMessage());
}
?>`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-700" />
            Pengaturan Sistem &amp; Master Data
          </h2>
          <p className="text-xs text-slate-500">
            Kelola identitas resmi SMK Negeri 2 Magelang, kustomisasi logo Kop Surat untuk mode Klasik Dinas, serta ekspor database lokal.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD KHUSUS: KUSTOMISASI LOGO KOP SURAT (MODE KLASIK DINAS)               */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-700" />
              Kustomisasi Logo Kop Surat (Format Klasik Dinas)
            </h3>
            <p className="text-xs text-slate-500">
              Unggah file logo sekolah atau logo provinsi (format PNG, JPG, atau SVG). Logo akan otomatis tampil pada kop surat dokumen RPP mode Klasik Dinas.
            </p>
          </div>
          {logoSaveSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Logo Berhasil Disimpan!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Logo 1: Provinsi Jawa Tengah */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">1. Logo Provinsi Jawa Tengah (Kiri Kop)</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {formData.logoJatengUrl ? 'Logo Kustom Aktif' : 'Logo Vektor Standar'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Ditampilkan pada sisi kiri atas kop surat resmi Pemerintah Provinsi Jawa Tengah.
              </p>

              {/* Preview Box */}
              <div className="w-full h-28 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2 mb-3">
                {formData.logoJatengUrl ? (
                  <img
                    src={formData.logoJatengUrl}
                    alt="Logo Jawa Tengah"
                    className="max-h-24 max-w-full object-contain"
                  />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: LOGO_JATENG_SVG }}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo Jateng</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                  onChange={handleUploadLogoJateng}
                />
              </label>

              {formData.logoJatengUrl && (
                <button
                  type="button"
                  onClick={handleResetLogoJateng}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Kembalikan ke Logo Vektor Standar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Logo 2: SMK Negeri 2 Magelang */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">2. Logo SMK Negeri 2 Magelang (Kanan Kop)</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {formData.logoSekolahUrl ? 'Logo Kustom Aktif' : 'Logo Vektor Standar'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Ditampilkan pada sisi kanan atas kop surat resmi SMK Negeri 2 Magelang.
              </p>

              {/* Preview Box */}
              <div className="w-full h-28 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2 mb-3">
                {formData.logoSekolahUrl ? (
                  <img
                    src={formData.logoSekolahUrl}
                    alt="Logo SMKN 2 Magelang"
                    className="max-h-24 max-w-full object-contain"
                  />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: LOGO_SMKN2_SVG }}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo Sekolah</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                  onChange={handleUploadLogoSekolah}
                />
              </label>

              {formData.logoSekolahUrl && (
                <button
                  type="button"
                  onClick={handleResetLogoSekolah}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Kembalikan ke Logo Vektor Standar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Kop Surat Preview */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-700" />
              Pratinjau Langsung Kop Surat Dokumen (Format Klasik Dinas):
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-2xs">
            <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
              <tbody>
                <tr>
                  <td style={{ width: '65px', textAlign: 'center', verticalAlign: 'middle' }}>
                    {formData.logoJatengUrl ? (
                      <img
                        src={formData.logoJatengUrl}
                        alt="Logo Jateng"
                        style={{ maxHeight: '60px', maxWidth: '60px', objectFit: 'contain' }}
                      />
                    ) : (
                      <div
                        style={{ display: 'inline-block' }}
                        dangerouslySetInnerHTML={{ __html: LOGO_JATENG_SVG }}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0 8px' }}>
                    <div style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      PEMERINTAH PROVINSI JAWA TENGAH
                    </div>
                    <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      DINAS PENDIDIKAN DAN KEBUDAYAAN
                    </div>
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {formData.namaSekolah || 'SEKOLAH MENENGAH KEJURUAN NEGERI 2 MAGELANG'}
                    </div>
                    <div style={{ fontSize: '8pt', color: '#334155', marginTop: '2px' }}>
                      {formData.alamat || 'Jalan Jenderal Ahmad Yani 135 A, Kramat Selatan, Kota Magelang'} &bull; Kode Pos 56115
                    </div>
                  </td>
                  <td style={{ width: '65px', textAlign: 'center', verticalAlign: 'middle' }}>
                    {formData.logoSekolahUrl ? (
                      <img
                        src={formData.logoSekolahUrl}
                        alt="Logo Sekolah"
                        style={{ maxHeight: '60px', maxWidth: '60px', objectFit: 'contain' }}
                      />
                    ) : (
                      <div
                        style={{ display: 'inline-block' }}
                        dangerouslySetInnerHTML={{ __html: LOGO_SMKN2_SVG }}
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ borderTop: '2px solid #000', borderBottom: '1px solid #000', height: '2px', marginTop: '6px' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Master Data Sekolah */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-700" />
              Profil Satuan Pendidikan
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700">
              SMK Negeri 2 Magelang
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
              <input
                type="text"
                value={formData.namaSekolah}
                onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={formData.namaKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, namaKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={formData.tahunAjaran}
                  onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Satuan Pendidikan</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setFormData(DEFAULT_SCHOOL_PROFILE)}
                className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Kembalikan Default
              </button>

              <button
                type="button"
                onClick={() => {
                  onSaveSchool(formData);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2000);
                }}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {saveSuccess ? 'Tersimpan!' : 'Simpan Master Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Backup & Restore JSON */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Cadangkan &amp; Pulihkan Data (Backup/Restore)
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700">
              JSON File
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <p>
              Simpan seluruh data PROTA, RPP yang telah selesai maupun draft ke dalam berkas cadangan (backup JSON) agar aman dan dapat dipindahkan ke perangkat lain.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={onExportAllJson}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center font-semibold text-slate-800 flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5 text-blue-700" />
                <span>Download Backup JSON</span>
              </button>

              <label className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center font-semibold text-slate-800 flex flex-col items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-5 h-5 text-emerald-600" />
                <span>Restore dari JSON</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        if (content) onImportJson(content);
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  if (confirm('PERINGATAN: Seluruh data PROTA dan RPP lokal akan direset ke kondisi awal. Lanjutkan?')) {
                    onResetFactory();
                  }
                }}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Seluruh Data Aplikasi ke Standar Pabrik
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Schema & XAMPP Integration */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              Paket Ekspor Database MySQL &amp; Skrip XAMPP / WAMP
            </h3>
            <p className="text-xs text-slate-500">
              Skema DDL MySQL lengkap untuk 15 tabel kebutuhan kurikulum vokasi SMK Negeri 2 Magelang.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              {copiedSql ? 'Tersalin!' : 'Salin SQL'}
            </button>
            <button
              onClick={() => downloadFile(sqlSchema, 'database_smkn2.sql', 'text/sql')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh database_smkn2.sql
            </button>
            <button
              onClick={() => downloadFile(phpConnection, 'koneksi.php', 'application/x-httpd-php')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh koneksi.php
            </button>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-64 scrollbar-thin">
          <pre>{sqlSchema.slice(0, 1500)}... (lihat file lengkap via tombol unduh di atas)</pre>
        </div>
      </div>
    </div>
  );
};
