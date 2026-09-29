import {
  SchoolProfile,
  TeacherProfile,
  LearningSettings,
  ProtaData,
  RPPDocument,
  ValidationSummary,
  ValidationCheckItem
} from '../types/rpp';
import {
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_TEACHER_PROFILE,
  DEFAULT_LEARNING_SETTINGS,
  SAMPLE_PROTA_PPLG,
  SAMPLE_PROTA_INFORMATIKA,
  SAMPLE_PROTA_MPLB,
  PRE_GENERATED_RPPS_2026
} from './sampleData';

const CURRENT_DATA_VERSION = '2026-2027-v5';
const VERSION_KEY = 'rpp_smkn2_data_version';

const STORAGE_KEYS = {
  SCHOOL: 'rpp_smkn2_school_profile',
  TEACHER: 'rpp_smkn2_teacher_profile',
  SETTINGS: 'rpp_smkn2_learning_settings',
  PROTA_LIST: 'rpp_smkn2_prota_list',
  CURRENT_PROTA_ID: 'rpp_smkn2_current_prota_id',
  RPP_DOCUMENTS: 'rpp_smkn2_rpp_documents',
  ACTIVE_RPP_ID: 'rpp_smkn2_active_rpp_id'
};

// Check and perform auto-migration to updated school/teacher/PROTA data
function ensureDataUpToDate(): void {
  try {
    const existingVersion = localStorage.getItem(VERSION_KEY);
    const existingSchool = localStorage.getItem(STORAGE_KEYS.SCHOOL);
    const existingTeacher = localStorage.getItem(STORAGE_KEYS.TEACHER);
    const existingSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const existingProta = localStorage.getItem(STORAGE_KEYS.PROTA_LIST);

    let needsReset = false;

    if (!existingVersion || existingVersion !== CURRENT_DATA_VERSION) {
      needsReset = true;
    } else if (
      existingTeacher &&
      (!existingTeacher.includes('Ahmad Syaefudin, S.Kom') ||
        !existingTeacher.includes('199301062022211009') ||
        !existingTeacher.includes('Pemrograman WEB') ||
        !existingTeacher.includes('XI PPLG'))
    ) {
      needsReset = true;
    } else if (
      existingSchool &&
      (!existingSchool.includes('Jl. A Yani 135A, Kramat Selatan, Kec. Magelang Utara') ||
        !existingSchool.includes('Kurniawan Basuki, S.Pd., M.T') ||
        !existingSchool.includes('196709291990031013'))
    ) {
      needsReset = true;
    } else if (existingSettings && !existingSettings.includes('"jumlahJp":6')) {
      needsReset = true;
    } else if (
      existingProta &&
      (existingProta.includes('prota-pplg-xi-2025') ||
        existingProta.includes('2025/2026') ||
        existingProta.includes('Pemrograman Web dan Perangkat Bergerak'))
    ) {
      needsReset = true;
    }

    if (needsReset) {
      resetToProta20262027();
    }
  } catch (e) {
    console.warn('Storage migration notice:', e);
  }
}

// Reset or sync cleanly to PROTA 2026/2027
export function resetToProta20262027(): {
  prota: ProtaData;
  rpps: RPPDocument[];
  school: SchoolProfile;
  teacher: TeacherProfile;
  settings: LearningSettings;
} {
  const masterProtaList = [SAMPLE_PROTA_PPLG, SAMPLE_PROTA_INFORMATIKA, SAMPLE_PROTA_MPLB];
  
  localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(DEFAULT_SCHOOL_PROFILE));
  localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(DEFAULT_TEACHER_PROFILE));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_LEARNING_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.PROTA_LIST, JSON.stringify(masterProtaList));
  localStorage.setItem(STORAGE_KEYS.CURRENT_PROTA_ID, SAMPLE_PROTA_PPLG.id);
  localStorage.setItem(STORAGE_KEYS.RPP_DOCUMENTS, JSON.stringify(PRE_GENERATED_RPPS_2026));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_RPP_ID, PRE_GENERATED_RPPS_2026[0]?.id || '');
  localStorage.setItem(VERSION_KEY, CURRENT_DATA_VERSION);

  return {
    prota: SAMPLE_PROTA_PPLG,
    rpps: PRE_GENERATED_RPPS_2026,
    school: DEFAULT_SCHOOL_PROFILE,
    teacher: DEFAULT_TEACHER_PROFILE,
    settings: DEFAULT_LEARNING_SETTINGS
  };
}

