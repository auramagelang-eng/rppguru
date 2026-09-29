import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { CPItem } from '../types/rpp';

export interface ColumnMapping {
  elemen: string;
  cp: string;
  tp: string;
  materi: string;
  alokasiWaktu: string;
  semester: string;
}

export interface ParseResult {
  headers: string[];
  rawRows: Record<string, any>[];
  detectedMapping: ColumnMapping;
  items: CPItem[];
  title?: string;
}

// Normalize strings for matching
const norm = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Auto-guess the best column match
export function guessColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    elemen: '',
    cp: '',
    tp: '',
    materi: '',
    alokasiWaktu: '',
    semester: '',
  };

  headers.forEach((h) => {
    const n = norm(h);
    if (!mapping.elemen && (n.includes('elemen') || n.includes('lingkup') || n.includes('domain'))) {
      mapping.elemen = h;
    } else if (!mapping.cp && (n.includes('cp') || n.includes('capaian') || n.includes('kompetensi'))) {
      mapping.cp = h;
    } else if (!mapping.tp && (n.includes('tp') || n.includes('tujuan') || n.includes('indikator'))) {
      mapping.tp = h;
    } else if (!mapping.materi && (n.includes('materi') || n.includes('pokok') || n.includes('topik') || n.includes('konten'))) {
      mapping.materi = h;
    } else if (!mapping.alokasiWaktu && (n.includes('waktu') || n.includes('jp') || n.includes('jam') || n.includes('alokasi'))) {
      mapping.alokasiWaktu = h;
    } else if (!mapping.semester && (n.includes('semester') || n.includes('smt') || n.includes('smtr'))) {
      mapping.semester = h;
    }
  });

  // Fallbacks if not matched
  if (!mapping.elemen && headers[0]) mapping.elemen = headers[0];
  if (!mapping.cp && headers[1]) mapping.cp = headers[1];
  if (!mapping.tp && headers[2]) mapping.tp = headers[2];
  if (!mapping.materi && headers[3]) mapping.materi = headers[3];
  if (!mapping.alokasiWaktu && headers[4]) mapping.alokasiWaktu = headers[4];
  if (!mapping.semester && headers[5]) mapping.semester = headers[5];

  return mapping;
}

export function buildCpItemsFromRows(rows: Record<string, any>[], mapping: ColumnMapping): CPItem[] {
  const items: CPItem[] = [];

  rows.forEach((row, idx) => {
    const rawCp = String(row[mapping.cp] || '').trim();
    const rawElemen = String(row[mapping.elemen] || '').trim();
    const rawTp = String(row[mapping.tp] || '').trim();
    const rawMateri = String(row[mapping.materi] || '').trim();
    const rawWaktu = String(row[mapping.alokasiWaktu] || '4 JP').trim();
    const rawSemester = String(row[mapping.semester] || 'Ganjil').trim();

    // Skip empty rows
    if (!rawCp && !rawMateri && !rawElemen) {
      return;
    }

    // Extract numeric JP
    const matchJp = rawWaktu.match(/(\d+)/);
    const jp = matchJp ? parseInt(matchJp[1], 10) : 4;

    items.push({
      id: `cp-row-${Date.now()}-${idx + 1}`,
      no: items.length + 1,
      elemen: rawElemen || `Elemen ${items.length + 1}`,
      cp: rawCp || rawMateri || 'Capaian Pembelajaran sesuai kurikulum.',
      tp: rawTp || (rawMateri ? `Murid mampu mengidentifikasi dan mengimplementasikan ${rawMateri}.` : ''),
      materi: rawMateri || rawElemen || `Materi Pokok ${items.length + 1}`,
      alokasiWaktu: rawWaktu.includes('JP') ? rawWaktu : `${jp} JP`,
      jp,
      semester: rawSemester.toLowerCase().includes('genap') || rawSemester.includes('2') ? 'Genap' : 'Ganjil',
      status: 'belum'
    });
  });

  return items;
}

export async function parseExcelOrCsvFile(file: File): Promise<ParseResult> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to array of arrays first to find the header row
  const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  if (!rawData || rawData.length === 0) {
    throw new Error('File tidak memiliki data atau kosong.');
  }

  // Find header row (the first row with at least 2 non-empty string cells)
  let headerIndex = 0;
  for (let i = 0; i < Math.min(10, rawData.length); i++) {
    const row = rawData[i];
    if (Array.isArray(row)) {
      const stringCount = row.filter((c) => typeof c === 'string' && c.trim().length > 0).length;
      if (stringCount >= 2) {
        headerIndex = i;
        break;
      }
    }
  }

  const headerRow = rawData[headerIndex] || [];
  const headers = headerRow.map((cell: any, i: number) => {
    const val = String(cell || '').trim();
    return val || `Kolom_${i + 1}`;
  });

  // Parse rows as objects
  const rawRows: Record<string, any>[] = [];
  for (let r = headerIndex + 1; r < rawData.length; r++) {
    const row = rawData[r];
    if (!Array.isArray(row) || row.every((c) => c === undefined || c === null || String(c).trim() === '')) {
      continue;
    }
    const rowObj: Record<string, any> = {};
    headers.forEach((h, colIdx) => {
      rowObj[h] = row[colIdx] !== undefined ? String(row[colIdx]).trim() : '';
    });
    rawRows.push(rowObj);
  }

  const detectedMapping = guessColumnMapping(headers);
  const items = buildCpItemsFromRows(rawRows, detectedMapping);

  return {
    headers,
    rawRows,
    detectedMapping,
    items,
    title: file.name.replace(/\.[^/.]+$/, '')
  };
}

