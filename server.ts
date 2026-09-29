import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// System prompt for RPP generation matching SMK Negeri 2 Magelang format
const SYSTEM_PROMPT = `Anda adalah pakar kurikulum vokasi dan Perencanaan Pembelajaran Mendalam (PPM) untuk SMK Negeri 2 Magelang, Jawa Tengah.
Format dokumen mengikuti template resmi "format perangkat.docx" SMK Negeri 2 Magelang.
Prinsip utama:
1. CP (Capaian Pembelajaran) WAJIB dipertahankan penuh sesuai PROTA guru, jangan mengubah substansi.
2. Dimensi Profil Lulusan (8 dimensi) dipilih hanya yang relevan dan terbukti muncul dalam kegiatan nyata.
3. Alokasi waktu harus terhitung presisi dalam menit: Pendahuluan + Inti (jumlah fase) + Penutup = Total Alokasi (JP x 45 menit).
4. Kegiatan Inti: Jika model Project Based Learning (PjBL), gunakan 6 fase (Pertanyaan Mendasar, Menyusun Rencana Projek, Membuat Jadwal, Pelaksanaan Projek, Menguji Projek, Evaluasi Projek). Jika model lain, gunakan tahapan model tersebut dalam payung Memahami, Mengaplikasi, dan Merefleksi.
5. Aktivitas harus spesifik terhadap mata pelajaran, elemen, dan materi (misal jika coding PHP/Looping maka harus ada koding, debugging, algoritma, bukan aktivitas generik).
6. Tujuan Pembelajaran WAJIB diawali frasa "Murid mampu ...", spesifik, terukur, dan operasional (ABCD / KKO Bloom/Anderson).
7. Karakteristik Mapel mencakup 5 poin: Jenis pengetahuan, Relevansi kehidupan nyata, Tingkat kesulitan, Struktur Materi, Integrasi Nilai dan karakter.
8. Output WAJIB berupa JSON murni sesuai skema.`;