// Run auto-migration immediately on file load
ensureDataUpToDate();

// --- School Profile ---
export function getSavedSchoolProfile(): SchoolProfile {
  try {
    ensureDataUpToDate();
    const raw = localStorage.getItem(STORAGE_KEYS.SCHOOL);
    return raw ? { ...DEFAULT_SCHOOL_PROFILE, ...JSON.parse(raw) } : DEFAULT_SCHOOL_PROFILE;
  } catch {
    return DEFAULT_SCHOOL_PROFILE;
  }
}

export function saveSchoolProfile(profile: SchoolProfile): void {
  localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(profile));
}

// --- Teacher Profile ---
export function getSavedTeacherProfile(): TeacherProfile {
  try {
    ensureDataUpToDate();
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHER);
    return raw ? { ...DEFAULT_TEACHER_PROFILE, ...JSON.parse(raw) } : DEFAULT_TEACHER_PROFILE;
  } catch {
    return DEFAULT_TEACHER_PROFILE;
  }
}

export function saveTeacherProfile(profile: TeacherProfile): void {
  localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(profile));
}

// --- Learning Settings ---
export function getSavedLearningSettings(): LearningSettings {
  try {
    ensureDataUpToDate();
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_LEARNING_SETTINGS, ...JSON.parse(raw) } : DEFAULT_LEARNING_SETTINGS;
  } catch {
    return DEFAULT_LEARNING_SETTINGS;
  }
}

export function saveLearningSettings(settings: LearningSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// --- PROTA List ---
export function getSavedProtaList(): ProtaData[] {
  try {
    ensureDataUpToDate();
    const raw = localStorage.getItem(STORAGE_KEYS.PROTA_LIST);
    if (!raw) {
      const initial = [SAMPLE_PROTA_PPLG, SAMPLE_PROTA_INFORMATIKA, SAMPLE_PROTA_MPLB];
      localStorage.setItem(STORAGE_KEYS.PROTA_LIST, JSON.stringify(initial));
      localStorage.setItem(STORAGE_KEYS.CURRENT_PROTA_ID, SAMPLE_PROTA_PPLG.id);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [SAMPLE_PROTA_PPLG];
  }
}

export function saveProtaList(list: ProtaData[]): void {
  localStorage.setItem(STORAGE_KEYS.PROTA_LIST, JSON.stringify(list));
}

export function getCurrentProta(): ProtaData {
  ensureDataUpToDate();
  const list = getSavedProtaList();
  const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_PROTA_ID);
  const found = list.find((p) => p.id === currentId);
  return found || list[0] || SAMPLE_PROTA_PPLG;
}

export function setCurrentProtaId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_PROTA_ID, id);
}

// --- RPP Documents ---
export function getSavedRppDocuments(): RPPDocument[] {
  try {
    ensureDataUpToDate();
    const raw = localStorage.getItem(STORAGE_KEYS.RPP_DOCUMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RPP_DOCUMENTS, JSON.stringify(PRE_GENERATED_RPPS_2026));
      return PRE_GENERATED_RPPS_2026;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRE_GENERATED_RPPS_2026;
  } catch {
    return PRE_GENERATED_RPPS_2026;
  }
}

export function saveRppDocument(doc: RPPDocument): void {
  const list = getSavedRppDocuments();
  const index = list.findIndex((d) => d.id === doc.id);
  const updatedDoc = {
    ...doc,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    list[index] = updatedDoc;
  } else {
    list.unshift(updatedDoc);
  }

  localStorage.setItem(STORAGE_KEYS.RPP_DOCUMENTS, JSON.stringify(list));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_RPP_ID, doc.id);

  // Sync status back to corresponding CP in PROTA
  updateCpStatus(doc.cpId, doc.status, doc.id);
}

export function deleteRppDocument(id: string): void {
  const list = getSavedRppDocuments();
  const toDelete = list.find((d) => d.id === id);
  const filtered = list.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.RPP_DOCUMENTS, JSON.stringify(filtered));

  if (toDelete?.cpId) {
    // Check if any other RPP exists for this CP
    const remainingForCp = filtered.find((d) => d.cpId === toDelete.cpId);
    updateCpStatus(toDelete.cpId, remainingForCp ? remainingForCp.status : 'belum', remainingForCp?.id);
  }
}

