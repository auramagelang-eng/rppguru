import { SchoolProfile, TeacherProfile, LearningSettings, ProtaData, RPPDocument } from '../types/rpp';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  namaSekolah: 'SMK NEGERI 2 MAGELANG',
  npsn: '20327618',
  alamat: 'Jl. A Yani 135A, Kramat Selatan, Kec. Magelang Utara',
  kotaKabupaten: 'Kota Magelang',
  provinsi: 'Jawa Tengah',
  tahunAjaran: '2026/2027',
  namaKepalaSekolah: 'Kurniawan Basuki, S.Pd., M.T',
  nipKepalaSekolah: '196709291990031013'
};

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  namaGuru: 'Ahmad Syaefudin, S.Kom',
  nip: '199301062022211009',
  mataPelajaran: 'Pemrograman WEB',
  programKeahlian: 'Pengembangan Perangkat Lunak dan GIM (PPLG)',
  fase: 'Fase F',
  kelas: 'XI PPLG',
  semester: 'Ganjil'
};

export const DEFAULT_LEARNING_SETTINGS: LearningSettings = {
  modelPembelajaran: 'Project Based Learning (PjBL)',
  jumlahJp: 6,
  durasiJp: 45,
  kktp: 75,
  tanggalRpp: '13 Juli 2026'
};

// MASTER PROTA 2026/2027 - Pemrograman WEB Fase F
export const SAMPLE_PROTA_PPLG: ProtaData = {
  id: 'prota-pplg-xi-2026-2027',
  title: 'PROTA Pemrograman WEB Fase F Kelas XI Tahun Ajaran 2026/2027',
  mataPelajaran: 'Pemrograman WEB',
  kelas: 'XI PPLG',
  tahunAjaran: '2026/2027',
  uploadedAt: new Date().toISOString(),
  items: [
    {
      id: 'cp-pplg-2026-1',
      no: 1,
      elemen: 'Pemrograman Web Sisi Server',
      cp: 'Pada akhir fase F, peserta didik mampu menerapkan sintaks dasar PHP, variabel, tipe data, operator logika dan aritmatika, struktur kontrol percabangan (if-else, switch), perulangan (for, while, foreach), serta pembuatan dan pemanggilan fungsi (user-defined functions) dalam perancangan algoritma pemrograman web sisi server.',
      tp: 'Murid mampu menerapkan variabel, operator, percabangan, perulangan, dan fungsi dalam PHP untuk membangun modul logika perhitungan dan pengolahan data web dinamis secara teliti dan bernalar kritis.',
      materi: 'Variabel, Operator, Percabangan, Perulangan, dan Fungsi dalam PHP',
      alokasiWaktu: '6 JP',
      jp: 6,
      semester: 'Ganjil',
      status: 'selesai',
      rppId: 'rpp-cp-1-2026'
    },
    {
      id: 'cp-pplg-2026-2',
      no: 2,
      elemen: 'Pemrosesan Form dan Validasi Data Web',
      cp: 'Pada akhir fase F, peserta didik mampu mengimplementasikan penerimaan data form HTML (metode GET dan POST), teknik validasi input wajib/format data, sanitasi karakter berbahaya (htmlspecialchars, filter_input) untuk mencegah serangan XSS, serta menampilkan umpan balik validasi yang ramah pengguna.',
      tp: 'Murid mampu merancang form interaktif dan menerapkan validasi serta sanitasi data input sisi server pada form web secara mandiri dan aman.',
      materi: 'Pemrosesan Form, Validasi Data, dan Sanitasi Input Sisi Server',
      alokasiWaktu: '6 JP',
      jp: 6,
      semester: 'Ganjil',
      status: 'selesai',
      rppId: 'rpp-cp-2-2026'
    },
    {
      id: 'cp-pplg-2026-3',
      no: 3,
      elemen: 'Antarmuka Web Responsif (Bootstrap Dashboard)',
      cp: 'Pada akhir fase F, peserta didik mampu merancang tata letak antarmuka pengguna (UI/UX) berbasis grid system Bootstrap, memanfaatkan komponen navigasi navbar, sidebar, card responsif, modal dialog, dan icon untuk membangun dashboard aplikasi web modern sesuai kebutuhan industri.',
      tp: 'Murid mampu membangun layout dashboard aplikasi web yang responsif, estetis, dan user-friendly menggunakan framework Bootstrap secara kreatif dan kolaboratif.',
      materi: 'Pembuatan Dashboard Web Responsif Berbasis Bootstrap',
      alokasiWaktu: '6 JP',
      jp: 6,
      semester: 'Ganjil',
      status: 'selesai',
      rppId: 'rpp-cp-3-2026'
    },
    {
      id: 'cp-pplg-2026-4',
      no: 4,
      elemen: 'Basis Data dan Integrasi CRUD (MySQL & PDO)',
      cp: 'Pada akhir fase F, peserta didik mampu mengkoneksikan aplikasi web PHP dengan database server MySQL menggunakan ekstensi PDO (PHP Data Objects), merancang query SQL relasional, serta mengimplementasikan operasi CRUD (Create, Read, Update, Delete) dengan Prepared Statements untuk mencegah SQL Injection.',
      tp: 'Murid mampu membangun modul operasi basis data CRUD (Create, Read, Update, Delete) menggunakan PHP PDO dan MySQL secara terstruktur dan aman terhadap celah injeksi data.',
      materi: 'Integrasi Basis Data MySQL dan Operasi CRUD dengan PDO Prepared Statements',
      alokasiWaktu: '6 JP',
      jp: 6,
      semester: 'Ganjil',
      status: 'selesai',
      rppId: 'rpp-cp-4-2026'
    },
    {
      id: 'cp-pplg-2026-5',
      no: 5,
      elemen: 'Keamanan Web, Otentikasi Login, dan Hak Akses',
      cp: 'Pada akhir fase F, peserta didik mampu merancang skema otentikasi pengguna berbasis database, mengamankan password menggunakan password_hash() dan password_verify(), mengelola sesi login (session start, session check, session destroy), serta menerapkan proteksi otorisasi halaman multi-level (admin/user).',
      tp: 'Murid mampu mengintegrasikan sistem otentikasi login, hashing password, session management, dan kontrol hak akses halaman web multi-user secara bertanggung jawab dan berintegritas tinggi.',
      materi: 'Otentikasi Login Pengguna, Hashing Password, Session, dan Kontrol Hak Akses',
      alokasiWaktu: '6 JP',
      jp: 6,
      semester: 'Ganjil',
      status: 'selesai',
      rppId: 'rpp-cp-5-2026'
    }
  ]
};

export const PROTA_2026_2027_PPLG = SAMPLE_PROTA_PPLG;

export const SAMPLE_PROTA_INFORMATIKA: ProtaData = {
  id: 'prota-inf-x-2026-2027',
  title: 'PROTA Informatika Fase E Kelas X Tahun Ajaran 2026/2027',
  mataPelajaran: 'Informatika',
  kelas: 'X PPLG',
  tahunAjaran: '2026/2027',
  uploadedAt: new Date().toISOString(),
  items: [
    {
      id: 'cp-inf-1',
      no: 1,
      elemen: 'Berpikir Komputasional (BK)',
      cp: 'Pada akhir fase E, peserta didik mampu menerapkan strategi algoritmik standar pada kehidupan sehari-hari maupun implementasinya dalam sistem komputasi, untuk menghasilkan beberapa solusi persoalan dengan data diskrit bervolume besar.',
      tp: 'Murid mampu menganalisis pola masalah kompleks dan memformulasikan algoritma dekomposisi serta abstraksi solusi secara terstruktur.',
      materi: 'Pilar Berpikir Komputasional dan Pemecahan Masalah Sistematis',
      alokasiWaktu: '4 JP',
      jp: 4,
      semester: 'Ganjil',
      status: 'belum'
    },
    {
      id: 'cp-inf-2',
      no: 2,
      elemen: 'Analisis Data (AD)',
      cp: 'Pada akhir fase E, peserta didik mampu memahami aspek privasi dan keamanan data, mengumpulkan data secara otomatis dari berbagai sumber, memodelkan data, serta menampilkan data dalam bentuk visualisasi yang bermakna.',
      tp: 'Murid mampu mengolah dataset mentah, menerapkan fungsi logika, dan menyajikan dashboard visualisasi data interaktif untuk pengambilan keputusan.',
      materi: 'Pengolahan dan Visualisasi Data Spreadsheet untuk Analisis Bisnis',
      alokasiWaktu: '4 JP',
      jp: 4,
      semester: 'Ganjil',
      status: 'belum'
    }
  ]
};