// Helper for deterministic pedagogical fallback if Gemini API is unavailable
function generateFallbackRPP(params: any) {
  const { school, teacher, cpItem, modelPembelajaran = 'Project Based Learning (PjBL)', jumlahJp = 6, durasiJp = 45 } = params;
  const totalMenit = Number(jumlahJp) * Number(durasiJp);
  const pendahuluanWaktu = Math.max(15, Math.round(totalMenit * 0.1 / 5) * 5);
  const penutupWaktu = Math.max(15, Math.round(totalMenit * 0.1 / 5) * 5);
  const intiWaktu = totalMenit - pendahuluanWaktu - penutupWaktu;

  const mapel = teacher?.mataPelajaran || 'Mata Pelajaran Produktif';
  const elemen = cpItem?.elemen || 'Elemen Kejuruan';
  const materi = cpItem?.materi || 'Materi Pokok Pembelajaran';
  const cpText = cpItem?.cp || 'Capaian Pembelajaran sesuai kurikulum operasional sekolah.';
  const tpText = cpItem?.tp || `Murid mampu mengidentifikasi, mengoperasikan, dan mengevaluasi penerapan ${materi} secara mandiri dan kolaboratif.`;

  // Distribute 6 phases for PjBL
  const phaseTimes = [
    Math.round(intiWaktu * 0.15 / 5) * 5,
    Math.round(intiWaktu * 0.15 / 5) * 5,
    Math.round(intiWaktu * 0.15 / 5) * 5,
    Math.round(intiWaktu * 0.30 / 5) * 5,
    Math.round(intiWaktu * 0.15 / 5) * 5,
    0
  ];
  const allocated = phaseTimes[0] + phaseTimes[1] + phaseTimes[2] + phaseTimes[3] + phaseTimes[4];
  phaseTimes[5] = intiWaktu - allocated;

  return {
    dimensiProfilLulusan: {
      keimanan: true,
      kewarganegaraan: false,
      penalaranKritis: true,
      kreatif: true,
      kolaborasi: true,
      kemandirian: true,
      kesehatan: false,
      komunikasi: true,
      catatanBukti: `Dimensi Penalaran Kritis tampak saat menganalisis studi kasus ${materi}. Kreatif & Mandiri muncul saat implementasi projek. Kolaborasi & Komunikasi terasah saat presentasi dan pengujian unjuk kerja.`
    },
    karakteristik: {
      jenisPengetahuan: `Pengetahuan konseptual, prosedural, dan metakognitif terkait struktur dan implementasi ${materi} pada bidang keahlian ${teacher?.programKeahlian || 'SMK'}.`,
      relevansiKehidupanNyata: `Keterampilan pada materi ${materi} diaplikasikan langsung pada standar operasional industri (DU-DI) dan pemecahan kasus nyata di masyarakat.`,
      tingkatKesulitan: `Tingkat kesulitan menengah ke tinggi (C3 s.d C5 Bloom), menuntut pemikiran analisis logika, sintesis prosedur, serta pengujian sistem secara presisi.`,
      strukturMateri: `Materi disusun secara hierarkis: pemahaman konsep dasar ${materi}, analisis arsitektur/sintaks, implementasi studi kasus terarah, hingga perancangan karya projek terintegrasi.`,
      integrasiNilaiKarakter: `Menanamkan integritas (kejujuran dalam pengerjaan tugas), ketelitian, budaya kerja industri 5R (Ringkas, Rapi, Resik, Rawat, Rajin), serta tanggung jawab profesional.`
    },
    capaianPembelajaran: cpText,
    tujuanPembelajaran: [
      `Murid mampu menjelaskan konsep dasar dan fungsi ${materi} secara komprehensif.`,
      `Murid mampu menganalisis studi kasus dan memecahkan permasalahan teknis pada ${materi} dengan bernalar kritis.`,
      `Murid mampu merancang dan mengimplementasikan projek ${materi} sesuai spesifikasi kebutuhan secara mandiri dan kreatif.`,
      `Murid mampu menguji, mengevaluasi unjuk kerja sistem, dan mempresentasikan hasil projek ${materi} secara kolaboratif.`
    ],
    kemitraan: {
      lingkunganSekolah: `Guru mata pelajaran umum/kejuruan, laboratorium komputer/praktik kejuruan SMK N 2 Magelang, perpustakaan.`,
      lingkunganLuarSekolah: `Dunia Usaha / Dunia Industri (DU-DI) mitra SMK Negeri 2 Magelang dan praktisi industri.`,
      masyarakat: `Orang tua yang dapat membantu memberikan data kontekstual dan dukungan belajar mandiri murid.`
    },
    pemanfaatanDigital: {
      perencanaan: `Youtube, LMS, Tool Online (Mentimeter, Quizizz, Padlet, Random Name Picker, Wordwall, Canva)`,
      pelaksanaan: `LMS SMK Negeri 2 Magelang, Video Pembelajaran, Software Praktik Kejuruan, Padlet`,
      asesmen: `Quizizz, Google Forms, Portofolio Digital, Rubrik Penilaian Kinerja LMS`
    },
    pengalamanPembelajaran: {
      pendahuluan: {
        waktu: `${pendahuluanWaktu} menit`,
        waktuMenit: pendahuluanWaktu,
        deskripsi: `1. Guru membuka kegiatan pembelajaran dengan mengucapkan salam.\n2. Ketua kelas memimpin doa.\n3. Guru melakukan presensi kelas dan menanyakan kabar.\n4. Ketua kelas memimpin pagi ceria kebiasaan hebat (SAIH/Lagu Indonesia Raya).\n5. Guru membuka pembelajaran dengan pertanyaan reflektif yang mengundang murid untuk merenung tentang pengalaman pribadi terkait materi ${materi}: "Coba pikirkan sejenak apakah Anda sudah memahami bagaimana cara kerja ${materi} pada sistem industri? Apa yang Anda harapkan dari pembelajaran ini?" (mindful).\n6. Guru menyampaikan tujuan pembelajaran yang ingin dicapai.`
      },
      kegiatanInti: [
        {
          fase: `Fase 1. Pertanyaan mendasar (Memahami)`,
          waktu: `${phaseTimes[0]} menit`,
          waktuMenit: phaseTimes[0],
          deskripsi: `1. Guru memulai kegiatan dengan memberi rangsangan kepada murid tentang pentingnya materi ${materi} melalui video youtube (meaningful).\n2. Murid diberi permasalahan yang akan dipecahkan secara berkelompok (meaningful).\n3. Murid diajak untuk berfikir kritis dan menghubungkan materi pembelajaran dengan pengalaman nyata (meaningful).`
        },
        {
          fase: `Fase 2. Menyusun Rencana Projek (Memahami)`,
          waktu: `${phaseTimes[1]} menit`,
          waktuMenit: phaseTimes[1],
          deskripsi: `1. Murid berdiskusi kelompok membahas permasalahan yang diberikan oleh guru (joyful).\n2. Murid menyusun rencana projek ${materi} berdasar permasalahan yang diberikan (meaningful).`
        },
        {
          fase: `Fase 3. Membuat Jadwal (Mengaplikasi)`,
          waktu: `${phaseTimes[2]} menit`,
          waktuMenit: phaseTimes[2],
          deskripsi: `1. Murid secara berkelompok membuat jadwal projek ${materi} untuk masing-masing anggota kelompok (mindful).\n2. Anggota kelompok menyepakati jadwal yang telah disusun (joyful).\n3. Murid menetapkan jadwal yang telah disepakati (meaningful).`
        },
        {
          fase: `Fase 4. Pelaksanaan Projek (Mengaplikasi)`,
          waktu: `${phaseTimes[3]} menit`,
          waktuMenit: phaseTimes[3],
          deskripsi: `1. Murid melaksanakan projek sesuai jadwal yang ditetapkan (meaningful).\n2. Guru memantau pelaksanaan projek oleh murid sesuai jadwal.`
        },
        {
          fase: `Fase 5. Menguji Projek (Merefleksi)`,
          waktu: `${phaseTimes[4]} menit`,
          waktuMenit: phaseTimes[4],
          deskripsi: `1. Murid melakukan unjuk kerja ${materi} (meaningful).\n2. Guru melakukan penilaian unjuk kerja menggunakan instrumen.`
        },
        {
          fase: `Fase 6. Evaluasi Projek (Merefleksi)`,
          waktu: `${phaseTimes[5]} menit`,
          waktuMenit: phaseTimes[5],
          deskripsi: `1. Guru meminta murid untuk saling mengapresiasi terhadap murid yang telah selesai unjuk kerja ${materi}.\n2. Guru meminta murid untuk merefleksikan projek yang telah mereka lakukan (mindful).\n3. Guru memberikan penguatan (meaningful).`
        }
      ],
      penutup: {
        waktu: `${penutupWaktu} menit`,
        waktuMenit: penutupWaktu,
        deskripsi: `1. Piket kebersihan membersihkan ruang/lab (mindful-kesadaran diri).\n2. Guru beserta murid melakukan refleksi mengenai pembelajaran yang telah dilakukan.\n3. Guru menginformasikan tujuan pembelajaran yang akan dibahas pada pertemuan berikutnya.\n4. Guru menutup pembelajaran dengan salam.\n5. Ketua kelas memimpin doa penutup.`
      },
      totalWaktuMenit: totalMenit
    },
    asesmen: {
      asesmenAwal: `Kuis singkat pengetahuan awal tentang ${materi} via platform digital (Quizizz/lisan).`,
      asesmenProses: `Diskusi, Presentasi, Observasi sikap dan kinerja LKPD saat pengerjaan projek.`,
      asesmenAkhir: `Presentasi, Gelar Karya, Uji Unjuk Kerja produk ${materi} dengan rubrik penilaian.`
    },
    remedialDanPengayaan: {
      remedial: `a. Remidial dilakukan bagi murid yang capaian pembelajarannya belum mencapai KKTP, yaitu nilai < ${params.kktp || 75}.\nb. Tahapan pembelajaran dilaksanakan melalui remidial, tutor sebaya, tugas, dan diakhiri dengan test.\nc. Test remidial dilakukan sebanyak 1 kali dan apabila setelah 1 kali test remidial belum mencapai ketuntasan, maka remidial dilakukan dalam bentuk tugas tanpa tes tertulis kembali.`,
      pengayaan: `a. Peserta didik yang mendapat pengayaan adalah yang mendapatkan nilai ≥ ${params.kktp || 75}.\nb. Guru memberikan nasihat agar tetap rendah hati, karena telah mencapai KKTP.\nc. Guru memberikan soal pengayaan atau tantangan baru berbasis peningkatan kompleksitas.`
    },
    glosarium: [
      { istilah: elemen, definisi: `Bagian kompetensi atau pilar keilmuan utama yang menjadi fokus capaian pembelajaran pada mata pelajaran kejuruan.` },
      { istilah: materi, definisi: `Materi pokok atau topik inti yang dipelajari dan dipraktikkan murid dalam unit perencanaan pembelajaran ini.` },
      { istilah: `Project Based Learning`, definisi: `Model pembelajaran yang menggunakan projek riil sebagai media utama untuk mencapai kompetensi pengetahuan, keterampilan, dan sikap.` },
      { istilah: `Asesmen Formatif`, definisi: `Proses evaluasi berkelanjutan selama proses pembelajaran untuk memberikan umpan balik perbaikan bagi murid dan guru.` },
      { istilah: `Asesmen Sumatif`, definisi: `Penilaian hasil belajar pada akhir unit pembelajaran untuk mengukur ketercapaian tujuan pembelajaran secara komprehensif.` },
      { istilah: `KKTP`, definisi: `Kriteria Ketercapaian Tujuan Pembelajaran sebagai acuan standar ketuntasan kompetensi murid.` }
    ],
    daftarPustaka: [
      `Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2024). Panduan Pembelajaran dan Asesmen Kurikulum Merdeka SMK. Jakarta: BSKAP.`,
      `Direktorat SMK. (2024). Modul Ajar dan Bahan Ajar Konsentrasi Keahlian ${teacher?.programKeahlian || 'SMK'}. Jakarta: Kemendikbudristek.`,
      `Sutrisno, E., dkk. (2023). Buku Teks Kejuruan ${mapel} untuk SMK/MAK Kelas ${teacher?.kelas || 'XI'}. Surakarta: Penerbit Erlangga/Yudhistira.`,
      `Dokumentasi Resmi dan Sumber Digital Terbuka: Standar Industri & Modul Operasional Lab SMK Negeri 2 Magelang.`
    ]
  };
}