export async function parseDocxFile(file: File): Promise<ParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  const rawRows: Record<string, any>[] = [];
  let currentElemen = '';
  let currentCp = '';
  let currentTp = '';
  let currentMateri = '';

  // Scan lines for common patterns
  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (lower.startsWith('elemen:') || lower.startsWith('elemen :')) {
      if (currentCp || currentMateri) {
        rawRows.push({
          Elemen: currentElemen,
          'Capaian Pembelajaran': currentCp,
          'Tujuan Pembelajaran': currentTp,
          Materi: currentMateri,
          'Alokasi Waktu': '4 JP',
          Semester: 'Ganjil'
        });
        currentCp = '';
        currentTp = '';
        currentMateri = '';
      }
      currentElemen = line.split(':')[1]?.trim() || line;
    } else if (lower.startsWith('cp:') || lower.startsWith('capaian:') || lower.includes('peserta didik mampu')) {
      currentCp = currentCp ? `${currentCp} ${line}` : line;
    } else if (lower.startsWith('tp:') || lower.startsWith('tujuan:') || lower.includes('murid mampu')) {
      currentTp = currentTp ? `${currentTp} ${line}` : line;
    } else if (lower.startsWith('materi:') || lower.startsWith('topik:')) {
      currentMateri = line.split(':')[1]?.trim() || line;
    } else if (line.length > 20) {
      if (!currentCp) currentCp = line;
      else if (!currentMateri) currentMateri = line;
    }
  });

  if (currentCp || currentMateri) {
    rawRows.push({
      Elemen: currentElemen || 'Elemen Pembelajaran',
      'Capaian Pembelajaran': currentCp || 'Capaian Pembelajaran',
      'Tujuan Pembelajaran': currentTp,
      Materi: currentMateri || 'Materi Pokok',
      'Alokasi Waktu': '4 JP',
      Semester: 'Ganjil'
    });
  }

  // If very few rows extracted from text, create at least 1 valid row from the docx content
  if (rawRows.length === 0 && lines.length > 0) {
    rawRows.push({
      Elemen: 'Elemen Kurikulum SMK',
      'Capaian Pembelajaran': lines.slice(0, 3).join(' '),
      'Tujuan Pembelajaran': 'Murid mampu memahami kompetensi inti materi.',
      Materi: lines[0] || 'Materi Pembelajaran',
      'Alokasi Waktu': '4 JP',
      Semester: 'Ganjil'
    });
  }

  const headers = ['Elemen', 'Capaian Pembelajaran', 'Tujuan Pembelajaran', 'Materi', 'Alokasi Waktu', 'Semester'];
  const detectedMapping: ColumnMapping = {
    elemen: 'Elemen',
    cp: 'Capaian Pembelajaran',
    tp: 'Tujuan Pembelajaran',
    materi: 'Materi',
    alokasiWaktu: 'Alokasi Waktu',
    semester: 'Semester'
  };

  const items = buildCpItemsFromRows(rawRows, detectedMapping);

  return {
    headers,
    rawRows,
    detectedMapping,
    items,
    title: file.name.replace(/\.[^/.]+$/, '')
  };
}

// Download Excel Template for teachers
export function downloadProtaTemplateExcel() {
  const sampleData = [
    {
      'No': 1,
      'Elemen': 'Pemrograman Web Sisi Server',
      'Capaian Pembelajaran': 'Pada akhir fase F, peserta didik mampu memahami konsep pemrograman web sisi server, menerapkan struktur kontrol perulangan (looping), array, dan pengolahan form PHP secara aman.',
      'Tujuan Pembelajaran': 'Murid mampu merancang dan menerapkan algoritma perulangan PHP (for, while, foreach) untuk mengolah data dinamis.',
      'Materi': 'PHP Looping & Struktur Kendali Perulangan',
      'Alokasi Waktu': '4 JP',
      'Semester': 'Ganjil'
    },
    {
      'No': 2,
      'Elemen': 'Basis Data Relasional & CRUD',
      'Capaian Pembelajaran': 'Pada akhir fase F, peserta didik mampu mengintegrasikan aplikasi web dengan sistem basis data relasional MySQL serta menerapkan operasi CRUD dengan prepared statement.',
      'Tujuan Pembelajaran': 'Murid mampu membangun modul CRUD interaktif terhubung basis data MySQL secara teruji.',
      'Materi': 'Operasi CRUD PHP & Basis Data MySQL',
      'Alokasi Waktu': '6 JP',
      'Semester': 'Ganjil'
    },
    {
      'No': 3,
      'Elemen': 'Antarmuka Pengguna Klien',
      'Capaian Pembelajaran': 'Pada akhir fase F, peserta didik mampu merancang antarmuka pengguna web responsif berbasis CSS framework dan JavaScript DOM manipulation.',
      'Tujuan Pembelajaran': 'Murid mampu membuat tampilan web responsif modern yang estetik dan interaktif.',
      'Materi': 'Desain Web Responsif & DOM JavaScript',
      'Alokasi Waktu': '4 JP',
      'Semester': 'Ganjil'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PROTA SMK N 2 MGL');
  XLSX.writeFile(wb, 'Format_PROTA_SMKN2_Magelang.xlsx');
}
