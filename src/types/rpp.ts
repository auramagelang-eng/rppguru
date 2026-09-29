export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  kotaKabupaten: string;
  provinsi: string;
  tahunAjaran: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  logoSekolahUrl?: string; // Custom uploaded logo or base64
  logoJatengUrl?: string;   // Custom uploaded logo or base64
}

export interface TeacherProfile {
  namaGuru: string;
  nip: string;
  mataPelajaran: string;
  programKeahlian: string;
  fase: string; // e.g. "Fase E", "Fase F"
  kelas: string; // e.g. "X", "XI", "XII"
  semester: string; // "Ganjil" | "Genap"
}

export interface LearningSettings {
  modelPembelajaran: string; // "Project Based Learning (PjBL)" | "Problem Based Learning (PBL)" | "Discovery Learning" | "Inquiry Learning" | "Teaching Factory (TeFa)"
  jumlahJp: number; // e.g. 4
  durasiJp: number; // default 45 menit
  kktp: number; // default 75
  tanggalRpp: string; // e.g. "15 Juli 2025" or current date
}

export type CPStatus = 'belum' | 'draft' | 'selesai' | 'pdf';

export interface CPItem {
  id: string;
  no: number;
  elemen: string;
  cp: string;
  tp: string;
  materi: string;
  alokasiWaktu: string;
  jp: number;
  semester: string;
  status: CPStatus;
  rppId?: string;
}

export interface ProtaData {
  id: string;
  title: string;
  mataPelajaran: string;
  kelas: string;
  tahunAjaran: string;
  uploadedAt: string;
  items: CPItem[];
}

export interface DimensiProfilLulusan {
  keimanan: boolean;
  kewarganegaraan: boolean;
  penalaranKritis: boolean;
  kreatif: boolean;
  kolaborasi: boolean;
  kemandirian: boolean;
  kesehatan: boolean;
  komunikasi: boolean;
  catatanBukti?: string;
}

export interface KarakteristikMapel {
  jenisPengetahuan: string;
  relevansiKehidupanNyata: string;
  tingkatKesulitan: string;
  strukturMateri: string;
  integrasiNilaiKarakter: string;
}

export interface KemitraanPembelajaran {
  lingkunganSekolah: string;
  lingkunganLuarSekolah: string;
  masyarakat: string;
}

export interface PemanfaatanDigital {
  perencanaan: string;
  pelaksanaan: string;
  asesmen: string;
}

export interface KegiatanFase {
  fase: string;
  waktu: string;
  waktuMenit?: number;
  deskripsi: string;
}

export interface PengalamanPembelajaran {
  pendahuluan: {
    waktu: string;
    waktuMenit?: number;
    deskripsi: string;
  };
  kegiatanInti: KegiatanFase[];
  penutup: {
    waktu: string;
    waktuMenit?: number;
    deskripsi: string;
  };
  totalWaktuMenit: number;
}

export interface AsesmenPembelajaran {
  asesmenAwal: string; // Formatif Awal
  asesmenProses: string; // Formatif Proses
  asesmenAkhir: string; // Sumatif
}

export interface RemedialDanPengayaan {
  remedial: string;
  pengayaan: string;
}

export interface GlosariumItem {
  istilah: string;
  definisi: string;
}

export interface RPPDocument {
  id: string;
  cpId: string;
  protaId?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  status: 'draft' | 'selesai' | 'pdf';

  // Identitas
  sekolah: SchoolProfile;
  guru: TeacherProfile;
  pengaturan: LearningSettings;

  // I. Profil Lulusan
  dimensiProfilLulusan: DimensiProfilLulusan;

  // II. Karakteristik Mapel
  karakteristik: KarakteristikMapel;

  // III. Komponen Inti
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];

  // IV. Kemitraan Pembelajaran
  kemitraan: KemitraanPembelajaran;

  // V. Pemanfaatan Digital
  pemanfaatanDigital: PemanfaatanDigital;

  // VI. Pengalaman Pembelajaran
  pengalamanPembelajaran: PengalamanPembelajaran;

  // VII. Asesmen
  asesmen: AsesmenPembelajaran;

  // VIII. Remedial & Pengayaan
  remedialDanPengayaan: RemedialDanPengayaan;

  // IX. Glosarium
  glosarium: GlosariumItem[];

  // X. Daftar Pustaka
  daftarPustaka: string[];

  // XI. Tanda Tangan
  tandaTangan: {
    kepalaSekolahNama: string;
    kepalaSekolahNip: string;
    guruNama: string;
    guruNip: string;
    tempatTanggal: string;
  };
}

export interface ValidationCheckItem {
  id: string;
  label: string;
  isValid: boolean;
  message?: string;
}

export interface ValidationSummary {
  isValid: boolean;
  totalChecks: number;
  passedChecks: number;
  checks: ValidationCheckItem[];
}