// POST /api/generate-rpp: Generate complete RPP with Gemini or intelligent fallback
app.post('/api/generate-rpp', async (req, res) => {
  try {
    const { school, teacher, cpItem, modelPembelajaran, jumlahJp, durasiJp, kktp, tanggalRpp } = req.body;

    if (!cpItem || !cpItem.cp) {
      return res.status(400).json({ error: 'Data Capaian Pembelajaran (CP) wajib disediakan.' });
    }

    const totalJp = Number(jumlahJp) || 6;
    const durasi = Number(durasiJp) || 45;
    const totalMenit = totalJp * durasi;

    if (!ai) {
      console.log('Gemini API key not found in env, using rule-based curriculum engine.');
      const fallbackResult = generateFallbackRPP(req.body);
      return res.json({ rpp: fallbackResult, source: 'curriculum-engine' });
    }

    const prompt = `Buatkan RPP Perencanaan Pembelajaran Mendalam lengkap untuk SMK Negeri 2 Magelang dengan data berikut:
SEKOLAH: ${school?.namaSekolah || 'SMK Negeri 2 Magelang'}
MATA PELAJARAN: ${teacher?.mataPelajaran || 'Mata Pelajaran Kejuruan'}
PROGRAM KEAHLIAN: ${teacher?.programKeahlian || 'Teknik Komputer / Manajemen'}
FASE / KELAS / SEMESTER: ${teacher?.fase || 'Fase F'} / ${teacher?.kelas || 'Kelas XI'} / ${teacher?.semester || 'Semester Ganjil'}
ELEMEN: ${cpItem.elemen || ''}
CAPAIAN PEMBELAJARAN (CP): ${cpItem.cp}
TUJUAN PEMBELAJARAN (TP) DARI PROTA: ${cpItem.tp || 'Tentukan TP spesifik berdasarkan CP ini'}
MATERI DARI PROTA: ${cpItem.materi || ''}
MODEL PEMBELAJARAN: ${modelPembelajaran || 'Project Based Learning (PjBL)'}
ALOKASI WAKTU: ${totalJp} JP x ${durasi} Menit = ${totalMenit} Menit.
KKTP: ${kktp || 75}
TANGGAL DOKUMEN: ${tanggalRpp || 'Kota Magelang'}

Instruksi khusus alokasi waktu:
- Total waktu WAJIB tepat ${totalMenit} menit!
- Pendahuluan: hitung menit (misal 15-20 menit).
- Penutup: hitung menit (misal 15-20 menit).
- Kegiatan Inti: sisa menit (${totalMenit} - Pendahuluan - Penutup) dibagi ke setiap fase secara realistis. Jumlah seluruh waktu harus pas ${totalMenit} menit.

Instruksi Profil Lulusan:
- Pilih HANYA dimensi yang benar-benar relevan dari 8 dimensi (Keimanan, Kewarganegaraan, Penalaran Kritis, Kreatif, Kolaborasi, Kemandirian, Kesehatan, Komunikasi).
- Aturan wajib: Dimensi yang tidak termasuk harus diset false, karena pada format resmi SMK Negeri 2 Magelang dimensi yang tidak termasuk akan dihapus dari tabel! Hanya dimensi terpilih yang ditampilkan.
- Berikan deskripsi catatan bukti aktivitasnya.

Instruksi Pengalaman Pembelajaran:
- Buat aktivitas guru dan murid secara detail dan kontekstual ke materi ${cpItem.materi || cpItem.elemen}, hindari kata-kata generik hampa.
- Pendahuluan bernuansa Mindful, Meaningful, Joyful.

Kembalikan respon JSON dengan struktur yang ditentukan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dimensiProfilLulusan: {
              type: Type.OBJECT,
              properties: {
                keimanan: { type: Type.BOOLEAN },
                kewarganegaraan: { type: Type.BOOLEAN },
                penalaranKritis: { type: Type.BOOLEAN },
                kreatif: { type: Type.BOOLEAN },
                kolaborasi: { type: Type.BOOLEAN },
                kemandirian: { type: Type.BOOLEAN },
                kesehatan: { type: Type.BOOLEAN },
                komunikasi: { type: Type.BOOLEAN },
                catatanBukti: { type: Type.STRING }
              },
              required: ['keimanan', 'penalaranKritis', 'kreatif', 'kolaborasi', 'kemandirian', 'komunikasi']
            },
            karakteristik: {
              type: Type.OBJECT,
              properties: {
                jenisPengetahuan: { type: Type.STRING },
                relevansiKehidupanNyata: { type: Type.STRING },
                tingkatKesulitan: { type: Type.STRING },
                strukturMateri: { type: Type.STRING },
                integrasiNilaiKarakter: { type: Type.STRING }
              },
              required: ['jenisPengetahuan', 'relevansiKehidupanNyata', 'tingkatKesulitan', 'strukturMateri', 'integrasiNilaiKarakter']
            },
            capaianPembelajaran: { type: Type.STRING },
            tujuanPembelajaran: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            kemitraan: {
              type: Type.OBJECT,
              properties: {
                lingkunganSekolah: { type: Type.STRING },
                lingkunganLuarSekolah: { type: Type.STRING },
                masyarakat: { type: Type.STRING }
              },
              required: ['lingkunganSekolah', 'lingkunganLuarSekolah', 'masyarakat']
            },
            pemanfaatanDigital: {
              type: Type.OBJECT,
              properties: {
                perencanaan: { type: Type.STRING },
                pelaksanaan: { type: Type.STRING },
                asesmen: { type: Type.STRING }
              },
              required: ['perencanaan', 'pelaksanaan', 'asesmen']
            },
            pengalamanPembelajaran: {
              type: Type.OBJECT,
              properties: {
                pendahuluan: {
                  type: Type.OBJECT,
                  properties: {
                    waktu: { type: Type.STRING },
                    waktuMenit: { type: Type.NUMBER },
                    deskripsi: { type: Type.STRING }
                  },
                  required: ['waktu', 'deskripsi']
                },
                kegiatanInti: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      fase: { type: Type.STRING },
                      waktu: { type: Type.STRING },
                      waktuMenit: { type: Type.NUMBER },
                      deskripsi: { type: Type.STRING }
                    },
                    required: ['fase', 'waktu', 'deskripsi']
                  }
                },
                penutup: {
                  type: Type.OBJECT,
                  properties: {
                    waktu: { type: Type.STRING },
                    waktuMenit: { type: Type.NUMBER },
                    deskripsi: { type: Type.STRING }
                  },
                  required: ['waktu', 'deskripsi']
                },
                totalWaktuMenit: { type: Type.NUMBER }
              },
              required: ['pendahuluan', 'kegiatanInti', 'penutup']
            },
            asesmen: {
              type: Type.OBJECT,
              properties: {
                asesmenAwal: { type: Type.STRING },
                asesmenProses: { type: Type.STRING },
                asesmenAkhir: { type: Type.STRING }
              },
              required: ['asesmenAwal', 'asesmenProses', 'asesmenAkhir']
            },
            remedialDanPengayaan: {
              type: Type.OBJECT,
              properties: {
                remedial: { type: Type.STRING },
                pengayaan: { type: Type.STRING }
              },
              required: ['remedial', 'pengayaan']
            },
            glosarium: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  istilah: { type: Type.STRING },
                  definisi: { type: Type.STRING }
                },
                required: ['istilah', 'definisi']
              }
            },
            daftarPustaka: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'dimensiProfilLulusan',
            'karakteristik',
            'capaianPembelajaran',
            'tujuanPembelajaran',
            'kemitraan',
            'pemanfaatanDigital',
            'pengalamanPembelajaran',
            'asesmen',
            'remedialDanPengayaan',
            'glosarium',
            'daftarPustaka'
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(text);
    // Ensure CP is kept intact from PROTA
    parsed.capaianPembelajaran = cpItem.cp;
    return res.json({ rpp: parsed, source: 'gemini' });
  } catch (err: any) {
    console.error('Error generating RPP via Gemini, using fallback:', err?.message);
    const fallback = generateFallbackRPP(req.body);
    return res.json({ rpp: fallback, source: 'fallback', warning: err?.message });
  }
});

// POST /api/regenerate-section: Regenerate only a single specific section
app.post('/api/regenerate-section', async (req, res) => {
  try {
    const { section, cpItem, teacher, modelPembelajaran, jumlahJp, durasiJp, kktp } = req.body;
    const totalMenit = (Number(jumlahJp) || 4) * (Number(durasiJp) || 45);

    if (!ai) {
      const fullFallback = generateFallbackRPP({ cpItem, teacher, modelPembelajaran, jumlahJp, durasiJp, kktp });
      const secData = (fullFallback as any)[section];
      return res.json({ section, data: secData, source: 'curriculum-engine' });
    }

    const prompt = `Hasilkan ulang HANYA bagian "${section}" untuk RPP SMK Negeri 2 Magelang.
MATA PELAJARAN: ${teacher?.mataPelajaran || ''}
ELEMEN: ${cpItem?.elemen || ''}
MATERI: ${cpItem?.materi || ''}
CP: ${cpItem?.cp || ''}
MODEL PEMBELAJARAN: ${modelPembelajaran || 'Project Based Learning (PjBL)'}
ALOKASI WAKTU TOTAL: ${totalMenit} Menit.
BAGIAN YANG DI-GENERATE: ${section}.
Berikan konten yang sangat spesifik, bermakna, dan berkualitas tinggi dalam format JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    const resultData = parsed[section] || parsed.data || parsed;
    return res.json({ section, data: resultData, source: 'gemini' });
  } catch (err: any) {
    console.error('Error regenerating section:', err?.message);
    const fullFallback = generateFallbackRPP(req.body);
    const secData = (fullFallback as any)[req.body.section] || {};
    return res.json({ section: req.body.section, data: secData, source: 'fallback', warning: err?.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!ai,
    school: 'SMK NEGERI 2 MAGELANG',
    template: 'format perangkat.docx'
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RPP AUTO GENERATOR] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