export function getRppById(id: string): RPPDocument | undefined {
  const list = getSavedRppDocuments();
  return list.find((d) => d.id === id);
}

export function getRppByCpId(cpId: string): RPPDocument | undefined {
  const list = getSavedRppDocuments();
  return list.find((d) => d.cpId === cpId);
}

// Update status of CP in PROTA
export function updateCpStatus(cpId: string, status: 'belum' | 'draft' | 'selesai' | 'pdf', rppId?: string): void {
  const protaList = getSavedProtaList();
  let modified = false;

  protaList.forEach((prota) => {
    const item = prota.items.find((c) => c.id === cpId);
    if (item) {
      item.status = status;
      if (rppId !== undefined) {
        item.rppId = rppId;
      }
      modified = true;
    }
  });

  if (modified) {
    saveProtaList(protaList);
  }
}

// Duplicate RPP
export function duplicateRppDocument(rppId: string): RPPDocument | null {
  const original = getRppById(rppId);
  if (!original) return null;

  const duplicated: RPPDocument = {
    ...JSON.parse(JSON.stringify(original)),
    id: `rpp-${Date.now()}`,
    version: (original.version || 1) + 1,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveRppDocument(duplicated);
  return duplicated;
}

// Run 13 Checklist Validation
export function validateRppDocument(doc: RPPDocument): ValidationSummary {
  const checks: ValidationCheckItem[] = [];

  // 1. Identitas lengkap
  const hasSchool = !!(doc.sekolah?.namaSekolah && doc.sekolah?.namaKepalaSekolah && doc.sekolah?.nipKepalaSekolah);
  const hasTeacher = !!(doc.guru?.namaGuru && doc.guru?.mataPelajaran && doc.guru?.kelas && doc.guru?.semester);
  checks.push({
    id: 'identitas',
    label: 'Identitas Sekolah & Guru Lengkap',
    isValid: hasSchool && hasTeacher,
    message: !hasSchool ? 'Data identitas sekolah belum lengkap' : !hasTeacher ? 'Data guru atau mata pelajaran belum lengkap' : undefined
  });

  // 2. CP tersedia
  const hasCp = !!(doc.capaianPembelajaran && doc.capaianPembelajaran.trim().length > 10);
  checks.push({
    id: 'cp',
    label: 'Capaian Pembelajaran (CP) Tersedia & Utuh',
    isValid: hasCp,
    message: !hasCp ? 'Teks Capaian Pembelajaran kosong atau terlalu pendek' : undefined
  });

  // 3. TP tersedia
  const hasTp = !!(doc.tujuanPembelajaran && doc.tujuanPembelajaran.length > 0 && doc.tujuanPembelajaran.every((t) => t.trim().length > 5));
  checks.push({
    id: 'tp',
    label: 'Tujuan Pembelajaran (TP) Tersedia (Murid mampu...)',
    isValid: hasTp,
    message: !hasTp ? 'Tujuan pembelajaran harus diisi dan berformat operasional' : undefined
  });

  // 4. Materi tersedia
  const hasMateri = !!(doc.karakteristik?.strukturMateri && doc.karakteristik.strukturMateri.trim().length > 5);
  checks.push({
    id: 'materi',
    label: 'Materi & Struktur Materi Tersedia',
    isValid: hasMateri,
    message: !hasMateri ? 'Struktur materi pada karakteristik mapel belum terisi' : undefined
  });

  // 5. Alokasi waktu tersedia
  const hasAlokasi = doc.pengaturan?.jumlahJp > 0 && doc.pengaturan?.durasiJp > 0;
  checks.push({
    id: 'alokasi',
    label: 'Alokasi Waktu (JP & Menit) Tersedia',
    isValid: hasAlokasi,
    message: !hasAlokasi ? 'Jumlah JP dan durasi JP belum diatur' : undefined
  });

  // 6. Total waktu kegiatan = total JP
  const targetMenit = (doc.pengaturan?.jumlahJp || 6) * (doc.pengaturan?.durasiJp || 45);
  const pendahuluanMin = doc.pengalamanPembelajaran?.pendahuluan?.waktuMenit || parseInt(doc.pengalamanPembelajaran?.pendahuluan?.waktu || '0', 10) || 0;
  const penutupMin = doc.pengalamanPembelajaran?.penutup?.waktuMenit || parseInt(doc.pengalamanPembelajaran?.penutup?.waktu || '0', 10) || 0;
  const intiMin = (doc.pengalamanPembelajaran?.kegiatanInti || []).reduce((acc, f) => {
    const m = f.waktuMenit || parseInt(f.waktu || '0', 10) || 0;
    return acc + m;
  }, 0);
  const currentTotal = pendahuluanMin + intiMin + penutupMin;
  const isTimeEqual = Math.abs(currentTotal - targetMenit) <= 5; // allow tiny rounding or exact
  checks.push({
    id: 'waktu_kegiatan',
    label: `Total Waktu Kegiatan = Total JP (${currentTotal} Menit / ${targetMenit} Menit)`,
    isValid: isTimeEqual,
    message: !isTimeEqual ? `Total rincian aktivitas (${currentTotal} mnt) belum cocok dengan alokasi target (${targetMenit} mnt)` : undefined
  });

  // 7. Model pembelajaran tersedia
  const hasModel = !!(doc.pengaturan?.modelPembelajaran && doc.pengaturan.modelPembelajaran.trim().length > 3);
  checks.push({
    id: 'model',
    label: 'Model Pembelajaran Tersedia',
    isValid: hasModel,
    message: !hasModel ? 'Pilih salah satu model pembelajaran' : undefined
  });

  // 8. Asesmen tersedia
  const hasAsesmen = !!(doc.asesmen?.asesmenAwal && doc.asesmen?.asesmenProses && doc.asesmen?.asesmenAkhir);
  checks.push({
    id: 'asesmen',
    label: 'Asesmen Tersedia (Awal, Proses, Akhir)',
    isValid: hasAsesmen,
    message: !hasAsesmen ? 'Asesmen awal, proses, atau akhir belum lengkap' : undefined
  });

  // 9. Remedial tersedia
  const hasRemedial = !!(doc.remedialDanPengayaan?.remedial && doc.remedialDanPengayaan.remedial.trim().length > 10);
  checks.push({
    id: 'remedial',
    label: 'Program Remedial Tersedia Sesuai Template',
    isValid: hasRemedial,
    message: !hasRemedial ? 'Bagian remedial belum terisi' : undefined
  });

  // 10. Pengayaan tersedia
  const hasPengayaan = !!(doc.remedialDanPengayaan?.pengayaan && doc.remedialDanPengayaan.pengayaan.trim().length > 10);
  checks.push({
    id: 'pengayaan',
    label: 'Program Pengayaan Tersedia Sesuai Template',
    isValid: hasPengayaan,
    message: !hasPengayaan ? 'Bagian pengayaan belum terisi' : undefined
  });

  // 11. Glosarium tersedia
  const hasGlosarium = !!(doc.glosarium && doc.glosarium.length >= 2);
  checks.push({
    id: 'glosarium',
    label: 'Glosarium Istilah Penting Tersedia',
    isValid: hasGlosarium,
    message: !hasGlosarium ? 'Glosarium minimal memiliki 2 istilah' : undefined
  });

  // 12. Daftar pustaka tersedia
  const hasPustaka = !!(doc.daftarPustaka && doc.daftarPustaka.length >= 1);
  checks.push({
    id: 'pustaka',
    label: 'Daftar Pustaka Tersedia',
    isValid: hasPustaka,
    message: !hasPustaka ? 'Daftar pustaka belum diisi' : undefined
  });

  // 13. Tanda tangan tersedia
  const hasSignature = !!(
    doc.tandaTangan?.kepalaSekolahNama &&
    doc.tandaTangan?.guruNama &&
    doc.tandaTangan?.tempatTanggal
  );
  checks.push({
    id: 'signature',
    label: 'Tanda Tangan Kepala Sekolah & Guru Tersedia',
    isValid: hasSignature,
    message: !hasSignature ? 'Nama dan NIP penandatangan belum lengkap' : undefined
  });

  const passed = checks.filter((c) => c.isValid).length;
  return {
    isValid: passed === checks.length,
    totalChecks: checks.length,
    passedChecks: passed,
    checks
  };
}