export const SAMPLE_PROTA_MPLB: ProtaData = {
  id: 'prota-mplb-x-2026-2027',
  title: 'PROTA Dasar-dasar Manajemen Perkantoran dan Layanan Bisnis Fase E Kelas X 2026/2027',
  mataPelajaran: 'Dasar-dasar Manajemen Perkantoran dan Layanan Bisnis',
  kelas: 'X MPLB',
  tahunAjaran: '2026/2027',
  uploadedAt: new Date().toISOString(),
  items: [
    {
      id: 'cp-mplb-1',
      no: 1,
      elemen: 'Pengelolaan Dokumen Berbasis Digital',
      cp: 'Pada akhir fase E, peserta didik mampu memahami konsep kearsipan digital, prosedur penyimpanan arsip elektronik, keamanan data arsip, dan retensi dokumen perkantoran modern sesuai SOP.',
      tp: 'Murid mampu mengindeks, memindai, dan menata arsip digital dalam cloud drive sesuai sistem klasifikasi arsip perkantoran secara rapi dan teliti.',
      materi: 'Klasifikasi dan Tata Kelola Arsip Elektronik (E-Filing System)',
      alokasiWaktu: '4 JP',
      jp: 4,
      semester: 'Ganjil',
      status: 'belum'
    }
  ]
};

// 5 LENGKAP & VALID PRE-GENERATED RPP DOKUMEN SESUAI PROTA 2026/2027
export const PRE_GENERATED_RPPS_2026: RPPDocument[] = [
  // --- RPP 1: PHP Variabel, Operator, Percabangan, Perulangan, Fungsi (6 JP) ---
  {
    id: 'rpp-cp-1-2026',
    cpId: 'cp-pplg-2026-1',
    protaId: 'prota-pplg-xi-2026-2027',
    createdAt: '2026-07-13T07:30:00.000Z',
    updatedAt: new Date().toISOString(),
    version: 1,
    status: 'selesai',
    sekolah: DEFAULT_SCHOOL_PROFILE,
    guru: DEFAULT_TEACHER_PROFILE,
    pengaturan: {
      modelPembelajaran: 'Project Based Learning (PjBL)',
      jumlahJp: 6,
      durasiJp: 45,
      kktp: 75,
      tanggalRpp: '13 Juli 2026'
    },
    dimensiProfilLulusan: {
      keimanan: true,
      kewarganegaraan: false,
      penalaranKritis: true,
      kreatif: true,
      kolaborasi: true,
      kemandirian: true,
      kesehatan: false,
      komunikasi: true,
      catatanBukti: 'Dimensi Penalaran Kritis tampak saat merancang algoritma percabangan dan perulangan. Kemandirian dan Kreatif terasah saat mengode fungsi perhitungan dinamis. Kolaborasi & Komunikasi terwujud saat pengujian kode berpasangan (peer code review).'
    },
    karakteristik: {
      jenisPengetahuan: 'Pengetahuan konseptual (tipe data, sintaks PHP), prosedural (penulisan struktur kontrol dan pembuatan fungsi), serta metakognitif (optimasi algoritma perulangan).',
      relevansiKehidupanNyata: 'Diaplikasikan langsung pada pembuatan modul logika bisnis web seperti kalkulator tarif ongkos kirim, diskon belanja bertingkat, dan pengolahan data array inventaris barang.',
      tingkatKesulitan: 'Tingkat kesulitan menengah (C3-C4 Bloom), menuntut pemahaman alur eksekusi logika backend dan pencegahan infinite loop.',
      strukturMateri: 'Materi terstruktur secara hierarkis: 1) Sintaks dasar & variabel PHP, 2) Operator aritmatika & logika, 3) Struktur kendali if-else & switch, 4) Looping for & foreach, 5) Pembuatan fungsi modular kustom.',
      integrasiNilaiKarakter: 'Menumbuhkan ketelitian logika (precision coding), kejujuran akademik dalam penulisan sintaks asli, budaya kerja 5R laboratorium komputer, dan pantang menyerah dalam men-debug galat (debugging mindset).'
    },
    capaianPembelajaran: 'Pada akhir fase F, peserta didik mampu menerapkan sintaks dasar PHP, variabel, tipe data, operator logika dan aritmatika, struktur kontrol percabangan (if-else, switch), perulangan (for, while, foreach), serta pembuatan dan pemanggilan fungsi (user-defined functions) dalam perancangan algoritma pemrograman web sisi server.',
    tujuanPembelajaran: [
      'Murid mampu menerapkan variabel, operator, percabangan, perulangan, dan fungsi dalam PHP untuk membangun modul logika perhitungan dan pengolahan data web dinamis secara teliti dan bernalar kritis.',
      'Murid mampu menganalisis alur algoritma kontrol percabangan dan perulangan serta memperbaiki kesalahan logika (bug) pada skrip PHP secara mandiri.',
      'Murid mampu merancang modul fungsi mandiri (user-defined function) berbasis parameter dan return value untuk menyelesaikan studi kasus aplikasi perhitungan diskon belanja.'
    ],
    kemitraan: {
      lingkunganSekolah: 'Guru mata pelajaran produktif PPLG, rekan sejawat laboratorium software, teknisi jaringan komputer SMKN 2 Magelang.',
      lingkunganLuarSekolah: 'Software house mitra industri SMK Negeri 2 Magelang (PT Gamatechno / PT Barito Integra Informatika) untuk studi kasus standar koding industri.',
      masyarakat: 'Orang tua siswa yang mendukung fasilitas belajar komputer/laptop di rumah untuk penguatan portofolio mandiri.'
    },
    pemanfaatanDigital: {
      perencanaan: 'Platform LMS SMKN 2 Magelang, repositori GitHub modul PHP dasar, video tutorial YouTube arsitektur server-side scripting.',
      pelaksanaan: 'IDE Visual Studio Code, XAMPP/PHP Server lokal, Git Bash, platform interaktif live coding Quizizz/Mentimeter.',
      asesmen: 'Google Classroom untuk pengumpulan tugas koding projek, rubrik penilaian unjuk kerja digital, dan kuis online pemahaman sintaks.'
    },
    pengalamanPembelajaran: {
      pendahuluan: {
        waktu: '20 menit',
        waktuMenit: 20,
        deskripsi: '1. Guru membuka pembelajaran dengan salam hangat, sapaan pembiasaan pagi ceria, dan doa bersama dipimpin ketua kelas.\n2. Guru memeriksa kehadiran murid, kebersihan ruang lab komputer, dan kerapian seragam sesuai SOP industri.\n3. Guru memberikan apersepsi kontekstual: menayangkan halaman checkout e-commerce dan memantik pertanyaan reflektif: "Bagaimana sistem website menghitung total diskon dan biaya kirim secara otomatis di server sebelum pembayaran?" (mindful).\n4. Guru menyampaikan tujuan pembelajaran, skenario PjBL pembuatan modul fungsi kalkulator diskon, serta kriteria KKTP (75) (6 JP = 270 Menit).'
      },
      kegiatanInti: [
        {
          fase: 'Fase 1. Pertanyaan mendasar (Memahami)',
          waktu: '30 menit',
          waktuMenit: 30,
          deskripsi: '1. Guru menyajikan studi kasus kebutuhan modul server-side: sistem perhitungan tagihan toko ritel dengan aturan diskon bertingkat (meaningful).\n2. Murid mengamati demonstrasi skrip dasar PHP dan menganalisis variabel input, operator logika, serta kapan menggunakan perulangan foreach vs for (meaningful).\n3. Murid merumuskan pertanyaan mendasar mengenai cara menstrukturkan program agar rapi menggunakan fungsi modular.'
        },
        {
          fase: 'Fase 2. Menyusun Rencana Projek (Memahami)',
          waktu: '35 menit',
          waktuMenit: 35,
          deskripsi: '1. Murid membentuk tim kerja berpasangan (pair programming) dengan penuh semangat gotong royong (joyful).\n2. Tim menyusun rencana projek: membuat aplikasi skrip PHP "Kalkulator Tagihan Belanja & Rekap Penjualan" yang memuat minimal 2 fungsi kustom, percabangan if-else bertingkat, dan perulangan foreach.\n3. Tim menetapkan pembagian peran programmer logika dan tester data uji (meaningful).'
        },
        {
          fase: 'Fase 3. Membuat Jadwal (Mengaplikasi)',
          waktu: '30 menit',
          waktuMenit: 30,
          deskripsi: '1. Murid menyusun timeline pengerjaan projek dalam 85 menit koding: 25 menit penulisan variabel & fungsi logika, 35 menit implementasi perulangan & output array, 25 menit pengujian kasus uji batas (mindful).\n2. Tim menyepakati target capaian dan mengonfirmasikan rancangan jadwal kepada guru pembimbing.'
        },
        {
          fase: 'Fase 4. Pelaksanaan Projek (Mengaplikasi)',
          waktu: '85 menit',
          waktuMenit: 85,
          deskripsi: '1. Murid mengode skrip PHP pada Visual Studio Code dan menguji eksekusi melalui web browser localhost (meaningful).\n2. Murid menerapkan struktur kendali switch/if-else dan fungsi perhitungan diskon dengan teliti.\n3. Guru berkeliling memfasilitasi mentoring klinis, memantau kendala sintaks (syntax error, undefined variable), serta mendorong murid bernalar kritis saat menelusuri bug (meaningful).'
        },
        {
          fase: 'Fase 5. Menguji Projek (Merefleksi)',
          waktu: '25 menit',
          waktuMenit: 25,
          deskripsi: '1. Setiap kelompok melakukan unjuk kerja dengan memasukkan berbagai skenario dataset belanja (normal, diskon maksimal, belanja nol).\n2. Rekan kelompok lain memberikan umpan balik (peer assessment) terkait kejelasan output, efisiensi baris kode, dan penamaan variabel yang baku (meaningful).\n3. Guru melakukan asesmen proses menggunakan rubrik unjuk kerja coding.'
        },
        {
          fase: 'Fase 6. Evaluasi Projek (Merefleksi)',
          waktu: '25 menit',
          waktuMenit: 25,
          deskripsi: '1. Murid memaparkan hasil refleksi: kendala penulisan perulangan dan bagaimana solusi fungsi modular mempermudah pembacaan kode (mindful).\n2. Guru memberikan apresiasi atas inovasi koding murid serta memberikan penguatan konsep best practice PHP standar PSR-12 (joyful).'
        }
      ],
      penutup: {
        waktu: '20 menit',
        waktuMenit: 20,
        deskripsi: '1. Murid bersama guru menyimpulkan inti pembelajaran mengenai pentingnya variabel, percabangan, perulangan, dan fungsi dalam PHP.\n2. Murid mengisi lembar refleksi 3-2-1 digital (3 hal dipahami, 2 hal menarik, 1 hal yang ingin diperdalam).\n3. Guru memberikan informasi topik pertemuan berikutnya: Penanganan Form dan Validasi Data Web.\n4. Pembelajaran ditutup dengan doa syukur dan salam penutup.'
      },
      totalWaktuMenit: 270
    },
    asesmen: {
      asesmenAwal: 'Tes diagnostik kognitif awal berupa kuis singkat 5 soal pilihan ganda di Mentimeter/Quizizz terkait pemahaman logika algoritma dan sintaks dasar server-side scripting.',
      asesmenProses: 'Observasi sikap gotong royong dan kemandirian selama pair programming, serta asesmen formatif unjuk kerja penulisan kode PHP dengan rubrik sintaks, logika, dan struktur fungsi.',
      asesmenAkhir: 'Penilaian produk projek skrip PHP modul kalkulator belanja menggunakan rubrik kebenaran output algoritma, efisiensi kode, keterpenuhan rubrik KKTP 75, dan portofolio koding GitHub.'
    },
    remedialDanPengayaan: {
      remedial: 'Bimbingan tutor sebaya dan latihan terbimbing khusus penulisan struktur if-else dan perulangan for dengan studi kasus perhitungan sederhana (1 variabel) hingga tuntas mencapai nilai KKTP 75.',
      pengayaan: 'Peserta didik yang telah melampaui KKTP ditantang untuk menerapkan array asosiatif multidimensi pada data produk serta membungkus fungsi ke dalam kelas (pengenalan awal konsep Object-Oriented Programming).'
    },
    glosarium: [
      { istilah: 'PHP (Hypertext Preprocessor)', definisi: 'Bahasa pemrograman skrip sisi server (server-side scripting) yang dirancang khusus untuk pengembangan web dinamis.' },
      { istilah: 'Looping (Perulangan)', definisi: 'Struktur kendali yang mengeksekusi satu atau beberapa blok pernyataan kode secara berulang-ulang selama kondisi tertentu bernilai benar.' },
      { istilah: 'User-Defined Function', definisi: 'Subrutin atau blok kode fungsi yang dideklarasikan oleh pemrogram untuk menjalankan tugas spesifik dan dapat dipanggil berulang kali.' },
      { istilah: 'Debugging', definisi: 'Proses mengidentifikasi, mengisolasi, dan memperbaiki kesalahan (bug/error) pada kode program perangkat lunak.' }
    ],
    daftarPustaka: [
      'The PHP Group. (2026). PHP Documentation Manual: Language Reference & Functions. php.net.',
      'Nixon, R. (2024). Learning PHP, MySQL & JavaScript with jQuery, CSS & HTML5 (6th ed.). O\'Reilly Media.',
      'Direktorat SMK Kemendikbudristek. (2024). Modul Ajar Pemrograman Web Sisi Server Fase F SMK Program Keahlian PPLG.'
    ],
    tandaTangan: {
      kepalaSekolahNama: DEFAULT_SCHOOL_PROFILE.namaKepalaSekolah,
      kepalaSekolahNip: DEFAULT_SCHOOL_PROFILE.nipKepalaSekolah,
      guruNama: DEFAULT_TEACHER_PROFILE.namaGuru,
      guruNip: DEFAULT_TEACHER_PROFILE.nip,
      tempatTanggal: `${DEFAULT_SCHOOL_PROFILE.kotaKabupaten}, 13 Juli 2026`
    }
  },

  // --- RPP 2: Penanganan Form dan Validasi Data Web (6 JP) ---
  {
    id: 'rpp-cp-2-2026',
    cpId: 'cp-pplg-2026-2',
    protaId: 'prota-pplg-xi-2026-2027',
    createdAt: '2026-07-20T07:30:00.000Z',
    updatedAt: new Date().toISOString(),
    version: 1,
    status: 'selesai',
    sekolah: DEFAULT_SCHOOL_PROFILE,
    guru: DEFAULT_TEACHER_PROFILE,
    pengaturan: {
      modelPembelajaran: 'Project Based Learning (PjBL)',
      jumlahJp: 6,
      durasiJp: 45,
      kktp: 75,
      tanggalRpp: '20 Juli 2026'
    },
    dimensiProfilLulusan: {
      keimanan: true,
      kewarganegaraan: false,
      penalaranKritis: true,
      kreatif: true,
      kolaborasi: false,
      kemandirian: true,
      kesehatan: false,
      komunikasi: true,
      catatanBukti: 'Penalaran Kritis tampak saat menganalisis celah keamanan Cross-Site Scripting (XSS). Kemandirian terbangun saat mengimplementasikan sanitasi htmlspecialchars() dan filter_input(). Komunikasi diasah saat mempresentasikan mekanisme proteksi form.'
    },
    karakteristik: {
      jenisPengetahuan: 'Pengetahuan konseptual (metode HTTP GET vs POST, arsitektur request-response), prosedural (validasi data wajib isi, regex format email/angka, sanitasi karakter htmlspecialchars), dan metakognitif (evaluasi kerentanan keamanan input pengguna).',
      relevansiKehidupanNyata: 'Merupakan benteng pertahanan utama setiap website e-commerce, portal pendaftaran siswa baru, maupun perbankan online agar terhindar dari manipulasi data berbahaya.',
      tingkatKesulitan: 'Tingkat kesulitan menengah (C3-C4 Bloom), menuntut ketelitian dalam menangani semua kemungkinan input abnormal dari pengguna.',
      strukturMateri: 'Materi terstruktur: 1) Form HTML dan atribut method/action, 2) Variabel superglobal $_POST dan $_GET, 3) Pengecekan isset() dan empty(), 4) Aturan validasi teks/email/panjang karakter, 5) Sanitasi karakter htmlspecialchars() dan pesan galat responsif.',
      integrasiNilaiKarakter: 'Menanamkan tanggung jawab etika keamanan cyber, ketelitian pengujian sistem, dan kejujuran dalam memproses data pribadi pengguna.'
    },
    capaianPembelajaran: 'Pada akhir fase F, peserta didik mampu mengimplementasikan penerimaan data form HTML (metode GET dan POST), teknik validasi input wajib/format data, sanitasi karakter berbahaya (htmlspecialchars, filter_input) untuk mencegah serangan XSS, serta menampilkan umpan balik validasi yang ramah pengguna.',
    tujuanPembelajaran: [
      'Murid mampu merancang form interaktif dan menerapkan validasi serta sanitasi data input sisi server pada form web secara mandiri dan aman.',
      'Murid mampu membedakan karakteristik pengiriman data metode HTTP GET dan POST serta memilih metode yang tepat sesuai aspek kerahasiaan data.',
      'Murid mampu menerapkan fungsi sanitasi data htmlspecialchars() dan validasi ekspresi reguler untuk mengamankan aplikasi dari injeksi script XSS.'
    ],
    kemitraan: {
      lingkunganSekolah: 'Guru produktif PPLG, pengelola sistem informasi sekolah SMK Negeri 2 Magelang.',
      lingkunganLuarSekolah: 'Komunitas Pengembang Web Jawa Tengah & praktisi keamanan aplikasi web.',
      masyarakat: 'Pengguna portal publik yang membutuhkan keamanan data formulir pendaftaran.'
    },
    pemanfaatanDigital: {
      perencanaan: 'Dokumentasi OWASP Top 10 vulnerabilities, platform LMS sekolah.',
      pelaksanaan: 'Visual Studio Code, Browser Developer Tools (Network tab), XAMPP Server lokal.',
      asesmen: 'Rubrik penilaian pengujian celah keamanan input form berbasis Google Form dan live submission.'
    },
    pengalamanPembelajaran: {
      pendahuluan: {
        waktu: '20 menit',
        waktuMenit: 20,
        deskripsi: '1. Guru menyapa kelas, memimpin doa bersama, dan mengecek kehadiran murid.\n2. Guru mengajak murid melakukan demonstrasi singkat: mencoba memasukkan tag <script>alert("Hacked!")</script> ke dalam form tanpa sanitasi untuk melihat bahaya XSS (mindful).\n3. Guru mengaitkan fenomena tersebut dengan tujuan pembelajaran pentingnya validasi dan sanitasi input sisi server.\n4. Guru membagikan lembar kerja projek: Pembangunan Formulir Registrasi Akun Terenkripsi dan Tervalidasi (6 JP = 270 Menit).'
      },
      kegiatanInti: [
        {
          fase: 'Fase 1. Pertanyaan mendasar (Memahami)',
          waktu: '30 menit',
          waktuMenit: 30,
          deskripsi: '1. Murid menyimak pemaparan guru tentang perbedaan $_POST vs $_GET dan bahaya mempercayai input pengguna mentah (meaningful).\n2. Guru mengajukan pertanyaan pemantik: "Bagaimana cara server memastikan bahwa email yang diketik pengguna benar-benar berformat email yang sah?"\n3. Murid menganalisis fungsi filter_var() dan preg_match() dalam PHP.'
        },
        {
          fase: 'Fase 2. Menyusun Rencana Projek (Memahami)',
          waktu: '35 menit',
          waktuMenit: 35,
          deskripsi: '1. Murid merancang spesifikasi form: nama lengkap (huruf saja, min 3 karakter), email (format valid), nomor telepon (angka 10-13 digit), dan password (min 8 karakter) (joyful).\n2. Murid merancang arsitektur penyimpanan pesan galat dalam array $errors[] agar dapat ditampilkan tepat di bawah field input yang bermasalah (meaningful).'
        },
        {
          fase: 'Fase 3. Membuat Jadwal (Mengaplikasi)',
          waktu: '30 menit',
          waktuMenit: 30,
          deskripsi: '1. Murid menyusun tahapan pembuatan: pembuatan form HTML (20 menit), penanganan method POST (25 menit), penyusunan logika validasi & sanitasi (30 menit), uji coba input ekstrem (10 menit) (mindful).\n2. Jadwal disetujui bersama guru pendamping.'
        },
        {
          fase: 'Fase 4. Pelaksanaan Projek (Mengaplikasi)',
          waktu: '85 menit',
          waktuMenit: 85,
          deskripsi: '1. Murid menulis kode validasi form PHP secara mandiri dengan teliti (meaningful).\n2. Murid menerapkan fungsi htmlspecialchars() pada setiap nilai input yang dicetak kembali (sticky form values).\n3. Guru membimbing murid yang mengalami kesulitan logika percabangan array pesan galat.'
        },
        {
          fase: 'Fase 5. Menguji Projek (Merefleksi)',
          waktu: '25 menit',
          waktuMenit: 25,
          deskripsi: '1. Murid saling bertukar formulir dengan teman sebangku untuk melakukan pengetesan destruktif (fuzzing test): mengosongkan field, memasukkan karakter spesial, email salah format, dan script HTML.\n2. Murid mencatat apakah sistem berhasil mendeteksi seluruh kesalahan dan menampilkan notifikasi yang jelas (meaningful).'
        },
        {
          fase: 'Fase 6. Evaluasi Projek (Merefleksi)',
          waktu: '25 menit',
          waktuMenit: 25,
          deskripsi: '1. Guru dan murid mendiskusikan temuan uji coba: mengapa validasi sisi server (backend) wajib ada meskipun sudah ada validasi sisi klien (HTML5 required/JS) (mindful).\n2. Guru memberikan rangkuman penguatan prinsip "Never Trust User Input" (meaningful).'
        }
      ],
      penutup: {
        waktu: '20 menit',
        waktuMenit: 20,
        deskripsi: '1. Murid merumuskan intisari pemahaman tentang validasi dan sanitasi data form.\n2. Murid melakukan refleksi ketercapaian belajar pada kartu kendali pembelajaran.\n3. Guru memberikan pengantar untuk materi pertemuan selanjutnya: Pembuatan Dashboard Web Responsif Berbasis Bootstrap.\n4. Kelas diakhiri dengan doa penutup dan salam.'
      },
      totalWaktuMenit: 270
    },
    asesmen: {
      asesmenAwal: 'Tanya jawab interaktif mengenai atribut form action dan method serta perbedaan pengiriman data lewat URL vs Body request.',
      asesmenProses: 'Penilaian unjuk kerja penulisan sintaks validasi form, kerapian kode, serta efektivitas sanitasi karakter berbahaya htmlspecialchars().',
      asesmenAkhir: 'Pengujian sumatif produk form web registrasi dengan instrumen uji kasus batas (edge case testing) dengan batas minimal ketuntasan KKTP 75.'
    },
    remedialDanPengayaan: {
      remedial: 'Latihan mandiri terbimbing membuat validasi wajib isi (required) pada 2 input sederhana dengan pesan galat langsung.',
      pengayaan: 'Menambahkan fitur upload file gambar/dokumen dengan validasi ekstensi MIME-type (.jpg, .png, .pdf) dan batasan ukuran maksimal (max file size 2MB).'
    },
    glosarium: [
      { istilah: 'Sanitasi Input', definisi: 'Proses membersihkan data masukan pengguna dari karakter ilegal atau berbahaya sebelum diproses oleh sistem aplikasi.' },
      { istilah: 'XSS (Cross-Site Scripting)', definisi: 'Kerentanan keamanan web di mana penyerang menyisipkan skrip klien berbahaya (seperti JavaScript) ke dalam halaman web yang dilihat pengguna lain.' },
      { istilah: 'Sticky Form', definisi: 'Teknik menjaga nilai input pengguna tetap terisi di dalam field formulir setelah proses submit jika terjadi kesalahan validasi.' }
    ],
    daftarPustaka: [
      'OWASP Foundation. (2025). OWASP Top 10 Web Application Security Risks. owasp.org.',
      'Welling, L., & Thomson, L. (2023). PHP and MySQL Web Development (5th ed.). Addison-Wesley.',
      'Direktorat SMK Kemendikbudristek. (2024). Modul Ajar Pemrograman Web Sisi Server Fase F SMK PPLG.'
    ],
    tandaTangan: {
      kepalaSekolahNama: DEFAULT_SCHOOL_PROFILE.namaKepalaSekolah,
      kepalaSekolahNip: DEFAULT_SCHOOL_PROFILE.nipKepalaSekolah,
      guruNama: DEFAULT_TEACHER_PROFILE.namaGuru,
      guruNip: DEFAULT_TEACHER_PROFILE.nip,
      tempatTanggal: `${DEFAULT_SCHOOL_PROFILE.kotaKabupaten}, 20 Juli 2026`
    }
  },

  // --- RPP 3: Antarmuka Web Responsif Bootstrap Dashboard (6 JP) ---
  {
    id: 'rpp-cp-3-2026',
    cpId: 'cp-pplg-2026-3',
    protaId: 'prota-pplg-xi-2026-2027',
    createdAt: '2026-07-27T07:30:00.000Z',
    updatedAt: new Date().toISOString(),
    version: 1,
    status: 'selesai',
    sekolah: DEFAULT_SCHOOL_PROFILE,
    guru: DEFAULT_TEACHER_PROFILE,
    pengaturan: {
      modelPembelajaran: 'Project Based Learning (PjBL)',
      jumlahJp: 6,
      durasiJp: 45,
      kktp: 75,
      tanggalRpp: '27 Juli 2026'
    },
    dimensiProfilLulusan: {
      keimanan: true,
      kewarganegaraan: false,
      penalaranKritis: true,
      kreatif: true,
      kolaborasi: true,
      kemandirian: true,
      kesehatan: false,
      komunikasi: true,
      catatanBukti: 'Dimensi Kreatif tampak saat mendesain hierarki visual dashboard antarmuka. Kolaborasi terwujud dalam tim pengembang antarmuka. Penalaran Kritis tampak saat menguji responsivitas grid breakpoint mobile, tablet, dan desktop.'
    },
    karakteristik: {
      jenisPengetahuan: 'Pengetahuan konseptual (konsep responsivitas, flexbox, mobile-first design), prosedural (penerapan grid system 12 kolom Bootstrap, implementasi komponen card, navbar, modal, badge), dan metakognitif (evaluasi kemudahan akses UI/UX pengguna).',
      relevansiKehidupanNyata: 'Keterampilan wajib di industri software modern di mana aplikasi web harus dapat diakses secara sempurna dari layar smartphone, tablet, laptop, hingga monitor ultra-wide.',
      tingkatKesulitan: 'Tingkat kesulitan menengah (C3-C4 Bloom), membutuhkan rasa estetika desain dan ketelitian pemanfaatan utility classes framework.',
      strukturMateri: 'Materi: 1) Instalasi CDN & pengenalan Bootstrap 5, 2) Grid system & Breakpoints (col, row, container), 3) Komponen navigasi (navbar responsif & sidebar toggler), 4) Komponen statistik (cards, stat widgets, badges, progress bar), 5) Integrasi tabel responsif dan modal konfirmasi.',
      integrasiNilaiKarakter: 'Menumbuhkan kepedulian terhadap kenyamanan pengguna (empathy user experience), keteraturan visual (aesthetic discipline), dan kerja sama tim yang harmonis.'
    },
    capaianPembelajaran: 'Pada akhir fase F, peserta didik mampu merancang tata letak antarmuka pengguna (UI/UX) berbasis grid system Bootstrap, memanfaatkan komponen navigasi navbar, sidebar, card responsif, modal dialog, dan icon untuk membangun dashboard aplikasi web modern sesuai kebutuhan industri.',
    tujuanPembelajaran: [
      'Murid mampu membangun layout dashboard aplikasi web yang responsif, estetis, dan user-friendly menggunakan framework Bootstrap secara kreatif dan kolaboratif.',
      'Murid mampu menerapkan konsep mobile-first grid system Bootstrap 12 kolom untuk mengatur tata letak komponen adaptif pada berbagai ukuran layar.',
      'Murid mampu memadukan komponen navbar, kartu statistik, tabel data, dan modal dialog ke dalam satu kesatuan template dashboard admin yang fungsional.'
    ],
    kemitraan: {
      lingkunganSekolah: 'Guru produktif PPLG, desainer multimedia SMKN 2 Magelang.',
      lingkunganLuarSekolah: 'UI/UX Designer agensi kreatif digital mitra sekolah.',
      masyarakat: 'Pengguna akhir aplikasi yang membutuhkan antarmuka yang ramah dan mudah dipahami.'
    },
    pemanfaatanDigital: {
      perencanaan: 'Platform desain Figma untuk wireframe layout dashboard, dokumentasi resmi Bootstrap 5.',
      pelaksanaan: 'Visual Studio Code, Live Server extension, Bootstrap 5 CDN, Bootstrap Icons.',
      asesmen: 'Google Drive/GitHub Pages showcase karya portofolio, rubrik penilaian responsivitas UI.'
    },
    pengalamanPembelajaran: {
      pendahuluan: {
        waktu: '20 menit',
        waktuMenit: 20,
        deskripsi: '1. Guru menyapa murid, mengajak berdoa bersama, dan memeriksa presensi serta kesiapan lab komputer.\n2. Guru menampilkan dua perbandingan dashboard: dashboard web tahun 2005 (tidak responsif) dan dashboard web modern berbasis Bootstrap (mindful).\n3. Guru menggali pendapat murid: "Apa perbedaan kenyamanan yang Anda rasakan ketika membuka kedua dashboard tersebut di layar ponsel?"\n4. Guru memaparkan tujuan projek: Merancang Dashboard Admin Administrasi Sekolah / Toko Online yang responsif (6 JP = 270 Menit).'
      },
      kegiatanInti: [
        {
          fase: 'Fase 1. Pertanyaan mendasar (Memahami)',
          waktu: '30 menit',
          waktuMenit: 30,
          deskripsi: '1. Murid mengamati anatomi layout dashboard standar: Top Navbar, Sidebar Menu, Stat Cards Summary, dan Data Table (meaningful).\n2. Guru mendemonstrasikan cara kerja breakpoint Bootstrap (sm, md, lg, xl, xxl) dan sistem 12 kolom.\n3. Murid mendiskusikan bagaimana membagi kolom secara proporsional agar elemen tidak saling bertumpukan di layar kecil.'
        },
        {
          fase: 'Fase 2. Menyusun Rencana Projek (Memahami)',
          waktu: '35 menit',
          waktuMenit: 35,
          deskripsi: '1. Murid berkelompok (2-3 orang) memilih tema dashboard: Sistem Kasir Toko, Presensi Siswa SMK, atau Perpustakaan Digital (joyful).\n2. Kelompok menggambar sketsa wireframe tata letak komponen pada lembar perencanaan sebelum menuangkannya ke kode HTML/Bootstrap (meaningful).'
        },
        {
          fase: 'Fase 3. Membuat Jadwal (Mengaplikasi)',
          waktu: '30 menit',
          waktuMenit: 30,
          deskripsi: '1. Murid menyusun jadwal pengerjaan 85 menit: 20 menit struktur container & navbar, 30 menit kartu ringkasan & grid, 25 menit tabel data responsif & modal, 10 menit uji responsive toggle (mindful).\n2. Jadwal diverifikasi oleh guru pembimbing.'
        },
        {
          fase: 'Fase 4. Pelaksanaan Projek (Mengaplikasi)',
          waktu: '85 menit',
          waktuMenit: 85,
          deskripsi: '1. Murid mengimplementasikan kode HTML dengan kelas-kelas utilitas Bootstrap 5 secara kolaboratif (meaningful).\n2. Murid memanfaatkan Bootstrap Icons untuk memperindah kartu statistik dan menu sidebar.\n3. Guru berkeliling memberikan pendampingan teknis dan mengarahkan penyesuaian kelas d-flex, justify-content-between, dan overflow-x-auto.'
        },
        {
          fase: 'Fase 5. Menguji Projek (Merefleksi)',
          waktu: '25 menit',
          waktuMenit: 25,
          deskripsi: '1. Murid menguji responsivitas halaman menggunakan Fitur Inspect Device Toolbar pada Google Chrome (resolusi iPhone, iPad, Laptop) (meaningful).\n2. Kelompok mempresentasikan tampilan dashboard di depan kelas melalui proyektor proyektor lab.\n3. Teman sekelas memberikan masukan konstruktif terhadap keserasian warna dan kemudahan navigasi.'
        },
        {
          fase: 'Fase 6. Evaluasi Projek (Merefleksi)',
          waktu: '25 menit',
          waktuMenit: 25,
          deskripsi: '1. Murid merefleksikan keunggulan framework CSS dibandingkan menulis CSS murni dari nol (mindful).\n2. Guru memberikan penguatan mengenai konsistensi desain (design consistency) dan aksesibilitas web (joyful).'
        }
      ],
      penutup: {
        waktu: '20 menit',
        waktuMenit: 20,
        deskripsi: '1. Guru bersama murid menyimpulkan pembelajaran tentang perancangan antarmuka responsif Bootstrap.\n2. Murid menyimpan dan mem-push file latihan ke repositori pribadi masing-masing.\n3. Guru memberikan pengantar untuk pertemuan berikutnya: Integrasi Basis Data MySQL dan Operasi CRUD.\n4. Kelas ditutup dengan doa bersama dan salam penutup.'
      },
      totalWaktuMenit: 270
    },
    asesmen: {
      asesmenAwal: 'Pengecekan penguasaan dasar HTML dan konsep styling CSS melalui kuis cepat Padlet.',
      asesmenProses: 'Observasi keterlibatan anggota tim dalam perancangan grid dan penulisan komponen Bootstrap yang valid.',
      asesmenAkhir: 'Penilaian unjuk kerja produk antarmuka dashboard: keterpenuhan komponen (navbar, sidebar, cards, tabel, modal), keindahan estetika UI/UX, dan kesempurnaan adaptasi di 3 ukuran layar (KKTP 75).'
    },
    remedialDanPengayaan: {
      remedial: 'Pendampingan khusus perbaikan penataan grid 12 kolom dengan panduan kartu layout bertahap.',
      pengayaan: 'Mengintegrasikan library grafik interaktif Chart.js untuk menampilkan visualisasi data statistik penjualan pada kartu dashboard.'
    },
    glosarium: [
      { istilah: 'Bootstrap', definisi: 'Framework CSS dan komponen antarmuka sumber terbuka (open-source) yang populer untuk membangun aplikasi web yang responsif dan mobile-first.' },
      { istilah: 'Grid System', definisi: 'Struktur tata letak 12 kolom fleksibel yang digunakan untuk menyelaraskan konten dan membagi bidang layar secara proporsional.' },
      { istilah: 'Breakpoint', definisi: 'Titik batas lebar layar tertentu dalam piksel di mana tata letak antarmuka web berubah menyesuaikan ruang tampilan yang tersedia.' }
    ],
    daftarPustaka: [
      'Bootstrap Team. (2026). Bootstrap 5.3 Documentation & Examples. getbootstrap.com.',
      'Duckett, J. (2023). HTML and CSS: Design and Build Websites. John Wiley & Sons.',
      'Direktorat SMK Kemendikbudristek. (2024). Modul Ajar Desain Antarmuka Pengguna Fase F SMK PPLG.'
    ],
    tandaTangan: {
      kepalaSekolahNama: DEFAULT_SCHOOL_PROFILE.namaKepalaSekolah,
      kepalaSekolahNip: DEFAULT_SCHOOL_PROFILE.nipKepalaSekolah,
      guruNama: DEFAULT_TEACHER_PROFILE.namaGuru,
      guruNip: DEFAULT_TEACHER_PROFILE.nip,
      tempatTanggal: `${DEFAULT_SCHOOL_PROFILE.kotaKabupaten}, 27 Juli 2026`
    }
  },

  // --- RPP 4: Basis Data dan Integrasi CRUD (MySQL & PDO) (6 JP) ---
  {
    id: 'rpp-cp-4-2026',
    cpId: 'cp-pplg-2026-4',
    protaId: 'prota-pplg-xi-2026-2027',
    createdAt: '2026-08-03T07:30:00.000Z',
    updatedAt: new Date().toISOString(),
    version: 1,
    status: 'selesai',
    sekolah: DEFAULT_SCHOOL_PROFILE,
    guru: DEFAULT_TEACHER_PROFILE,
    pengaturan: {
      modelPembelajaran: 'Project Based Learning (PjBL)',
      jumlahJp: 6,
      durasiJp: 45,
      kktp: 75,
      tanggalRpp: '3 Agustus 2026'
    },
    dimensiProfilLulusan: {
      keimanan: true,
      kewarganegaraan: false,
      penalaranKritis: true,
      kreatif: true,
      kolaborasi: true,
      kemandirian: true,
      kesehatan: false,
      komunikasi: true,
      catatanBukti: 'Penalaran Kritis tampak saat merancang relasi tabel basis data dan query SQL PDO. Kemandirian terasah dalam coding operasi CRUD lengkap. Kolaborasi dan Komunikasi terwujud saat mendemonstrasikan pengujian integritas data.'
    },
    karakteristik: {
      jenisPengetahuan: 'Pengetahuan konseptual (koneksi database relasional, ekstensi PDO, prepared statements), prosedural (perancangan skema tabel MySQL, eksekusi query INSERT, SELECT, UPDATE, DELETE, parameter binding), dan metakognitif (evaluasi efisiensi query dan keamanan transaksi data).',
      relevansiKehidupanNyata: 'Merupakan inti (backbone) dari 99% aplikasi web komersial dunia nyata yang mengelola penyimpanan informasi pengguna, transaksi barang, nilai siswa, dan inventaris.',
      tingkatKesulitan: 'Tingkat kesulitan tinggi (C4-C5 Bloom), melibatkan keterpaduan antara front-end form, bahasa skrip PHP backend, dan server database MySQL.',
      strukturMateri: 'Materi terstruktur: 1) Koneksi database dengan PDO dan try-catch error handling, 2) Operasi Create (penyisipan data form ke database), 3) Operasi Read (penampilan data tabel dengan fetch/fetchAll), 4) Operasi Update (pemanggilan form edit dan modifikasi baris data), 5) Operasi Delete (penghapusan data terkonfirmasi modal).',
      integrasiNilaiKarakter: 'Menanamkan integritas integritas data (data integrity), kehati-hatian dalam memodifikasi informasi, ketekunan memecahkan galat database, dan etika privasi informasi.'
    },
    capaianPembelajaran: 'Pada akhir fase F, peserta didik mampu mengkoneksikan aplikasi web PHP dengan database server MySQL menggunakan ekstensi PDO (PHP Data Objects), merancang query SQL relasional, serta mengimplementasikan operasi CRUD (Create, Read, Update, Delete) dengan Prepared Statements untuk mencegah SQL Injection.',
    tujuanPembelajaran: [
      'Murid mampu membangun modul operasi basis data CRUD (Create, Read, Update, Delete) menggunakan PHP PDO dan MySQL secara terstruktur dan aman terhadap celah injeksi data.',
      'Murid mampu membangun file koneksi database menggunakan objek PDO dengan penanganan kesalahan PDOException (try-catch block) secara mandiri.',
      'Murid mampu menerapkan query prepared statements dan parameter binding untuk seluruh operasi transaksi basis data demi menjamin keamanan data aplikasi web.'
    ],
    kemitraan: {
      lingkunganSekolah: 'Laboratorium basis data SMKN 2 Magelang, server lokal sekolah.',
      lingkunganLuarSekolah: 'Database Administrator (DBA) industri mitra kejuruan PPLG.',
      masyarakat: 'Pelaku UMKM lokal Magelang yang memerlukan digitalisasi pencatatan data barang dan transaksi.'
    },
    pemanfaatanDigital: {
      perencanaan: 'phpMyAdmin / DBeaver untuk perancangan Entity Relationship Diagram (ERD).',
      pelaksanaan: 'XAMPP MySQL Server, Visual Studio Code, PHP PDO extension, Postman.',
      asesmen: 'LMS sekolah untuk unggah basis data (.sql) dan kode sumber, rubrik uji fungsionalitas CRUD.'
    },
    pengalamanPembelajaran: {
      pendahuluan: {
        waktu: '20 menit',
        waktuMenit: 20,
        deskripsi: '1. Guru membuka kelas dengan salam, doa bersama yang khidmat, dan mengecek kehadiran murid.\n2. Guru mengajak murid mengingat materi sebelumnya: "Kita telah membuat form dan antarmuka dashboard, namun ke mana perginya data setelah tombol Simpan ditekan jika server dimatikan?" (mindful).\n3. Guru mendemonstrasikan integrasi database: bagaimana data tersimpan permanen di MySQL dan dapat ditampilkan kembali kapan saja.\n4. Guru membagikan lembar kerja PjBL: Membangun Aplikasi Manajemen Data Siswa / Inventaris Barang SMK berbasis CRUD PDO (6 JP = 270 Menit).'
      },
      kegiatanInti: [
        {
          fase: 'Fase 1. Pertanyaan mendasar (Memahami)',
          waktu: '30 menit',
          waktuMenit: 30,
          deskripsi: '1. Murid mempelajari konsep koneksi PDO vs mysqli dan keunggulan PDO (fleksibel multi-RDBMS dan aman berkat prepared statements) (meaningful).\n2. Guru memperagakan penulisan skrip koneksi db.php dengan struktur try-catch.\n3. Murid menganalisis cara kerja prepared statements: pemisahan query SQL dan parameter data untuk mencegah bahaya SQL Injection.'
        },
        {
          fase: 'Fase 2. Menyusun Rencana Projek (Memahami)',
          waktu: '35 menit',
          waktuMenit: 35,
          deskripsi: '1. Murid secara berkelompok merancang skema database tabel MySQL (misal: tb_barang dengan kolom: id, kode_barang, nama_barang, kategori, harga, stok) (joyful).\n2. Kelompok merancang arsitektur file: connection.php, index.php (Read), create.php (Create), edit.php (Update), dan delete.php (Delete) (meaningful).'
        },
        {
          fase: 'Fase 3. Membuat Jadwal (Mengaplikasi)',
          waktu: '30 menit',
          waktuMenit: 30,
          deskripsi: '1. Murid membagi alokasi waktu pelaksanaan (85 menit koding): 20 menit koneksi & Create, 25 menit Read tabel data, 25 menit Update form, 15 menit Delete dengan konfirmasi (mindful).\n2. Setiap tim memvalidasi kesiapan skema database mereka kepada guru.'
        },
        {
          fase: 'Fase 4. Pelaksanaan Projek (Mengaplikasi)',
          waktu: '85 menit',
          waktuMenit: 85,
          deskripsi: '1. Murid mengetik kode PHP PDO dan menguji setiap fungsionalitas CRUD secara bertahap pada browser lokal (meaningful).\n2. Murid menerapkan bindParam() atau execute([$params]) pada setiap query transaksi.\n3. Guru melakukan observasi intensif, membimbing penyelesaian error umum (PDOException: SQLSTATE, fetch mode array, redirect header location).\n4. Murid menyematkan notifikasi sukses (alert banner) setelah data berhasil ditambah, diedit, atau dihapus.'
        },
        {
          fase: 'Fase 5. Menguji Projek (Merefleksi)',
          waktu: '25 menit',
          waktuMenit: 25,
          deskripsi: '1. Setiap kelompok mendemonstrasikan sistem CRUD mereka di depan guru dan perwakilan kelompok lain (meaningful).\n2. Penguji mencoba skenario ekstrem: menambah data duplikat, mengedit dengan data kosong, dan mengonfirmasi penghapusan data.\n3. Kelompok mencatat umpan balik perbaikan unjuk kerja.'
        },
        {
          fase: 'Fase 6. Evaluasi Projek (Merefleksi)',
          waktu: '25 menit',
          waktuMenit: 25,
          deskripsi: '1. Murid melakukan refleksi kelompok: apa tantangan terbesar dalam memprogram alur edit data (menampilkan data lama di form sebelum di-update) (mindful).\n2. Guru memberikan penguatan mengenai prinsip ACID dalam basis data dan praktik terbaik pengelolaan koneksi (joyful).'
        }
      ],
      penutup: {
        waktu: '20 menit',
        waktuMenit: 20,
        deskripsi: '1. Guru memfasilitasi murid menyimpulkan 4 operasi dasar CRUD dan fungsi vital prepared statements.\n2. Murid mengekspor file database .sql dan mengarsipkan seluruh project ke folder tugas lab.\n3. Guru menyampaikan topik pertemuan berikutnya: Keamanan Web, Otentikasi Login, dan Manajemen Hak Akses.\n4. Pembelajaran diakhiri dengan doa bersama dan salam hangat.'
      },
      totalWaktuMenit: 270
    },
    asesmen: {
      asesmenAwal: 'Pertanyaan apersepsi terkait perintah dasar SQL (SELECT, INSERT, UPDATE, DELETE) pada kuis interaktif.',
      asesmenProses: 'Penilaian keterlibatan aktif kelompok, kepatuhan penulisan sintaks PDO Prepared Statements, dan kemampuan men-debug pesan galat SQL.',
      asesmenAkhir: 'Uji fungsionalitas menyeluruh modul CRUD (Create, Read, Update, Delete) dengan rubrik validasi data, keamanan parameter binding, dan ketuntasan KKTP 75.'
    },
    remedialDanPengayaan: {
      remedial: 'Latihan terbimbing khusus operasi Create dan Read data siswa sederhana dengan 2 kolom menggunakan template skrip bertahap.',
      pengayaan: 'Menambahkan fitur pagination (pembagian halaman data per 10 baris) dan fitur pencarian dinamis (search filter dengan keyword LIKE) pada tabel Read.'
    },
    glosarium: [
      { istilah: 'CRUD', definisi: 'Akronim dari Create (buat), Read (baca/tampilkan), Update (perbarui), dan Delete (hapus), yang merupakan empat fungsi dasar manipulasi data penyimpanan persisten.' },
      { istilah: 'PDO (PHP Data Objects)', definisi: 'Ekstensi PHP yang menyediakan antarmuka konsisten dan aman untuk mengakses berbagai sistem basis data relasional.' },
      { istilah: 'Prepared Statement', definisi: 'Fitur basis data yang mengkompilasi query SQL terlebih dahulu sebelum parameter data disuntikkan, sehingga efektif mencegah serangan SQL Injection.' },
      { istilah: 'SQL Injection', definisi: 'Teknik eksploitasi keamanan di mana penyerang menyisipkan perintah SQL ilegal ke dalam field input aplikasi web.' }
    ],
    daftarPustaka: [
      'Ullman, L. (2024). PHP and MySQL for Dynamic Web Sites: Visual QuickPro Guide. Peachpit Press.',
      'MySQL Documentation Team. (2025). MySQL 8.0 Reference Manual: SQL Statements. dev.mysql.com.',
      'Direktorat SMK Kemendikbudristek. (2024). Modul Ajar Basis Data Terintegrasi Pemrograman Web Fase F SMK PPLG.'
    ],
    tandaTangan: {
      kepalaSekolahNama: DEFAULT_SCHOOL_PROFILE.namaKepalaSekolah,
      kepalaSekolahNip: DEFAULT_SCHOOL_PROFILE.nipKepalaSekolah,
      guruNama: DEFAULT_TEACHER_PROFILE.namaGuru,
      guruNip: DEFAULT_TEACHER_PROFILE.nip,
      tempatTanggal: `${DEFAULT_SCHOOL_PROFILE.kotaKabupaten}, 3 Agustus 2026`
    }
  },

  // --- RPP 5: Keamanan Web, Otentikasi Login, dan Hak Akses (6 JP) ---
  {
    id: 'rpp-cp-5-2026',
    cpId: 'cp-pplg-2026-5',
    protaId: 'prota-pplg-xi-2026-2027',
    createdAt: '2026-08-10T07:30:00.000Z',
    updatedAt: new Date().toISOString(),
    version: 1,
    status: 'selesai',
    sekolah: DEFAULT_SCHOOL_PROFILE,
    guru: DEFAULT_TEACHER_PROFILE,
    pengaturan: {
      modelPembelajaran: 'Project Based Learning (PjBL)',
      jumlahJp: 6,
      durasiJp: 45,
      kktp: 75,
      tanggalRpp: '10 Agustus 2026'
    },
    dimensiProfilLulusan: {
      keimanan: true,
      kewarganegaraan: false,
      penalaranKritis: true,
      kreatif: true,
      kolaborasi: true,
      kemandirian: true,
      kesehatan: false,
      komunikasi: true,
      catatanBukti: 'Keimanan dan Nilai Karakter tampak dari komitmen menjunjung tinggi privasi data dan keamanan cyber. Penalaran Kritis tampak saat menganalisis alur verifikasi hash dan validasi token sesi. Kemandirian terasah saat mengamankan route halaman web dari bypass URL.'
    },
    karakteristik: {
      jenisPengetahuan: 'Pengetahuan konseptual (konsep stateful vs stateless HTTP, siklus hidup session, mekanisme kriptografi one-way hashing), prosedural (implementasi session_start(), password_hash(PASSWORD_BCRYPT), password_verify(), dan middleware proteksi hak akses), serta metakognitif (evaluasi kerentanan bypass otentikasi).',
      relevansiKehidupanNyata: 'Merupakan standar wajib mutlak seluruh sistem informasi perbankan, portal akademik SMK, e-commerce, dan layanan publik agar akun pengguna tidak dapat disusupi pihak tak berwenang.',
      tingkatKesulitan: 'Tingkat kesulitan tinggi (C4-C5 Bloom), membutuhkan pemahaman mendalam tentang state tracking server-client, cookies, dan otorisasi bertingkat (role-based access control).',
      strukturMateri: 'Materi terstruktur: 1) Konsep hashing vs enkripsi (mengapa password tidak boleh disimpan plain text), 2) Fungsi password_hash() dan password_verify(), 3) Arsitektur sesi PHP ($_SESSION) dan cookie identitas, 4) Alur login dan logout aman, 5) Proteksi halaman privat dan pembatasan hak akses berdasar role (Admin vs User biasa).',
      integrasiNilaiKarakter: 'Menanamkan integritas moral tertinggi dalam menjaga amanah data sensitif, kepatuhan pada undang-undang perlindungan data pribadi (UU PDP), dan kedisiplinan pengamanan sistem.'
    },
    capaianPembelajaran: 'Pada akhir fase F, peserta didik mampu merancang skema otentikasi pengguna berbasis database, mengamankan password menggunakan password_hash() dan password_verify(), mengelola sesi login (session start, session check, session destroy), serta menerapkan proteksi otorisasi halaman multi-level (admin/user).',
    tujuanPembelajaran: [
      'Murid mampu mengintegrasikan sistem otentikasi login, hashing password, session management, dan kontrol hak akses halaman web multi-user secara bertanggung jawab dan berintegritas tinggi.',
      'Murid mampu menerapkan fungsi kriptografi password_hash() dengan algoritma BCRYPT saat registrasi dan password_verify() saat proses autentikasi pengguna secara mandiri.',
      'Murid mampu membangun skrip proteksi hak akses (role-based authorization) yang mencegah pengguna biasa atau pihak asing mengakses halaman admin melalui manipulasi URL langsung.'
    ],
    kemitraan: {
      lingkunganSekolah: 'Tim Cyber Security / IT Support SMKN 2 Magelang, guru kejuruan PPLG.',
      lingkunganLuarSekolah: 'Konsultan Keamanan Siber & Instansi Pemerintah mitra kejuruan.',
      masyarakat: 'Masyarakat pengguna aplikasi yang berhak atas perlindungan privasi data pribadi.'
    },
    pemanfaatanDigital: {
      perencanaan: 'Pedoman NIST Cyber Security Framework untuk otentikasi digital.',
      pelaksanaan: 'Visual Studio Code, XAMPP Server lokal, Browser Developer Tools (Application - Cookies tab).',
      asesmen: 'Rubrik pengujian keamanan sesi dan uji coba bypass otentikasi pada platform LMS sekolah.'
    },
    pengalamanPembelajaran: {
      pendahuluan: {
        waktu: '20 menit',
        waktuMenit: 20,
        deskripsi: '1. Guru menyapa murid, memimpin doa bersama, dan mengecek presensi lab komputer.\n2. Guru menyajikan studi kasus nyata berita kebocoran data jutaan akun akibat password disimpan secara plain text (tanpa hash) (mindful).\n3. Guru memantik diskusi: "Sebagai calon programmer profesional SMK Negeri 2 Magelang, bagaimana cara kita melindungi pengguna dari bencana kebocoran password tersebut?"\n4. Guru menyampaikan tujuan pembelajaran dan target projek: Membangun Modul Otentikasi Login Aman dengan Hashing BCRYPT, Session Management, dan Role Admin/User (6 JP = 270 Menit).'
      },
      kegiatanInti: [
        {
          fase: 'Fase 1. Pertanyaan mendasar (Memahami)',
          waktu: '30 menit',
          waktuMenit: 30,
          deskripsi: '1. Murid mengamati perbedaan antara enkripsi dua arah dengan hashing satu arah (one-way hashing) (meaningful).\n2. Guru mendemonstrasikan fungsi password_hash() PHP dengan BCRYPT dan bagaimana salt otomatis dihasilkan sehingga dua password identik menghasilkan hash yang berbeda.\n3. Murid menganalisis siklus hidup sesi PHP: session_start(), penyimpanan variabel $_SESSION[\'user\'], dan session_destroy() saat logout.'
        },
        {
          fase: 'Fase 2. Menyusun Rencana Projek (Memahami)',
          waktu: '35 menit',
          waktuMenit: 35,
          deskripsi: '1. Murid merancang tabel users: id, username, email, password_hash (VARCHAR 255), role (\'admin\', \'siswa\') (joyful).\n2. Kelompok menyusun diagram alir (flowchart): Alur Registrasi -> Alur Login -> Cek Password -> Inisialisasi Sesi -> Pengecekan Hak Akses Halaman -> Logout (meaningful).'
        },
        {
          fase: 'Fase 3. Membuat Jadwal (Mengaplikasi)',
          waktu: '30 menit',
          waktuMenit: 30,
          deskripsi: '1. Murid menyusun jadwal pengerjaan 85 menit koding: 20 menit modul registrasi ber-hash, 25 menit modul login & password_verify, 25 menit pengecekan middleware sesi pada halaman admin, 15 menit fitur logout & pembersihan sesi (mindful).\n2. Jadwal diverifikasi bersama guru.'
        },
        {
          fase: 'Fase 4. Pelaksanaan Projek (Mengaplikasi)',
          waktu: '85 menit',
          waktuMenit: 85,
          deskripsi: '1. Murid menulis kode PHP untuk proses registrasi dan login secara bertanggung jawab dan teliti (meaningful).\n2. Murid menambahkan skrip penjaga (session gate) di awal halaman dashboard:\n   if (!isset($_SESSION[\'logged_in\'])) { header(\'Location: login.php\'); exit; }\n3. Murid menambahkan logika otorisasi role:\n   if ($_SESSION[\'role\'] !== \'admin\') { echo "Akses Ditolak!"; exit; }\n4. Guru mendampingi murid yang mengalami kendala header already sent atau session yang tidak terbaca.'
        },
        {
          fase: 'Fase 5. Menguji Projek (Merefleksi)',
          waktu: '25 menit',
          waktuMenit: 25,
          deskripsi: '1. Murid melakukan pengujian keamanan (penetration test sederhana):\n   a. Mencoba membuka dashboard.php langsung tanpa login (harus terlempar ke login.php).\n   b. Login sebagai siswa biasa dan mencoba mengakses admin_panel.php (harus ditolak).\n   c. Menekan tombol logout dan menekan tombol Back di browser (halaman tidak boleh terbuka kembali) (meaningful).\n2. Setiap kelompok mendemonstrasikan keberhasilan pengamanan sistem kepada guru.'
        },
        {
          fase: 'Fase 6. Evaluasi Projek (Merefleksi)',
          waktu: '25 menit',
          waktuMenit: 25,
          deskripsi: '1. Murid mempresentasikan pengalaman koding: mengapa penting memanggil session_destroy() dan unset($_SESSION) saat logout (mindful).\n2. Guru memberikan apresiasi atas dedikasi dan kejujuran murid dalam menjaga integritas kode keamanan (joyful).'
        }
      ],
      penutup: {
        waktu: '20 menit',
        waktuMenit: 20,
        deskripsi: '1. Guru bersama murid merangkum pilar utama keamanan web: sanitasi input, parameter binding PDO, password hashing BCRYPT, dan kontrol otorisasi sesi.\n2. Murid melakukan refleksi menyeluruh atas pencapaian seluruh kompetensi pemrograman web sisi server semester ganjil.\n3. Guru memberikan motivasi dan apresiasi atas kesiapan murid memasuki standar industri perangkat lunak.\n4. Kelas diakhiri dengan doa bersama penuh rasa syukur dan salam penutup.'
      },
      totalWaktuMenit: 270
    },
    asesmen: {
      asesmenAwal: 'Kuis pemahaman konsep otentikasi vs otorisasi dan identifikasi risiko keamanan web pada Mentimeter.',
      asesmenProses: 'Observasi unjuk kerja implementasi fungsi password_hash, pengecekan $_SESSION, dan penulisan redirect header.',
      asesmenAkhir: 'Uji simulasi keamanan otentikasi login multi-level (admin dan siswa) dan ketahanan terhadap percobaan bypass URL dengan instrumen KKTP 75.'
    },
    remedialDanPengayaan: {
      remedial: 'Pendampingan khusus pembuatan alur login sesi tunggal dengan 1 user default hingga paham cara kerja session_start() dan isset($_SESSION).',
      pengayaan: 'Mengimplementasikan proteksi token CSRF (Cross-Site Request Forgery) pada form login dan pembatasan percobaan login (rate limiting / account lockout setelah 3x gagal).'
    },
    glosarium: [
      { istilah: 'Otentikasi (Authentication)', definisi: 'Proses verifikasi identitas seseorang atau sistem untuk memastikan bahwa mereka benar-benar pihak yang diklaim (misal: verifikasi username dan password).' },
      { istilah: 'Otorisasi (Authorization)', definisi: 'Proses penentuan hak akses atau wewenang yang dimiliki pengguna yang telah terotentikasi untuk mengakses sumber daya tertentu (misal: membedakan hak akses Admin dan User biasa).' },
      { istilah: 'Password Hashing (BCRYPT)', definisi: 'Fungsi hash kriptografi satu arah yang mengubah string password menjadi serangkaian karakter acak tetap yang tidak dapat dibalikkan kembali ke teks aslinya.' },
      { istilah: 'Session (Sesi Web)', definisi: 'Mekanisme penyimpanan data pengguna di sisi server yang bertahan di beberapa permintaan halaman selama kunjungan pengguna berlangsung.' }
    ],
    daftarPustaka: [
      'OWASP Foundation. (2025). Session Management Cheat Sheet & Authentication Best Practices. owasp.org.',
      'Sklar, D. (2023). Learning PHP: A Gentle Introduction to the Web\'s Most Popular Language. O\'Reilly Media.',
      'Direktorat SMK Kemendikbudristek. (2024). Modul Ajar Keamanan Aplikasi Web Fase F SMK PPLG.'
    ],
    tandaTangan: {
      kepalaSekolahNama: DEFAULT_SCHOOL_PROFILE.namaKepalaSekolah,
      kepalaSekolahNip: DEFAULT_SCHOOL_PROFILE.nipKepalaSekolah,
      guruNama: DEFAULT_TEACHER_PROFILE.namaGuru,
      guruNip: DEFAULT_TEACHER_PROFILE.nip,
      tempatTanggal: `${DEFAULT_SCHOOL_PROFILE.kotaKabupaten}, 10 Agustus 2026`
    }
  }
];
