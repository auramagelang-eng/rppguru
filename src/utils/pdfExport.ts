import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { RPPDocument } from '../types/rpp';

// Helper to sanitize filenames
export function getRppFileName(doc: RPPDocument, ext: 'pdf' | 'doc' = 'pdf'): string {
  const mapel = (doc.guru?.mataPelajaran || 'Mapel').replace(/[^a-zA-Z0-9]/g, '_');
  const kelas = (doc.guru?.kelas || 'Kelas').replace(/[^a-zA-Z0-9]/g, '_');
  const cpName = (doc.karakteristik?.strukturMateri || 'CP').slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_');
  return `RPP_${mapel}_${kelas}_${cpName}.${ext}`;
}

// Logo SVG representations for Kop Surat Klasik
export const LOGO_JATENG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 115" width="58" height="68">
  <path d="M50 3 C25 3 8 18 8 48 C8 78 28 100 50 112 C72 100 92 78 92 48 C92 18 75 3 50 3 Z" fill="#ffffff" stroke="#c0392b" stroke-width="3"/>
  <path d="M50 7 C28 7 12 21 12 48 C12 75 30 96 50 107 C70 96 88 75 88 48 C88 21 72 7 50 7 Z" fill="#27ae60"/>
  <polygon points="50,22 32,58 68,58" fill="#2c3e50"/>
  <polygon points="50,22 40,58 60,58" fill="#34495e"/>
  <polygon points="50,12 52,17 57,17 53,20 55,25 50,22 45,25 47,20 43,17 48,17" fill="#f1c40f"/>
  <rect x="47" y="32" width="6" height="26" fill="#ecf0f1"/>
  <polygon points="50,26 46,32 54,32" fill="#e74c3c"/>
  <path d="M22 62 Q36 57 50 62 T78 62" stroke="#2980b9" stroke-width="4" fill="none"/>
  <path d="M22 68 Q36 63 50 68 T78 68" stroke="#3498db" stroke-width="3" fill="none"/>
  <path d="M22 35 C18 50 22 75 40 85" stroke="#f39c12" stroke-width="3" fill="none"/>
  <path d="M78 35 C82 50 78 75 60 85" stroke="#f1c40f" stroke-width="3" fill="none"/>
  <path d="M24 90 Q50 82 76 90 L74 98 Q50 90 26 98 Z" fill="#c0392b"/>
  <text x="50" y="94" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif">JAWA TENGAH</text>
</svg>`;

export const LOGO_SMKN2_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 115" width="62" height="68">
  <polygon points="55,4 102,24 88,96 55,111 22,96 8,24" fill="#1b4f72" stroke="#e67e22" stroke-width="3"/>
  <circle cx="55" cy="52" r="32" fill="#2980b9" stroke="#f39c12" stroke-width="3"/>
  <g fill="#f39c12">
    <rect x="52" y="16" width="6" height="6"/>
    <rect x="52" y="82" width="6" height="6"/>
    <rect x="22" y="49" width="6" height="6"/>
    <rect x="82" y="49" width="6" height="6"/>
    <rect x="31" y="28" width="6" height="6" transform="rotate(45 34 31)"/>
    <rect x="73" y="70" width="6" height="6" transform="rotate(45 76 73)"/>
    <rect x="31" y="70" width="6" height="6" transform="rotate(-45 34 73)"/>
    <rect x="73" y="28" width="6" height="6" transform="rotate(-45 76 31)"/>
  </g>
  <path d="M55 58 C42 45 30 52 26 62 C34 60 44 60 55 64 Z" fill="#ecf0f1"/>
  <path d="M55 63 C44 54 34 59 30 67 C38 65 46 64 55 68 Z" fill="#bdc3c7"/>
  <path d="M55 58 C68 45 80 52 84 62 C76 60 66 60 55 64 Z" fill="#ecf0f1"/>
  <path d="M55 63 C66 54 76 59 80 67 C72 65 64 64 55 68 Z" fill="#bdc3c7"/>
  <path d="M55 30 C51 38 48 42 55 49 C62 42 59 38 55 30 Z" fill="#e74c3c"/>
  <path d="M55 35 C53 40 51 43 55 47 C59 43 57 40 55 35 Z" fill="#f1c40f"/>
  <rect x="52.5" y="49" width="5" height="14" fill="#d35400" rx="1"/>
  <rect x="18" y="82" width="74" height="16" fill="#e67e22" rx="3" stroke="#ffffff" stroke-width="1.5"/>
  <text x="55" y="93" font-size="7.5" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif" letter-spacing="0.5">SMK N 2 MAGELANG</text>
</svg>`;

// Modern Geometric Header & Footer Accents
export const GEOMETRIC_TOP_BORDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 65" width="100%" height="52" preserveAspectRatio="none" style="display:block; margin: 0; padding: 0;">
  <polygon points="0,0 75,0 35,42" fill="#1b365d" />
  <polygon points="50,0 130,0 90,52" fill="#244b7a" />
  <polygon points="110,0 185,0 148,32" fill="#38bdf8" />
  <polygon points="165,0 245,0 205,58" fill="#1e3a8a" />
  <polygon points="225,0 305,0 265,38" fill="#60a5fa" />
  <polygon points="285,0 365,0 325,52" fill="#1b365d" />
  <polygon points="345,0 425,0 385,32" fill="#0284c7" />
  <polygon points="405,0 485,0 445,58" fill="#1e3a8a" />
  <polygon points="465,0 545,0 505,38" fill="#38bdf8" />
  <polygon points="525,0 605,0 565,52" fill="#244b7a" />
  <polygon points="585,0 665,0 625,32" fill="#1b365d" />
  <polygon points="645,0 725,0 685,58" fill="#60a5fa" />
  <polygon points="705,0 800,0 755,42" fill="#1e3a8a" />
  <polygon points="765,0 800,0 800,32" fill="#244b7a" />
  <polyline points="15,12 45,45 75,12 105,50 135,12 165,40 195,12 225,55 255,12 285,45 315,12 345,50 375,12 405,40 435,12 465,55 495,12 525,45 555,12 585,50 615,12 645,40 675,12 705,55 735,12 765,45 795,12" stroke="#ffffff" stroke-width="2.2" fill="none" opacity="0.65"/>
  <polygon points="365,40 385,15 405,40 385,30" fill="#f4a261" />
  <polygon points="685,40 705,15 725,40 705,30" fill="#38bdf8" />
  <polygon points="65,40 85,15 105,40 85,30" fill="#38bdf8" />
</svg>`;

export const GEOMETRIC_BOTTOM_BORDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 65" width="100%" height="48" preserveAspectRatio="none" style="display:block; margin: 0; padding: 0;">
  <polygon points="0,65 75,65 35,23" fill="#1b365d" />
  <polygon points="50,65 130,65 90,13" fill="#244b7a" />
  <polygon points="110,65 185,65 148,33" fill="#38bdf8" />
  <polygon points="165,65 245,65 205,7" fill="#1e3a8a" />
  <polygon points="225,65 305,65 265,27" fill="#60a5fa" />
  <polygon points="285,65 365,65 325,13" fill="#1b365d" />
  <polygon points="345,65 425,65 385,33" fill="#0284c7" />
  <polygon points="405,65 485,65 445,7" fill="#1e3a8a" />
  <polygon points="465,65 545,65 505,27" fill="#38bdf8" />
  <polygon points="525,65 605,65 565,13" fill="#244b7a" />
  <polygon points="585,65 665,65 625,33" fill="#1b365d" />
  <polygon points="645,65 725,65 685,7" fill="#60a5fa" />
  <polygon points="705,65 800,65 755,23" fill="#1e3a8a" />
  <polygon points="765,65 800,65 800,33" fill="#244b7a" />
  <polyline points="15,53 45,20 75,53 105,15 135,53 165,25 195,53 225,10 255,53 285,20 315,53 345,15 375,53 405,25 435,53 465,10 495,53 525,20 555,53 585,15 615,53 645,25 675,53 705,10 735,53 765,20 795,53" stroke="#ffffff" stroke-width="2.2" fill="none" opacity="0.65"/>
  <polygon points="365,25 385,50 405,25 385,35" fill="#f4a261" />
  <polygon points="685,25 705,50 725,25 705,35" fill="#38bdf8" />
  <polygon points="65,25 85,50 105,25 85,35" fill="#38bdf8" />
</svg>`;

// Helper: Circular Checkmark Badge
export const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 5px; flex-shrink: 0; display: inline-block;">
  <circle cx="8" cy="8" r="6.8" fill="#ffffff" stroke="#e76f51" stroke-width="1.8" />
  <path d="M4.5 8.2 L7 10.8 L11.5 5.5" fill="none" stroke="#e76f51" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

const ORANGE_LINE = `border-bottom: 1.5px solid #f4a261; padding-bottom: 4px; margin-bottom: 6px;`;

// Helper to filter only active/selected dimensions
export function getActiveDimensions(doc: RPPDocument) {
  const allDimensions = [
    { key: 'keimanan', label: 'Keimanan dan ketakwaan terhadap Tuhan YME' },
    { key: 'kewarganegaraan', label: 'Kewargaan' },
    { key: 'penalaranKritis', label: 'Penalaran Kritis' },
    { key: 'kreatif', label: 'Kreativitas' },
    { key: 'kolaborasi', label: 'Kolaborasi' },
    { key: 'kemandirian', label: 'Kemandirian' },
    { key: 'kesehatan', label: 'Kesehatan' },
    { key: 'komunikasi', label: 'Komunikasi' }
  ];
  return allDimensions.filter((d) => !!(doc.dimensiProfilLulusan as any)[d.key]);
}

// Helper to render mathematically centered, anti-drift SVG badges for cards
export function renderBadge(label: string, customWidth?: number): string {
  const width = customWidth || Math.max(92, Math.round(label.length * 8.2 + 32));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="22" viewBox="0 0 ${width} 22" style="position: absolute; top: -11px; left: 16px; display: block; z-index: 10;">
    <rect width="${width}" height="22" rx="5" ry="5" fill="#244b7a" />
    <text x="${width / 2}" y="11" fill="#ffffff" font-family="'Segoe UI', Arial, sans-serif" font-size="12.5" font-weight="bold" text-anchor="middle" dominant-baseline="central" alignment-baseline="central" letter-spacing="0.5">${label}</text>
  </svg>`;
}

// ======================================================================================
// 1. MODERN GEOMETRIC LAYOUT (PER-HALAMAN & ALL)
// ======================================================================================

export function generateModernPage1Html(doc: RPPDocument): string {
  const activeDims = getActiveDimensions(doc);

  return `
  <div class="a4-page-sheet modern-page page-1" style="width: 100%; height: 100%; min-height: 100%; max-height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #f6f9fc; position: relative; box-sizing: border-box; overflow: hidden; page-break-after: always; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 9pt; line-height: 1.35; color: #1e293b;">
    <div>
      ${GEOMETRIC_TOP_BORDER_SVG}

      <div style="padding: 10px 24px 6px 24px;">
        <!-- TITLE -->
        <div style="text-align: center; margin-bottom: 14px;">
          <div style="font-size: 18pt; font-weight: 800; letter-spacing: 2px; color: #1b365d; text-transform: uppercase;">
            RENCANA
          </div>
          <div style="font-size: 20pt; font-weight: 900; letter-spacing: 1.5px; color: #1b365d; text-transform: uppercase; margin-top: -2px;">
            PEMBELAJARAN MENDALAM
          </div>
          <div style="font-size: 8.5pt; color: #64748b; font-weight: 600; text-transform: uppercase; margin-top: 3px; letter-spacing: 1px;">
            SMK NEGERI 2 MAGELANG &bull; TAHUN AJARAN ${doc.sekolah.tahunAjaran || '2025/2026'}
          </div>
        </div>

        <!-- CARD 1: IDENTITAS -->
        <div style="position: relative; border: 1.8px solid #244b7a; border-radius: 10px; padding: 14px 18px 10px 18px; margin-top: 10px; margin-bottom: 14px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          ${renderBadge('Identitas')}
          <table style="width: 100%; border-collapse: collapse; border: none; font-size: 9pt;">
            <tr>
              <td style="width: 25%; padding: 3px 0; color: #1e293b; font-weight: 500;">Sekolah</td>
              <td style="width: 3%; padding: 3px 0; text-align: center;">:</td>
              <td style="padding: 3px 0; ${ORANGE_LINE} font-weight: 600; color: #0f172a;">${doc.sekolah.namaSekolah || 'SMK NEGERI 2 MAGELANG'}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; color: #1e293b; font-weight: 500;">Nama Guru</td>
              <td style="padding: 3px 0; text-align: center;">:</td>
              <td style="padding: 3px 0; ${ORANGE_LINE}">${doc.guru.namaGuru}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; color: #1e293b; font-weight: 500;">Mata Pelajaran</td>
              <td style="padding: 3px 0; text-align: center;">:</td>
              <td style="padding: 3px 0; ${ORANGE_LINE} font-weight: 600;">${doc.guru.mataPelajaran}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; color: #1e293b; font-weight: 500;">Kelas / Semester</td>
              <td style="padding: 3px 0; text-align: center;">:</td>
              <td style="padding: 3px 0; ${ORANGE_LINE}">${doc.guru.kelas} / ${doc.guru.semester}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; color: #1e293b; font-weight: 500;">Alokasi Waktu</td>
              <td style="padding: 3px 0; text-align: center;">:</td>
              <td style="padding: 3px 0; ${ORANGE_LINE}">${doc.pengaturan.jumlahJp} JP, @45 Menit (${doc.pengaturan.jumlahJp * doc.pengaturan.durasiJp} Menit)</td>
            </tr>
          </table>
        </div>

        <!-- CARD 2: IDENTIFIKASI -->
        <div style="position: relative; border: 1.8px solid #244b7a; border-radius: 10px; padding: 14px 18px 10px 18px; margin-top: 12px; margin-bottom: 14px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          ${renderBadge('Identifikasi')}

          <div style="margin-bottom: 8px;">
            <div style="display: flex; align-items: flex-start; margin-bottom: 2px;">
              <span style="width: 130px; font-weight: 500; color: #1e293b;">Peserta didik</span>
              <span style="margin-right: 8px;">:</span>
              <div style="flex: 1; ${ORANGE_LINE}">Peserta didik kelas ${doc.guru.kelas} program keahlian ${doc.guru.programKeahlian || 'SMK'} dengan karakteristik siap kerja.</div>
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <div style="display: flex; align-items: flex-start; margin-bottom: 2px;">
              <span style="width: 130px; font-weight: 500; color: #1e293b;">Materi Pelajaran</span>
              <span style="margin-right: 8px;">:</span>
              <div style="flex: 1; ${ORANGE_LINE} font-weight: 600; color: #0f172a;">${doc.karakteristik.strukturMateri || 'Materi Pokok Pembelajaran'}</div>
            </div>
          </div>

          <div>
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 6px;">
              Dimensi Profil Lulusan ${activeDims.length > 0 ? `(${activeDims.length} Dimensi Relevan)` : ''} :
            </div>
            ${activeDims.length === 0 ? `
              <div style="font-style: italic; color: #64748b; font-size: 8.5pt; padding: 2px 0;">
                (Tidak ada dimensi profil lulusan yang dicentang. Dimensi diselaraskan dengan aktivitas CP)
              </div>
            ` : `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; margin-left: 4px;">
                ${activeDims.map((d) => `
                  <div style="display: flex; align-items: center; font-size: 8.8pt; color: #1e293b;">
                    ${CHECK_ICON}
                    <span>${d.label}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- CARD 3: CAPAIAN PEMBELAJARAN -->
        <div style="position: relative; border: 1.8px solid #244b7a; border-radius: 10px; padding: 14px 18px 10px 18px; margin-top: 12px; margin-bottom: 8px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          ${renderBadge('Capaian Pembelajaran')}
          <div style="font-size: 8.8pt; text-align: justify; line-height: 1.45; color: #1e293b;">
            ${doc.capaianPembelajaran}
          </div>
        </div>
      </div>
    </div>

    ${GEOMETRIC_BOTTOM_BORDER_SVG}
  </div>
  `;
}

export function generateModernPage2Html(doc: RPPDocument): string {
  return `
  <div class="a4-page-sheet modern-page page-2" style="width: 100%; height: 100%; min-height: 100%; max-height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #f6f9fc; position: relative; box-sizing: border-box; overflow: hidden; page-break-after: always; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 9pt; line-height: 1.35; color: #1e293b;">
    <div>
      ${GEOMETRIC_TOP_BORDER_SVG}

      <div style="padding: 10px 24px 6px 24px;">
        <!-- CARD 1: DESAIN PEMBELAJARAN -->
        <div style="position: relative; border: 1.8px solid #244b7a; border-radius: 10px; padding: 14px 18px 10px 18px; margin-top: 10px; margin-bottom: 14px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          ${renderBadge('Desain Pembelajaran')}

          <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8.8pt;">
            <tr>
              <td style="width: 25%; vertical-align: top; padding: 3px 0; color: #1e293b; font-weight: 500;">Lintas Disiplin Ilmu</td>
              <td style="width: 3%; vertical-align: top; padding: 3px 0; text-align: center;">:</td>
              <td style="vertical-align: top; padding: 3px 0; ${ORANGE_LINE}">Informatika, Bahasa Inggris Teknis, Matematika Terapan, dan Budaya Kerja Industri 5R.</td>
            </tr>
            <tr>
              <td style="vertical-align: top; padding: 3px 0; color: #1e293b; font-weight: 500;">Tujuan Pembelajaran</td>
              <td style="vertical-align: top; padding: 3px 0; text-align: center;">:</td>
              <td style="vertical-align: top; padding: 3px 0; ${ORANGE_LINE}">
                ${doc.tujuanPembelajaran.map((tp, i) => `<div style="margin-bottom: 2px;">${i + 1}. ${tp}</div>`).join('')}
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top; padding: 3px 0; color: #1e293b; font-weight: 500;">Topik Pembelajaran</td>
              <td style="vertical-align: top; padding: 3px 0; text-align: center;">:</td>
              <td style="vertical-align: top; padding: 3px 0; ${ORANGE_LINE} font-weight: 600;">${doc.karakteristik.strukturMateri || 'Materi Pokok'}</td>
            </tr>
            <tr>
              <td style="vertical-align: top; padding: 3px 0; color: #1e293b; font-weight: 500;">Praktik Pedagogis</td>
              <td style="vertical-align: top; padding: 3px 0; text-align: center;">:</td>
              <td style="vertical-align: top; padding: 3px 0; ${ORANGE_LINE}">${doc.pengaturan.modelPembelajaran || 'Project Based Learning (PjBL)'}</td>
            </tr>
            <tr>
              <td style="vertical-align: top; padding: 3px 0; color: #1e293b; font-weight: 500;">Kemitraan Pembelajaran</td>
              <td style="vertical-align: top; padding: 3px 0; text-align: center;">:</td>
              <td style="vertical-align: top; padding: 3px 0; ${ORANGE_LINE}">${doc.kemitraan.lingkunganLuarSekolah || 'Mitra DU-DI Kota Magelang'} &bull; ${doc.kemitraan.masyarakat || 'Dukungan Orang Tua'}</td>
            </tr>
            <tr>
              <td style="vertical-align: top; padding: 3px 0; color: #1e293b; font-weight: 500;">Lingkungan Pembelajaran</td>
              <td style="vertical-align: top; padding: 3px 0; text-align: center;">:</td>
              <td style="vertical-align: top; padding: 3px 0; ${ORANGE_LINE}">${doc.kemitraan.lingkunganSekolah || 'Laboratorium Praktik SMK Negeri 2 Magelang & Perpustakaan'}</td>
            </tr>
            <tr>
              <td style="vertical-align: top; padding: 3px 0; color: #1e293b; font-weight: 500;">Pemanfaatan Digital</td>
              <td style="vertical-align: top; padding: 3px 0; text-align: center;">:</td>
              <td style="vertical-align: top; padding: 3px 0; ${ORANGE_LINE}">LMS SMK N 2 Magelang, Youtube, Mentimeter, Quizizz, Padlet, Canva</td>
            </tr>
          </table>
        </div>

        <!-- CARD 2: AWAL PEMBELAJARAN -->
        <div style="position: relative; border: 1.8px solid #244b7a; border-radius: 10px; padding: 14px 18px 10px 18px; margin-top: 10px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          ${renderBadge('Awal Pembelajaran')}

          <!-- PRINSIP PEMBELAJARAN ROW -->
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px; font-size: 8.8pt; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
            <span style="font-weight: 600;">Prinsip pembelajaran:</span>
            <span style="display: inline-flex; align-items: center;">${CHECK_ICON} Berkesadaran</span>
            <span style="display: inline-flex; align-items: center;">${CHECK_ICON} Bermakna</span>
            <span style="display: inline-flex; align-items: center;">${CHECK_ICON} Menyenangkan</span>
          </div>

          <div style="font-size: 8.8pt; text-align: justify; line-height: 1.45; white-space: pre-line; color: #1e293b;">
${doc.pengalamanPembelajaran.pendahuluan.deskripsi}
          </div>

          <div style="text-align: right; margin-top: 6px; font-size: 8.5pt; font-weight: 600; color: #244b7a;">
            Alokasi Waktu: ${doc.pengalamanPembelajaran.pendahuluan.waktu}
          </div>
        </div>
      </div>
    </div>

    ${GEOMETRIC_BOTTOM_BORDER_SVG}
  </div>
  `;
}

export function generateModernPage3Html(doc: RPPDocument): string {
  return `
  <div class="a4-page-sheet modern-page page-3" style="width: 100%; height: 100%; min-height: 100%; max-height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #f6f9fc; position: relative; box-sizing: border-box; overflow: hidden; page-break-after: always; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 8.8pt; line-height: 1.35; color: #1e293b;">
    <div>
      ${GEOMETRIC_TOP_BORDER_SVG}

      <div style="padding: 8px 24px 6px 24px;">
        <!-- CARD: INTI PEMBELAJARAN -->
        <div style="position: relative; border: 1.8px solid #244b7a; border-radius: 10px; padding: 12px 16px 8px 16px; margin-top: 8px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          ${renderBadge('Inti Pembelajaran')}

          <!-- PRINSIP PEMBELAJARAN ROW -->
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px; font-size: 8.5pt; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
            <span style="font-weight: 600;">Prinsip pembelajaran:</span>
            <span style="display: inline-flex; align-items: center;">${CHECK_ICON} Berkesadaran</span>
            <span style="display: inline-flex; align-items: center;">${CHECK_ICON} Bermakna</span>
            <span style="display: inline-flex; align-items: center;">${CHECK_ICON} Menyenangkan</span>
          </div>

          <!-- FASE-FASE INTI (6 FASE PjBL) -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${doc.pengalamanPembelajaran.kegiatanInti.map((f) => `
              <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 8px; background: #fafcff;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                  <div style="font-weight: 700; font-size: 8.5pt; color: #1b365d;">
                    ${f.fase}
                  </div>
                  <span style="background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 7.8pt; padding: 1px 5px; border-radius: 3px;">
                    ${f.waktu}
                  </span>
                </div>
                <div style="font-size: 8pt; text-align: justify; line-height: 1.3; color: #334155; white-space: pre-line;">
${f.deskripsi}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    ${GEOMETRIC_BOTTOM_BORDER_SVG}
  </div>
  `;
}

export function generateModernPage4Html(doc: RPPDocument): string {
  return `
  <div class="a4-page-sheet modern-page page-4" style="width: 100%; height: 100%; min-height: 100%; max-height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #f6f9fc; position: relative; box-sizing: border-box; overflow: hidden; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 9pt; line-height: 1.35; color: #1e293b;">
    <div>
      ${GEOMETRIC_TOP_BORDER_SVG}

      <div style="padding: 10px 24px 6px 24px;">
        <!-- CARD 1: AKHIR PEMBELAJARAN -->
        <div style="position: relative; border: 1.8px solid #244b7a; border-radius: 10px; padding: 14px 18px 10px 18px; margin-top: 10px; margin-bottom: 14px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          ${renderBadge('Akhir Pembelajaran')}

          <!-- PRINSIP PEMBELAJARAN ROW -->
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px; font-size: 8.8pt; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
            <span style="font-weight: 600;">Prinsip pembelajaran:</span>
            <span style="display: inline-flex; align-items: center;">${CHECK_ICON} Berkesadaran</span>
            <span style="display: inline-flex; align-items: center;">${CHECK_ICON} Bermakna</span>
            <span style="display: inline-flex; align-items: center;">${CHECK_ICON} Menyenangkan</span>
          </div>

          <div style="font-size: 8.8pt; text-align: justify; line-height: 1.45; white-space: pre-line; color: #1e293b;">
${doc.pengalamanPembelajaran.penutup.deskripsi}
          </div>

          <div style="text-align: right; margin-top: 4px; font-size: 8.5pt; font-weight: 600; color: #244b7a;">
            Alokasi Waktu: ${doc.pengalamanPembelajaran.penutup.waktu}
          </div>
        </div>

        <!-- CARD 2: ASESMEN PEMBELAJARAN -->
        <div style="position: relative; border: 1.8px solid #244b7a; border-radius: 10px; padding: 14px 18px 10px 18px; margin-top: 12px; margin-bottom: 18px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          ${renderBadge('Asesmen Pembelajaran')}

          <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8.8pt;">
            <tr>
              <td style="width: 28%; vertical-align: top; padding: 4px 0; color: #1e293b; font-weight: 500;">Asesmen Awal Pembelajaran</td>
              <td style="width: 3%; vertical-align: top; padding: 4px 0; text-align: center;">:</td>
              <td style="vertical-align: top; padding: 4px 0; ${ORANGE_LINE}">${doc.asesmen.asesmenAwal || 'Kuis singkat pengetahuan prasyarat via Quizizz / Google Forms'}</td>
            </tr>
            <tr>
              <td style="width: 28%; vertical-align: top; padding: 4px 0; color: #1e293b; font-weight: 500;">Asesmen Proses Pembelajaran</td>
              <td style="width: 3%; vertical-align: top; padding: 4px 0; text-align: center;">:</td>
              <td style="vertical-align: top; padding: 4px 0; ${ORANGE_LINE}">${doc.asesmen.asesmenProses || 'Observasi keaktifan diskusi, kinerja LKPD, dan penilaian sikap 5R'}</td>
            </tr>
            <tr>
              <td style="width: 28%; vertical-align: top; padding: 4px 0; color: #1e293b; font-weight: 500;">Asesmen Akhir Pembelajaran</td>
              <td style="width: 3%; vertical-align: top; padding: 4px 0; text-align: center;">:</td>
              <td style="vertical-align: top; padding: 4px 0; ${ORANGE_LINE}">${doc.asesmen.asesmenAkhir || 'Presentasi hasil projek, uji unjuk kerja, dan gelar karya produk'}</td>
            </tr>
          </table>
        </div>

        <!-- TANDA TANGAN -->
        <div style="margin-top: 18px; padding: 0 10px;">
          <table style="width: 100%; border-collapse: collapse; border: none; font-size: 9pt;">
            <tr>
              <td style="width: 50%; vertical-align: top; text-align: center; border: none;">
                <div style="color: #475569; margin-bottom: 2px;">Guru Mata Pelajaran</div>
                <div style="height: 48px;"></div>
                <div style="font-weight: 700; color: #0f172a; text-decoration: underline;">${doc.tandaTangan.guruNama || doc.guru.namaGuru}</div>
                <div style="font-size: 8pt; color: #64748b;">NIP/NIPPK. ${doc.tandaTangan.guruNip || doc.guru.nip || '-'}</div>
              </td>
              <td style="width: 50%; vertical-align: top; text-align: center; border: none;">
                <div style="color: #475569; margin-bottom: 2px;">Mengetahui</div>
                <div style="font-weight: 600; color: #1e293b;">Kepala Sekolah</div>
                <div style="height: 48px;"></div>
                <div style="font-weight: 700; color: #0f172a; text-decoration: underline;">${doc.tandaTangan.kepalaSekolahNama || doc.sekolah.namaKepalaSekolah || 'Kurniawan Basuki, S.Pd., M.T'}</div>
                <div style="font-size: 8pt; color: #64748b;">NIP. ${doc.tandaTangan.kepalaSekolahNip || doc.sekolah.nipKepalaSekolah || '196709291990031013'}</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    ${GEOMETRIC_BOTTOM_BORDER_SVG}
  </div>
  `;
}

export function generateModernRppHtml(doc: RPPDocument, page: 'all' | 1 | 2 | 3 | 4 = 'all'): string {
  if (page === 1) return generateModernPage1Html(doc);
  if (page === 2) return generateModernPage2Html(doc);
  if (page === 3) return generateModernPage3Html(doc);
  if (page === 4) return generateModernPage4Html(doc);

  return `
    <div class="rpp-document modern-theme" style="width: 100%; max-width: 820px; margin: 0 auto; background: transparent; padding: 0;">
      ${generateModernPage1Html(doc)}
      <div style="height: 18px;" class="print:hidden"></div>
      ${generateModernPage2Html(doc)}
      <div style="height: 18px;" class="print:hidden"></div>
      ${generateModernPage3Html(doc)}
      <div style="height: 18px;" class="print:hidden"></div>
      ${generateModernPage4Html(doc)}
    </div>
  `;
}

// ======================================================================================
// 2. KLASIK DINAS LAYOUT (PER-HALAMAN & ALL)
// ======================================================================================

function renderKopSurat(doc: RPPDocument): string {
  const logoJateng = doc.sekolah.logoJatengUrl
    ? `<img src="${doc.sekolah.logoJatengUrl}" alt="Logo Jateng" style="max-height: 68px; max-width: 65px; object-fit: contain;" />`
    : LOGO_JATENG_SVG;

  const logoSekolah = doc.sekolah.logoSekolahUrl
    ? `<img src="${doc.sekolah.logoSekolahUrl}" alt="Logo SMK N 2" style="max-height: 68px; max-width: 65px; object-fit: contain;" />`
    : LOGO_SMKN2_SVG;

  return `
  <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 2px;">
    <tr>
      <td style="width: 75px; vertical-align: middle; text-align: center; border: none; padding: 0 4px 0 0;">
        ${logoJateng}
      </td>
      <td style="text-align: center; vertical-align: middle; border: none; padding: 0 6px;">
        <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">PEMERINTAH PROVINSI JAWA TENGAH</div>
        <div style="font-size: 12.5pt; font-weight: bold; text-transform: uppercase; margin: 1px 0;">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
        <div style="font-size: 13.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin: 1px 0;">SEKOLAH MENENGAH KEJURUAN NEGERI 2 MAGELANG</div>
        <div style="font-size: 8pt; color: #000; margin-top: 3px; line-height: 1.25;">
          ${doc.sekolah.alamat || 'Jl. A Yani 135A, Kramat Selatan, Kec. Magelang Utara'}<br/>
          Kode Pos 56115, Telepon 0293-362577, Faksimile 0293-313172, laman http://smkn2mgl.sch.id
        </div>
      </td>
      <td style="width: 75px; vertical-align: middle; text-align: center; border: none; padding: 0 0 0 4px;">
        ${logoSekolah}
      </td>
    </tr>
  </table>
  <div style="border-top: 2.5px solid #000; border-bottom: 1px solid #000; height: 3px; margin: 4px 0 16px 0;"></div>
  `;
}

function renderClassicFooter(doc: RPPDocument): string {
  const mapelTitle = (doc.guru?.mataPelajaran || 'MATA PELAJARAN').toUpperCase();
  return `
  <div style="background-color: #3b71ca; color: #ffffff; padding: 5px 14px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 8.5pt; font-weight: bold;">
    <span>RPP MATA PELAJARAN ${mapelTitle}........</span>
    <span>SMK N 2 MAGELANG</span>
  </div>
  `;
}

export function generateClassicPage1Html(doc: RPPDocument): string {
  const activeDimensions = getActiveDimensions(doc);

  return `
  <div class="a4-page-sheet classic-page page-1" style="width: 100%; height: 100%; min-height: 100%; max-height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: white; padding: 10mm 15mm 8mm 15mm; box-sizing: border-box; overflow: hidden; page-break-after: always; font-family: Arial, Helvetica, sans-serif; font-size: 9pt; line-height: 1.3; color: #000;">
    <div>
      ${renderKopSurat(doc)}

      <div style="text-align: center; margin-bottom: 12px;">
        <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">PERENCANAAN PEMBELAJARAN MENDALAM</h2>
        <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin-top: 1px;">TAHUN AJARAN ${doc.sekolah.tahunAjaran || '2025/2026'}</div>
      </div>

      <div style="font-size: 9.5pt; font-weight: bold; margin-bottom: 4px;">I. IDENTIFIKASI</div>

      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; font-size: 8.8pt;">
        <thead>
          <tr>
            <th colspan="3" style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; font-size: 9.5pt; color: #000;">
              IDENTITAS PPM
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="width: 28%; border: 1px solid #000; padding: 2.5px 8px;">Sekolah</td>
            <td style="width: 3%; border: 1px solid #000; padding: 2.5px 4px; text-align: center;">:</td>
            <td style="border: 1px solid #000; padding: 2.5px 8px; font-weight: bold;">${doc.sekolah.namaSekolah || 'SMK NEGERI 2 MAGELANG'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">Nama Guru</td>
            <td style="border: 1px solid #000; padding: 2.5px 4px; text-align: center;">:</td>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">${doc.guru.namaGuru}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">Mata Pelajaran</td>
            <td style="border: 1px solid #000; padding: 2.5px 4px; text-align: center;">:</td>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">${doc.guru.mataPelajaran}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">Fase/Kelas/Semester</td>
            <td style="border: 1px solid #000; padding: 2.5px 4px; text-align: center;">:</td>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">${doc.guru.fase} / ${doc.guru.kelas} / ${doc.guru.semester}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">Elemen / CP</td>
            <td style="border: 1px solid #000; padding: 2.5px 4px; text-align: center;">:</td>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">${doc.karakteristik.strukturMateri || 'Elemen Pembelajaran'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">Alokasi Waktu</td>
            <td style="border: 1px solid #000; padding: 2.5px 4px; text-align: center;">:</td>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">${doc.pengaturan.jumlahJp} JP, @45 Menit</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">Model</td>
            <td style="border: 1px solid #000; padding: 2.5px 4px; text-align: center;">:</td>
            <td style="border: 1px solid #000; padding: 2.5px 8px;">${doc.pengaturan.modelPembelajaran || 'Project Based Learning (PjBL)'}</td>
          </tr>
        </tbody>
      </table>

      <!-- DIMENSI PROFIL LULUSAN HANYA AKTIF -->
      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; font-size: 8.8pt;">
        <thead>
          <tr>
            <th colspan="3" style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; font-size: 9.5pt; color: #000;">
              DIMENSI PROFIL LULUSAN
            </th>
          </tr>
        </thead>
        <tbody>
          ${activeDimensions.length === 0 ? `
            <tr>
              <td colspan="3" style="border: 1px solid #000; padding: 5px 8px; text-align: center; font-style: italic; color: #555;">
                (Dimensi profil lulusan disesuaikan dengan aktivitas pembelajaran CP ini)
              </td>
            </tr>
          ` : activeDimensions.map((dim) => `
            <tr>
              <td style="width: 8%; border: 1px solid #000; padding: 2.5px 8px; text-align: center; font-weight: bold; font-size: 10pt;">&#8730;</td>
              <td style="width: 4%; border: 1px solid #000; padding: 2.5px 4px; text-align: center;">:</td>
              <td style="border: 1px solid #000; padding: 2.5px 8px;">${dim.label}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="font-size: 9.5pt; font-weight: bold; margin-bottom: 4px;">II. KARAKTERISTIK MATA PELAJARAN</div>
      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; font-size: 8.8pt;">
        <thead>
          <tr>
            <th style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; width: 35%; font-weight: bold; color: #000;">KARAKTERISTIK</th>
            <th style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; width: 65%; font-weight: bold; color: #000;">KETERANGAN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 3px 8px;">a. Jenis pengetahuan yang akan dicapai</td>
            <td style="border: 1px solid #000; padding: 3px 8px;">${doc.karakteristik.jenisPengetahuan}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px 8px;">b. Relevansi dengan kehidupan nyata peserta didik</td>
            <td style="border: 1px solid #000; padding: 3px 8px;">${doc.karakteristik.relevansiKehidupanNyata}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px 8px;">c. Tingkat kesulitan</td>
            <td style="border: 1px solid #000; padding: 3px 8px;">${doc.karakteristik.tingkatKesulitan}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px 8px;">d. Struktur Materi</td>
            <td style="border: 1px solid #000; padding: 3px 8px;">${doc.karakteristik.strukturMateri}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px 8px;">e. Integrasi Nilai dan karakter</td>
            <td style="border: 1px solid #000; padding: 3px 8px;">${doc.karakteristik.integrasiNilaiKarakter}</td>
          </tr>
        </tbody>
      </table>
    </div>

    ${renderClassicFooter(doc)}
  </div>
  `;
}

export function generateClassicPage2Html(doc: RPPDocument): string {
  return `
  <div class="a4-page-sheet classic-page page-2" style="width: 100%; height: 100%; min-height: 100%; max-height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: white; padding: 10mm 15mm 8mm 15mm; box-sizing: border-box; overflow: hidden; page-break-after: always; font-family: Arial, Helvetica, sans-serif; font-size: 9pt; line-height: 1.3; color: #000;">
    <div>
      <div style="font-size: 9.5pt; font-weight: bold; margin-bottom: 4px;">III. KOMPONEN INTI</div>

      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; font-size: 8.8pt;">
        <thead>
          <tr>
            <th style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; color: #000;">CAPAIAN PEMBELAJARAN</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="border: 1px solid #000; padding: 8px 10px; text-align: justify; line-height: 1.35;">${doc.capaianPembelajaran}</td></tr>
        </tbody>
      </table>

      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; font-size: 8.8pt;">
        <thead>
          <tr>
            <th style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; color: #000;">TUJUAN PEMBELAJARAN</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="border: 1px solid #000; padding: 6px 10px; line-height: 1.35;">${doc.tujuanPembelajaran.map((tp) => `<div style="margin-bottom: 3px;">${tp}</div>`).join('')}</td></tr>
        </tbody>
      </table>

      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; font-size: 8.8pt;">
        <thead>
          <tr><th colspan="2" style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; color: #000;">KEMITRAAN PEMBELAJARAN</th></tr>
        </thead>
        <tbody>
          <tr><td style="width: 30%; border: 1px solid #000; padding: 4px 8px;">Lingkungan Sekolah</td><td style="border: 1px solid #000; padding: 4px 8px;">${doc.kemitraan.lingkunganSekolah || 'Guru mata pelajaran..., ...., ....'}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 4px 8px;">Lingkungan Luar Sekolah</td><td style="border: 1px solid #000; padding: 4px 8px;">${doc.kemitraan.lingkunganLuarSekolah || 'Mitra DU-DI di Kota Magelang'}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 4px 8px;">Masyarakat</td><td style="border: 1px solid #000; padding: 4px 8px;">${doc.kemitraan.masyarakat || 'Orang tua yang dapat membantu memberikan data kontekstual.'}</td></tr>
        </tbody>
      </table>

      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; font-size: 8.8pt;">
        <thead>
          <tr><th colspan="2" style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; color: #000;">PEMANFAATAN DIGITAL</th></tr>
        </thead>
        <tbody>
          <tr><td style="width: 30%; border: 1px solid #000; padding: 4px 8px;">Perencanaan Pembelajaran</td><td style="border: 1px solid #000; padding: 4px 8px;">${doc.pemanfaatanDigital.perencanaan}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 4px 8px;">Pelaksanaan Pembelajaran</td><td style="border: 1px solid #000; padding: 4px 8px;">${doc.pemanfaatanDigital.pelaksanaan}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 4px 8px;">Asesmen Pembelajaran</td><td style="border: 1px solid #000; padding: 4px 8px;">${doc.pemanfaatanDigital.asesmen}</td></tr>
        </tbody>
      </table>

      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; font-size: 8.8pt;">
        <thead>
          <tr><th colspan="3" style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; color: #000;">PENGALAMAN PEMBELAJARAN</th></tr>
          <tr>
            <th style="background-color: #00b0f0; border: 1px solid #000; padding: 3px 8px; text-align: center; width: 22%; font-weight: bold; color: #000;">KEGIATAN</th>
            <th style="background-color: #00b0f0; border: 1px solid #000; padding: 3px 8px; text-align: center; width: 63%; font-weight: bold; color: #000;">DESKRIPSI</th>
            <th style="background-color: #00b0f0; border: 1px solid #000; padding: 3px 8px; text-align: center; width: 15%; font-weight: bold; color: #000;">WAKTU</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 6px; vertical-align: top; font-weight: bold;">1. Pendahuluan<br/><span style="font-weight: normal; font-size: 8.2pt;">Mindful,<br/>Meaningful.</span></td>
            <td style="border: 1px solid #000; padding: 6px; text-align: justify; white-space: pre-line; line-height: 1.35;">${doc.pengalamanPembelajaran.pendahuluan.deskripsi}</td>
            <td style="border: 1px solid #000; padding: 6px; text-align: center; vertical-align: top;">${doc.pengalamanPembelajaran.pendahuluan.waktu}</td>
          </tr>
        </tbody>
      </table>
    </div>

    ${renderClassicFooter(doc)}
  </div>
  `;
}

export function generateClassicPage3Html(doc: RPPDocument): string {
  return `
  <div class="a4-page-sheet classic-page page-3" style="width: 100%; height: 100%; min-height: 100%; max-height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: white; padding: 10mm 15mm 8mm 15mm; box-sizing: border-box; overflow: hidden; page-break-after: always; font-family: Arial, Helvetica, sans-serif; font-size: 8.8pt; line-height: 1.3; color: #000;">
    <div>
      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; font-size: 8.5pt;">
        <tbody>
          <tr>
            <td rowspan="${doc.pengalamanPembelajaran.kegiatanInti.length * 2}" style="width: 20%; border: 1px solid #000; padding: 6px; vertical-align: top; font-weight: bold;">
              2. Inti<br/><span style="font-weight: normal; font-size: 8pt; line-height: 1.4;">Memahami<br/>Mengaplikasi<br/>Merefleksi</span>
            </td>
            <td style="width: 65%; background-color: #00b0f0; border: 1px solid #000; padding: 3px 6px; font-weight: bold; text-align: center; color: #000;">
              ${doc.pengalamanPembelajaran.kegiatanInti[0]?.fase || 'Fase 1. Pertanyaan mendasar (Memahami)'}
            </td>
            <td style="width: 15%; border: 1px solid #000; padding: 3px 6px; text-align: center; font-size: 8pt;">
              ${doc.pengalamanPembelajaran.kegiatanInti[0]?.waktu || '... menit'}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="border: 1px solid #000; padding: 4px 6px; text-align: justify; white-space: pre-line; line-height: 1.3;">
${doc.pengalamanPembelajaran.kegiatanInti[0]?.deskripsi || ''}
            </td>
          </tr>

          ${doc.pengalamanPembelajaran.kegiatanInti.slice(1).map((fase) => `
            <tr>
              <td style="background-color: #00b0f0; border: 1px solid #000; padding: 3px 6px; font-weight: bold; text-align: center; color: #000;">${fase.fase}</td>
              <td style="border: 1px solid #000; padding: 3px 6px; text-align: center; font-size: 8pt;">${fase.waktu}</td>
            </tr>
            <tr>
              <td colspan="2" style="border: 1px solid #000; padding: 4px 6px; text-align: justify; white-space: pre-line; line-height: 1.3;">${fase.deskripsi}</td>
            </tr>
          `).join('')}

          <tr>
            <td style="border: 1px solid #000; padding: 6px; vertical-align: top; font-weight: bold;">3. Penutup</td>
            <td style="border: 1px solid #000; padding: 6px; text-align: justify; white-space: pre-line; line-height: 1.3;">${doc.pengalamanPembelajaran.penutup.deskripsi}</td>
            <td style="border: 1px solid #000; padding: 6px; text-align: center; vertical-align: top;">${doc.pengalamanPembelajaran.penutup.waktu}</td>
          </tr>
        </tbody>
      </table>
    </div>

    ${renderClassicFooter(doc)}
  </div>
  `;
}

export function generateClassicPage4Html(doc: RPPDocument): string {
  return `
  <div class="a4-page-sheet classic-page page-4" style="width: 100%; height: 100%; min-height: 100%; max-height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: white; padding: 10mm 15mm 8mm 15mm; box-sizing: border-box; overflow: hidden; font-family: Arial, Helvetica, sans-serif; font-size: 8.8pt; line-height: 1.3; color: #000;">
    <div>
      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; font-size: 8.5pt;">
        <thead>
          <tr><th colspan="2" style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; color: #000;">ASESMEN PEMBELAJARAN</th></tr>
        </thead>
        <tbody>
          <tr><td style="width: 30%; border: 1px solid #000; padding: 4px 8px;">Asesmen Awal<br/>(Formatif)</td><td style="border: 1px solid #000; padding: 4px 8px;">${doc.asesmen.asesmenAwal}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 4px 8px;">Asesmen Proses<br/>(Formatif)</td><td style="border: 1px solid #000; padding: 4px 8px;">${doc.asesmen.asesmenProses}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 4px 8px;">Asesmen Akhir<br/>(Sumatif)</td><td style="border: 1px solid #000; padding: 4px 8px;">${doc.asesmen.asesmenAkhir}</td></tr>
        </tbody>
      </table>

      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; font-size: 8.5pt;">
        <thead>
          <tr><th colspan="2" style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; color: #000;">REMIDIAL DAN PENGAYAAN</th></tr>
        </thead>
        <tbody>
          <tr><td style="width: 25%; border: 1px solid #000; padding: 5px 8px; vertical-align: top;">Remidial</td><td style="border: 1px solid #000; padding: 5px 8px; text-align: justify; white-space: pre-line;">${doc.remedialDanPengayaan.remedial}</td></tr>
          <tr><td style="width: 25%; border: 1px solid #000; padding: 5px 8px; vertical-align: top;">Pengayaan</td><td style="border: 1px solid #000; padding: 5px 8px; text-align: justify; white-space: pre-line;">${doc.remedialDanPengayaan.pengayaan}</td></tr>
        </tbody>
      </table>

      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; font-size: 8.5pt;">
        <thead>
          <tr><th style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; color: #000;">GLOSARIUM</th></tr>
        </thead>
        <tbody>
          <tr><td style="border: 1px solid #000; padding: 4px 8px;">${(doc.glosarium || []).map((item) => `<div><strong>${item.istilah}</strong>: ${item.definisi}</div>`).join('')}</td></tr>
        </tbody>
      </table>

      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 12px; font-size: 8.5pt;">
        <thead>
          <tr><th style="background-color: #00b0f0; border: 1px solid #000; padding: 4px 8px; text-align: center; font-weight: bold; color: #000;">DAFTAR PUSTAKA</th></tr>
        </thead>
        <tbody>
          <tr><td style="border: 1px solid #000; padding: 4px 8px;">${(doc.daftarPustaka || []).map((pustaka) => `<div style="margin-bottom: 2px;">${pustaka}</div>`).join('')}</td></tr>
        </tbody>
      </table>

      <div style="margin-top: 12px; margin-bottom: 8px;">
        <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8.8pt;">
          <tr>
            <td style="width: 50%; vertical-align: top; text-align: center; border: none;">
              <div>Mengetahui</div>
              <div>Kepala Sekolah</div>
              <div style="height: 45px;"></div>
              <div style="font-weight: bold; text-decoration: underline;">${doc.tandaTangan.kepalaSekolahNama || doc.sekolah.namaKepalaSekolah || 'Kurniawan Basuki, S.Pd., M.T'}</div>
              <div>NIP. ${doc.tandaTangan.kepalaSekolahNip || doc.sekolah.nipKepalaSekolah || '196709291990031013'}</div>
            </td>
            <td style="width: 50%; vertical-align: top; text-align: center; border: none;">
              <div>${doc.tandaTangan.tempatTanggal || `${doc.sekolah.kotaKabupaten || 'Kota Magelang'}, 13 Juli 2026`}</div>
              <div>Guru Mata Pelajaran</div>
              <div style="height: 45px;"></div>
              <div style="font-weight: bold; text-decoration: underline;">${doc.tandaTangan.guruNama || doc.guru.namaGuru}</div>
              <div>NIP/NIPPK. ${doc.tandaTangan.guruNip || doc.guru.nip || '-'}</div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    ${renderClassicFooter(doc)}
  </div>
  `;
}

export function generateClassicRppHtml(doc: RPPDocument, page: 'all' | 1 | 2 | 3 | 4 = 'all'): string {
  if (page === 1) return generateClassicPage1Html(doc);
  if (page === 2) return generateClassicPage2Html(doc);
  if (page === 3) return generateClassicPage3Html(doc);
  if (page === 4) return generateClassicPage4Html(doc);

  return `
    <div class="rpp-document classic-theme" style="width: 100%; max-width: 820px; margin: 0 auto; background: transparent; padding: 0;">
      ${generateClassicPage1Html(doc)}
      <div style="height: 18px;" class="print:hidden"></div>
      ${generateClassicPage2Html(doc)}
      <div style="height: 18px;" class="print:hidden"></div>
      ${generateClassicPage3Html(doc)}
      <div style="height: 18px;" class="print:hidden"></div>
      ${generateClassicPage4Html(doc)}
    </div>
  `;
}

// Master HTML Renderer
export function generateRppHtml(
  doc: RPPDocument,
  templateMode: 'modern' | 'classic' = 'modern',
  page: 'all' | 1 | 2 | 3 | 4 = 'all'
): string {
  if (templateMode === 'classic') {
    return generateClassicRppHtml(doc, page);
  }
  return generateModernRppHtml(doc, page);
}

// ======================================================================================
// 3. VECTOR PDF BACKUP RENDERER (jsPDF)
// ======================================================================================

export function renderRppPagesIntoPdf(
  pdf: jsPDF,
  doc: RPPDocument,
  templateMode: 'modern' | 'classic' = 'modern'
): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  let cursorY = 22;

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(27, 54, 93);
  pdf.text('RENCANA', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 7;
  pdf.setFontSize(17);
  pdf.text('PEMBELAJARAN MENDALAM', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 9;

  // Box 1: Identitas
  pdf.setFillColor(36, 75, 122);
  pdf.roundedRect(margin, cursorY, 32, 6, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8.5);
  pdf.text('Identitas', margin + 6, cursorY + 4.2);

  cursorY += 7;
  const identitasRows = [
    ['Sekolah', ':', doc.sekolah.namaSekolah || 'SMK NEGERI 2 MAGELANG'],
    ['Nama Guru', ':', doc.guru.namaGuru],
    ['Mata Pelajaran', ':', doc.guru.mataPelajaran],
    ['Kelas / Semester', ':', `${doc.guru.kelas} / ${doc.guru.semester}`],
    ['Alokasi Waktu', ':', `${doc.pengaturan.jumlahJp} JP, @45 Menit`]
  ];

  autoTable(pdf, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: identitasRows,
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 36, fontStyle: 'bold' },
      1: { cellWidth: 5, halign: 'center' },
      2: { cellWidth: contentWidth - 41 }
    }
  });

  cursorY = (pdf as any).lastAutoTable.finalY + 6;

  // Box 2: Identifikasi
  pdf.setFillColor(36, 75, 122);
  pdf.roundedRect(margin, cursorY, 34, 6, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8.5);
  pdf.text('Identifikasi', margin + 6, cursorY + 4.2);

  cursorY += 7;
  const activeDims = getActiveDimensions(doc);

  const identifikasiRows = [
    ['Peserta didik', ':', `Peserta didik kelas ${doc.guru.kelas} program keahlian ${doc.guru.programKeahlian || 'SMK'}`],
    ['Materi Pelajaran', ':', doc.karakteristik.strukturMateri || 'Materi Pokok Pembelajaran'],
    ['Dimensi Profil Lulusan', ':', activeDims.length > 0 ? activeDims.map((d) => `[V] ${d.label}`).join('   |   ') : '(Diselaraskan dengan CP)']
  ];

  autoTable(pdf, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: identifikasiRows,
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: 5, halign: 'center' },
      2: { cellWidth: contentWidth - 47 }
    }
  });

  cursorY = (pdf as any).lastAutoTable.finalY + 6;

  // Box 3: Capaian Pembelajaran
  pdf.setFillColor(36, 75, 122);
  pdf.roundedRect(margin, cursorY, 48, 6, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8.5);
  pdf.text('Capaian Pembelajaran', margin + 6, cursorY + 4.2);

  cursorY += 7;
  autoTable(pdf, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: [[doc.capaianPembelajaran]],
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 3, textColor: [30, 41, 59] }
  });

  // PAGE 2: Desain Pembelajaran & Awal
  pdf.addPage();
  cursorY = 22;

  pdf.setFillColor(36, 75, 122);
  pdf.roundedRect(margin, cursorY, 45, 6, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8.5);
  pdf.text('Desain Pembelajaran', margin + 6, cursorY + 4.2);
  cursorY += 7;

  const desainRows = [
    ['Lintas Disiplin Ilmu', ':', 'Informatika, Bahasa Inggris Teknis, Matematika Terapan, dan Budaya Kerja 5R'],
    ['Tujuan Pembelajaran', ':', doc.tujuanPembelajaran.join('\n')],
    ['Topik Pembelajaran', ':', doc.karakteristik.strukturMateri || 'Materi Pokok'],
    ['Praktik Pedagogis', ':', doc.pengaturan.modelPembelajaran || 'Project Based Learning (PjBL)'],
    ['Kemitraan Pembelajaran', ':', `${doc.kemitraan.lingkunganLuarSekolah || 'Mitra DU-DI'} & Orang Tua`],
    ['Lingkungan Pembelajaran', ':', doc.kemitraan.lingkunganSekolah || 'Lab Praktik SMK N 2 Magelang'],
    ['Pemanfaatan Digital', ':', doc.pemanfaatanDigital.perencanaan || 'LMS, Youtube, Quizizz, Canva, Padlet']
  ];

  autoTable(pdf, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: desainRows,
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 46, fontStyle: 'bold' },
      1: { cellWidth: 5, halign: 'center' },
      2: { cellWidth: contentWidth - 51 }
    }
  });

  cursorY = (pdf as any).lastAutoTable.finalY + 6;

  // Box: Awal Pembelajaran
  pdf.setFillColor(36, 75, 122);
  pdf.roundedRect(margin, cursorY, 42, 6, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8.5);
  pdf.text('Awal Pembelajaran', margin + 6, cursorY + 4.2);
  cursorY += 7;

  autoTable(pdf, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: [
      ['Prinsip:', '[V] Berkesadaran   [V] Bermakna   [V] Menyenangkan'],
      ['Aktivitas:', doc.pengalamanPembelajaran.pendahuluan.deskripsi],
      ['Waktu:', doc.pengalamanPembelajaran.pendahuluan.waktu]
    ],
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: 'bold' },
      1: { cellWidth: contentWidth - 24 }
    }
  });

  // PAGE 3: Inti Pembelajaran
  pdf.addPage();
  cursorY = 22;

  pdf.setFillColor(36, 75, 122);
  pdf.roundedRect(margin, cursorY, 40, 6, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8.5);
  pdf.text('Inti Pembelajaran', margin + 6, cursorY + 4.2);
  cursorY += 7;

  const intiRows: any[] = [];
  intiRows.push(['Prinsip:', '[V] Berkesadaran   [V] Bermakna   [V] Menyenangkan', '']);
  doc.pengalamanPembelajaran.kegiatanInti.forEach((f) => {
    intiRows.push([f.fase, f.deskripsi, f.waktu]);
  });

  autoTable(pdf, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: intiRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, textColor: [30, 41, 59] },
    headStyles: { fillColor: [36, 75, 122], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: contentWidth - 62 },
      2: { cellWidth: 20, halign: 'center', fontStyle: 'bold' }
    }
  });

  // PAGE 4: Akhir, Asesmen & Tanda Tangan
  pdf.addPage();
  cursorY = 22;

  pdf.setFillColor(36, 75, 122);
  pdf.roundedRect(margin, cursorY, 42, 6, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8.5);
  pdf.text('Akhir Pembelajaran', margin + 6, cursorY + 4.2);
  cursorY += 7;

  autoTable(pdf, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: [
      ['Prinsip:', '[V] Berkesadaran   [V] Bermakna   [V] Menyenangkan'],
      ['Aktivitas:', doc.pengalamanPembelajaran.penutup.deskripsi],
      ['Waktu:', doc.pengalamanPembelajaran.penutup.waktu]
    ],
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: 'bold' },
      1: { cellWidth: contentWidth - 24 }
    }
  });

  cursorY = (pdf as any).lastAutoTable.finalY + 6;

  // Box: Asesmen Pembelajaran
  pdf.setFillColor(36, 75, 122);
  pdf.roundedRect(margin, cursorY, 48, 6, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8.5);
  pdf.text('Asesmen Pembelajaran', margin + 6, cursorY + 4.2);
  cursorY += 7;

  autoTable(pdf, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: [
      ['Asesmen Awal', ':', doc.asesmen.asesmenAwal || 'Kuis singkat pengetahuan prasyarat via Quizizz / Google Forms'],
      ['Asesmen Proses', ':', doc.asesmen.asesmenProses || 'Observasi keaktifan diskusi, kinerja LKPD, dan penilaian sikap 5R'],
      ['Asesmen Akhir', ':', doc.asesmen.asesmenAkhir || 'Presentasi hasil projek, uji unjuk kerja, dan gelar karya produk']
    ],
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 36, fontStyle: 'bold' },
      1: { cellWidth: 5, halign: 'center' },
      2: { cellWidth: contentWidth - 41 }
    }
  });

  cursorY = (pdf as any).lastAutoTable.finalY + 14;

  // Signatures
  const sigColWidth = contentWidth / 2;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);

  pdf.text('Guru Mata Pelajaran', margin + 20, cursorY);
  pdf.text('Mengetahui,', margin + sigColWidth + 20, cursorY - 4);
  pdf.text('Kepala Sekolah', margin + sigColWidth + 20, cursorY);

  cursorY += 22;

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text(doc.tandaTangan.guruNama || doc.guru.namaGuru, margin + 20, cursorY);
  pdf.text(doc.tandaTangan.kepalaSekolahNama || doc.sekolah.namaKepalaSekolah || 'Kurniawan Basuki, S.Pd., M.T', margin + sigColWidth + 20, cursorY);

  cursorY += 4;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`NIP/NIPPK. ${doc.tandaTangan.guruNip || doc.guru.nip || '-'}`, margin + 20, cursorY);
  pdf.text(`NIP. ${doc.tandaTangan.kepalaSekolahNip || doc.sekolah.nipKepalaSekolah || '196709291990031013'}`, margin + sigColWidth + 20, cursorY);
}

// ======================================================================================
// 4. PIXEL-PERFECT PDF EXPORTER (MATCHES PREVIEW 100%)
// ======================================================================================

export async function exportRppToPdf(
  doc: RPPDocument,
  templateMode: 'modern' | 'classic' = 'modern',
  pageNumber: 'all' | 1 | 2 | 3 | 4 = 'all',
  existingImages?: Record<number, string>,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pagesToRender: (1 | 2 | 3 | 4)[] = pageNumber === 'all' ? [1, 2, 3, 4] : [pageNumber];

  try {
    for (let i = 0; i < pagesToRender.length; i++) {
      const p = pagesToRender[i];
      let imgData = existingImages?.[p];

      if (!imgData) {
        if (onProgress) onProgress(i + 1, pagesToRender.length, `Mengambil screenshot Halaman ${p} (HD 300 DPI)...`);
        const captured = await captureRppPageScreenshot(doc, templateMode, p, 2.5);
        imgData = captured.dataUrl;
      } else {
        if (onProgress) onProgress(i + 1, pagesToRender.length, `Menyusun screenshot Halaman ${p} ke PDF...`);
      }

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Embed lossless high-res screenshot directly onto A4 page (210 x 297 mm, exact 1:1.414 ratio)
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
    }

    if (onProgress) onProgress(pagesToRender.length, pagesToRender.length, 'Menyimpan file PDF...');

    let filename = getRppFileName(doc, 'pdf');
    if (pageNumber !== 'all') {
      filename = filename.replace('.pdf', `_HALAMAN_${pageNumber}_HD.pdf`);
    }
    pdf.save(filename);
  } catch (err) {
    console.warn('Screenshot-based PDF compilation error, falling back to vector:', err);
    renderRppPagesIntoPdf(pdf, doc, templateMode);
    pdf.save(getRppFileName(doc, 'pdf'));
  }
}

/**
 * Kompilasi langsung dokumen PDF dari seluruh gambar screenshot halaman (1 s.d. 4).
 * Menjamin 100% tata letak terkunci persis seperti pratinjau, bebas dari pergeseran Word/PDF.
 */
export async function exportPdfFromScreenshots(
  doc: RPPDocument,
  templateMode: 'modern' | 'classic' = 'modern',
  existingImages?: Record<number, string>,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<void> {
  return exportRppToPdf(doc, templateMode, 'all', existingImages, onProgress);
}

// ======================================================================================
// 4B. ULTRA HIGH-RESOLUTION FULL-PAGE SCREENSHOT GENERATOR (HD 300 DPI EQUIVALENT)
// Solves format-shifting issues in Word/PDF by generating pixel-perfect PNG images
// ======================================================================================

/**
 * Capture an individual RPP page as an ultra high-resolution PNG image (300 DPI equivalent)
 * @param doc The RPPDocument
 * @param templateMode 'modern' | 'classic'
 * @param pageNumber 1 | 2 | 3 | 4
 * @param scale Quality scale factor (default 2.5 for ~1985 x 2807 px crisp text and graphics)
 */
export async function captureRppPageScreenshot(
  doc: RPPDocument,
  templateMode: 'modern' | 'classic' = 'modern',
  pageNumber: 1 | 2 | 3 | 4,
  scale: number = 2.5
): Promise<{ blob: Blob; dataUrl: string; filename: string }> {
  // Save current scroll coordinates and temporarily scroll to top-left
  // so html2canvas viewport & document origin align at (0, 0)
  const origScrollX = window.scrollX || window.pageXOffset || 0;
  const origScrollY = window.scrollY || window.pageYOffset || 0;
  if (origScrollX !== 0 || origScrollY !== 0) {
    window.scrollTo(0, 0);
  }

  // Dedicated container at viewport coordinate (0, 0) with A4 dimensions (794 x 1123 px at 96 DPI)
  // Kept behind high z-index modal so user sees loading overlay while html2canvas renders with 100% precision
  const container = document.createElement('div');
  container.id = `rpp-page-ss-${pageNumber}-${Date.now()}`;
  container.style.position = 'fixed';
  container.style.left = '0px';
  container.style.top = '0px';
  container.style.width = '794px';
  container.style.height = '1123px';
  container.style.minWidth = '794px';
  container.style.minHeight = '1123px';
  container.style.maxWidth = '794px';
  container.style.maxHeight = '1123px';
  container.style.boxSizing = 'border-box';
  container.style.overflow = 'hidden';
  container.style.opacity = '1';
  container.style.visibility = 'visible';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '99998';
  container.style.background = templateMode === 'modern' ? '#f6f9fc' : '#ffffff';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.transform = 'none';

  container.innerHTML = generateRppHtml(doc, templateMode, pageNumber);
  document.body.appendChild(container);

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    // Allow SVG and DOM reflow to finalize
    await new Promise((resolve) => setTimeout(resolve, 280));

    const canvas = await html2canvas(container, {
      scale: scale, // 2.5 gives ~1985 x 2807 px (Ultra-HD 300 DPI print quality)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: templateMode === 'modern' ? '#f6f9fc' : '#ffffff',
      width: 794,
      height: 1123,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0
    });

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('Gagal menghasilkan blob gambar PNG'));
      }, 'image/png', 1.0);
    });

    const baseName = getRppFileName(doc, 'pdf').replace('.pdf', '');
    const filename = `${baseName}_HALAMAN_${pageNumber}_HD.png`;

    return { blob, dataUrl, filename };
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    if (origScrollX !== 0 || origScrollY !== 0) {
      window.scrollTo(origScrollX, origScrollY);
    }
  }
}

/**
 * Download single page screenshot as PNG file
 */
export async function downloadPageScreenshot(
  doc: RPPDocument,
  templateMode: 'modern' | 'classic' = 'modern',
  pageNumber: 1 | 2 | 3 | 4
): Promise<void> {
  const { blob, filename } = await captureRppPageScreenshot(doc, templateMode, pageNumber, 3);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}

/**
 * Copy page screenshot directly to system clipboard
 */
export async function copyPageScreenshotToClipboard(
  doc: RPPDocument,
  templateMode: 'modern' | 'classic' = 'modern',
  pageNumber: 1 | 2 | 3 | 4
): Promise<boolean> {
  try {
    const { blob } = await captureRppPageScreenshot(doc, templateMode, pageNumber, 2.5);
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Clipboard copy error:', err);
    return false;
  }
}

/**
 * Download all 4 page screenshots sequentially with stagger
 */
export async function downloadAllPageScreenshots(
  doc: RPPDocument,
  templateMode: 'modern' | 'classic' = 'modern',
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  for (let p = 1; p <= 4; p++) {
    if (onProgress) onProgress(p, 4);
    await downloadPageScreenshot(doc, templateMode, p as 1 | 2 | 3 | 4);
    // Stagger downloads so browser doesn't block concurrent file saves
    await new Promise((resolve) => setTimeout(resolve, 450));
  }
}

// Combine all documents into ONE SINGLE MASTER PDF file
export function exportCombinedRppPdf(docs: RPPDocument[], title = 'RPP_GABUNGAN_SMK_N_2_MAGELANG'): void {
  if (docs.length === 0) return;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 18;
  const firstDoc = docs[0];

  // COVER PAGE (HALAMAN SAMPUL MASTER DOKUMEN)
  let curY = 32;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text('PEMERINTAH PROVINSI JAWA TENGAH', pageWidth / 2, curY, { align: 'center' });
  curY += 5.5;
  pdf.setFontSize(12);
  pdf.text('DINAS PENDIDIKAN DAN KEBUDAYAAN', pageWidth / 2, curY, { align: 'center' });
  curY += 6;
  pdf.setFontSize(13);
  pdf.setTextColor(27, 54, 93);
  pdf.text('SEKOLAH MENENGAH KEJURUAN NEGERI 2 MAGELANG', pageWidth / 2, curY, { align: 'center' });
  curY += 4.5;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Jl. A Yani 135A, Kramat Selatan, Kec. Magelang Utara - Telp. 0293-362577', pageWidth / 2, curY, { align: 'center' });
  curY += 6;

  pdf.setDrawColor(27, 54, 93);
  pdf.setLineWidth(1.2);
  pdf.line(margin, curY, pageWidth - margin, curY);
  curY += 28;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(27, 54, 93);
  pdf.text('KUMPULAN DOKUMEN', pageWidth / 2, curY, { align: 'center' });
  curY += 8;
  pdf.setFontSize(20);
  pdf.text('PERENCANAAN PEMBELAJARAN MENDALAM (RPP)', pageWidth / 2, curY, { align: 'center' });
  curY += 8;
  pdf.setFontSize(13);
  pdf.setTextColor(30, 41, 59);
  pdf.text(`TAHUN AJARAN ${firstDoc.sekolah.tahunAjaran || '2025/2026'}`, pageWidth / 2, curY, { align: 'center' });
  curY += 20;

  const coverMetadata = [
    ['Mata Pelajaran', ':', firstDoc.guru.mataPelajaran],
    ['Kelas / Fase', ':', `${firstDoc.guru.kelas} / ${firstDoc.guru.fase}`],
    ['Program Keahlian', ':', firstDoc.guru.programKeahlian || 'SMK Negeri 2 Magelang'],
    ['Guru Pengampu', ':', firstDoc.guru.namaGuru],
    ['NIP / NIPPK', ':', firstDoc.guru.nip || '-'],
    ['Total Dokumen CP', ':', `${docs.length} Capaian Pembelajaran`],
    ['Alokasi Total JP', ':', `${docs.reduce((acc, d) => acc + (d.pengaturan.jumlahJp || 0), 0)} JP`]
  ];

  autoTable(pdf, {
    startY: curY,
    margin: { left: margin + 10, right: margin + 10 },
    body: coverMetadata,
    theme: 'striped',
    styles: { fontSize: 9.5, cellPadding: 3, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 46, fontStyle: 'bold' },
      1: { cellWidth: 6, halign: 'center' },
      2: { fontStyle: 'bold', textColor: [15, 23, 42] }
    }
  });

  curY = (pdf as any).lastAutoTable.finalY + 12;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(27, 54, 93);
  pdf.text('DAFTAR CAPAIAN PEMBELAJARAN DALAM BUKU INI:', margin + 10, curY);
  curY += 5;

  const tocRows = docs.map((d, i) => [
    `${i + 1}`,
    d.karakteristik.strukturMateri || d.guru.mataPelajaran,
    `${d.pengaturan.jumlahJp} JP`,
    d.guru.semester || 'Ganjil',
    `Hal. ${i * 4 + 2} - ${i * 4 + 5}`
  ]);

  autoTable(pdf, {
    startY: curY,
    margin: { left: margin + 10, right: margin + 10 },
    head: [['No', 'Elemen / Topik Pembelajaran', 'Alokasi', 'Sem.', 'Halaman']],
    body: tocRows,
    theme: 'grid',
    headStyles: { fillColor: [27, 54, 93], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    styles: { fontSize: 8.5, cellPadding: 2.5 }
  });

  docs.forEach((doc) => {
    pdf.addPage();
    renderRppPagesIntoPdf(pdf, doc, 'modern');
  });

  pdf.save(`${title}.pdf`);
}

// ======================================================================================
// 5. WORD DOCUMENT GENERATOR (.DOC COMPLIANT WITH PREVIEW)
// ======================================================================================

function generateModernWordHtml(doc: RPPDocument): string {
  const activeDims = getActiveDimensions(doc);
  const borderNavy = '#244b7a';
  const bgBadge = '#244b7a';
  const lightBg = '#f8fafc';
  const orangeBorder = 'border-bottom: 1.5pt solid #f4a261;';

  return `
    <!-- HALAMAN 1 -->
    <!-- TITLE BANNER -->
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 12pt;">
      <tr style="background-color: #1b365d;">
        <td style="padding: 12pt 16pt; text-align: center; color: #ffffff;">
          <div style="font-family: Arial, sans-serif; font-size: 15pt; font-weight: bold; letter-spacing: 2pt; text-transform: uppercase;">
            RENCANA PELAKSANAAN PEMBELAJARAN
          </div>
          <div style="font-family: Arial, sans-serif; font-size: 17pt; font-weight: 900; letter-spacing: 1.5pt; text-transform: uppercase; color: #ffffff; margin-top: 2pt;">
            PEMBELAJARAN MENDALAM (DEEP LEARNING)
          </div>
          <div style="font-family: Arial, sans-serif; font-size: 9pt; font-weight: bold; color: #93c5fd; margin-top: 4pt; letter-spacing: 1pt;">
            ${(doc.sekolah.namaSekolah || 'SMK NEGERI 2 MAGELANG').toUpperCase()} &bull; TAHUN AJARAN ${doc.sekolah.tahunAjaran || '2026/2027'} &bull; FASE ${doc.guru.fase}
          </div>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f4a261; height: 3.5pt; font-size: 1pt; line-height: 1pt;">&nbsp;</td>
      </tr>
    </table>

    <!-- CARD 1: IDENTITAS -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${borderNavy}; margin-bottom: 12pt;">
      <tr style="background-color: ${bgBadge};">
        <td colspan="3" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; color: #ffffff;">
          Identitas
        </td>
      </tr>
      <tr>
        <td style="width: 25%; padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Sekolah</td>
        <td style="width: 3%; padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #0f172a; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.sekolah.namaSekolah || 'SMK NEGERI 2 MAGELANG'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Nama Guru</td>
        <td style="padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 4.5pt 8pt; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.guru.namaGuru}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Mata Pelajaran</td>
        <td style="padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #0f172a; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.guru.mataPelajaran}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Kelas / Semester</td>
        <td style="padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 4.5pt 8pt; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.guru.kelas} / ${doc.guru.semester}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; background-color: ${lightBg};">Alokasi Waktu</td>
        <td style="padding: 4.5pt 2pt; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; font-weight: bold; ${orangeBorder}">${doc.pengaturan.jumlahJp} JP, @${doc.pengaturan.durasiJp} Menit (${doc.pengaturan.jumlahJp * doc.pengaturan.durasiJp} Menit)</td>
      </tr>
    </table>

    <!-- CARD 2: IDENTIFIKASI -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${borderNavy}; margin-bottom: 12pt;">
      <tr style="background-color: ${bgBadge};">
        <td colspan="3" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; color: #ffffff;">
          Identifikasi
        </td>
      </tr>
      <tr>
        <td style="width: 25%; padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Peserta didik</td>
        <td style="width: 3%; padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 4.5pt 8pt; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">Peserta didik kelas ${doc.guru.kelas} program keahlian ${doc.guru.programKeahlian || 'SMK'} dengan karakteristik siap kerja.</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Materi Pelajaran</td>
        <td style="padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 4.5pt 8pt; font-weight: bold; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.karakteristik.strukturMateri || 'Materi Pokok'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; vertical-align: top; background-color: ${lightBg};">Dimensi Profil Lulusan</td>
        <td style="padding: 4.5pt 2pt; text-align: center; vertical-align: top;">:</td>
        <td style="padding: 4.5pt 8pt; font-size: 9pt;">
          ${activeDims.length === 0 ? '<em>(Diselaraskan dengan capaian pembelajaran)</em>' : activeDims.map((d) => `<div style="margin-bottom: 2pt;"><strong>[&radic;]</strong> ${d.label}</div>`).join('')}
        </td>
      </tr>
    </table>

    <!-- CARD 3: CAPAIAN PEMBELAJARAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${borderNavy}; margin-bottom: 12pt;">
      <tr style="background-color: ${bgBadge};">
        <td style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; color: #ffffff;">
          Capaian Pembelajaran
        </td>
      </tr>
      <tr>
        <td style="padding: 8pt 10pt; text-align: justify; line-height: 1.45; font-size: 9.5pt;">
          ${doc.capaianPembelajaran}
        </td>
      </tr>
    </table>

    <!-- PAGE BREAK 1 -> 2 -->
    <div style="page-break-before: always; mso-special-character: line-break;">&nbsp;</div>

    <!-- HALAMAN 2 -->
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 8pt;">
      <tr>
        <td style="background-color: #1b365d; height: 4pt; font-size: 1pt; line-height: 1pt;">&nbsp;</td>
      </tr>
    </table>

    <!-- CARD: DESAIN PEMBELAJARAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${borderNavy}; margin-bottom: 12pt;">
      <tr style="background-color: ${bgBadge};">
        <td colspan="3" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; color: #ffffff;">
          Desain Pembelajaran
        </td>
      </tr>
      <tr>
        <td style="width: 25%; padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg}; vertical-align: top;">Lintas Disiplin Ilmu</td>
        <td style="width: 3%; padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0; vertical-align: top;">:</td>
        <td style="padding: 4.5pt 8pt; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">Informatika, Bahasa Inggris Teknis, Matematika Terapan, dan Budaya Kerja Industri 5R.</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg}; vertical-align: top;">Tujuan Pembelajaran</td>
        <td style="padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0; vertical-align: top;">:</td>
        <td style="padding: 4.5pt 8pt; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">
          ${doc.tujuanPembelajaran.map((tp, idx) => `<div style="margin-bottom: 2pt;"><strong>${idx + 1}.</strong> ${tp}</div>`).join('')}
        </td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Topik Pembelajaran</td>
        <td style="padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 4.5pt 8pt; font-weight: bold; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.karakteristik.strukturMateri || 'Materi Pokok'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Praktik Pedagogis</td>
        <td style="padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 4.5pt 8pt; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.pengaturan.modelPembelajaran || 'Project Based Learning (PjBL)'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Kemitraan Pembelajaran</td>
        <td style="padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 4.5pt 8pt; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.kemitraan.lingkunganLuarSekolah || 'Mitra DU-DI Kota Magelang'} &bull; ${doc.kemitraan.masyarakat || 'Dukungan Orang Tua'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Lingkungan Pembelajaran</td>
        <td style="padding: 4.5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 4.5pt 8pt; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.kemitraan.lingkunganSekolah || 'Laboratorium Praktik SMK Negeri 2 Magelang'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1e293b; background-color: ${lightBg};">Pemanfaatan Digital</td>
        <td style="padding: 4.5pt 2pt; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; ${orangeBorder}">LMS SMK N 2 Magelang, Youtube, Mentimeter, Quizizz, Padlet, Canva</td>
      </tr>
    </table>

    <!-- CARD: AWAL PEMBELAJARAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${borderNavy}; margin-bottom: 12pt;">
      <tr style="background-color: ${bgBadge};">
        <td style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; color: #ffffff;">
          Awal Pembelajaran (Pendahuluan)
        </td>
      </tr>
      <tr style="background-color: #f1f5f9;">
        <td style="padding: 4pt 10pt; font-size: 8.8pt; font-weight: bold; color: #1e3a8a; border-bottom: 0.5pt solid #cbd5e1;">
          Prinsip Pembelajaran: [&radic;] Berkesadaran &nbsp;&nbsp;|&nbsp;&nbsp; [&radic;] Bermakna &nbsp;&nbsp;|&nbsp;&nbsp; [&radic;] Menyenangkan
        </td>
      </tr>
      <tr>
        <td style="padding: 8pt 10pt; text-align: justify; line-height: 1.45; font-size: 9pt;">
          ${doc.pengalamanPembelajaran.pendahuluan.deskripsi}
          <div style="text-align: right; font-weight: bold; margin-top: 6pt; color: #1e3a8a;">
            Alokasi Waktu: ${doc.pengalamanPembelajaran.pendahuluan.waktu}
          </div>
        </td>
      </tr>
    </table>

    <!-- PAGE BREAK 2 -> 3 -->
    <div style="page-break-before: always; mso-special-character: line-break;">&nbsp;</div>

    <!-- HALAMAN 3 -->
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 8pt;">
      <tr>
        <td style="background-color: #1b365d; height: 4pt; font-size: 1pt; line-height: 1pt;">&nbsp;</td>
      </tr>
    </table>

    <!-- CARD: INTI PEMBELAJARAN (6 FASE PjBL) -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${borderNavy}; margin-bottom: 12pt;">
      <tr style="background-color: ${bgBadge};">
        <td colspan="2" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; color: #ffffff;">
          Inti Pembelajaran (6 Fase Model Pembelajaran)
        </td>
      </tr>
      <tr style="background-color: #f1f5f9;">
        <td colspan="2" style="padding: 4pt 10pt; font-size: 8.8pt; font-weight: bold; color: #1e3a8a; border-bottom: 0.5pt solid #cbd5e1;">
          Prinsip Pembelajaran: [&radic;] Berkesadaran &nbsp;&nbsp;|&nbsp;&nbsp; [&radic;] Bermakna &nbsp;&nbsp;|&nbsp;&nbsp; [&radic;] Menyenangkan
        </td>
      </tr>
      ${doc.pengalamanPembelajaran.kegiatanInti.map((f) => `
        <tr style="background-color: #e0f2fe;">
          <td style="padding: 4.5pt 8pt; font-weight: bold; color: #1b365d; border-top: 1pt solid #cbd5e1; border-bottom: 0.5pt solid #cbd5e1; width: 75%; font-size: 9pt;">
            ${f.fase}
          </td>
          <td style="padding: 4.5pt 8pt; font-weight: bold; text-align: right; color: #0369a1; border-top: 1pt solid #cbd5e1; border-bottom: 0.5pt solid #cbd5e1; width: 25%; font-size: 8.5pt;">
            ${f.waktu}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 6pt 10pt; text-align: justify; line-height: 1.35; font-size: 8.5pt; color: #334155; border-bottom: 1pt solid #e2e8f0;">
            ${f.deskripsi}
          </td>
        </tr>
      `).join('')}
    </table>

    <!-- PAGE BREAK 3 -> 4 -->
    <div style="page-break-before: always; mso-special-character: line-break;">&nbsp;</div>

    <!-- HALAMAN 4 -->
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 8pt;">
      <tr>
        <td style="background-color: #1b365d; height: 4pt; font-size: 1pt; line-height: 1pt;">&nbsp;</td>
      </tr>
    </table>

    <!-- CARD: AKHIR PEMBELAJARAN (PENUTUP) -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${borderNavy}; margin-bottom: 12pt;">
      <tr style="background-color: ${bgBadge};">
        <td style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; color: #ffffff;">
          Akhir Pembelajaran (Penutup)
        </td>
      </tr>
      <tr style="background-color: #f1f5f9;">
        <td style="padding: 4pt 10pt; font-size: 8.8pt; font-weight: bold; color: #1e3a8a; border-bottom: 0.5pt solid #cbd5e1;">
          Prinsip Pembelajaran: [&radic;] Berkesadaran &nbsp;&nbsp;|&nbsp;&nbsp; [&radic;] Bermakna &nbsp;&nbsp;|&nbsp;&nbsp; [&radic;] Menyenangkan
        </td>
      </tr>
      <tr>
        <td style="padding: 8pt 10pt; text-align: justify; line-height: 1.45; font-size: 9pt;">
          ${doc.pengalamanPembelajaran.penutup.deskripsi}
          <div style="text-align: right; font-weight: bold; margin-top: 5pt; color: #1e3a8a;">
            Alokasi Waktu: ${doc.pengalamanPembelajaran.penutup.waktu}
          </div>
        </td>
      </tr>
    </table>

    <!-- CARD: ASESMEN PEMBELAJARAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${borderNavy}; margin-bottom: 16pt;">
      <tr style="background-color: ${bgBadge};">
        <td colspan="3" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; color: #ffffff;">
          Asesmen Pembelajaran
        </td>
      </tr>
      <tr>
        <td style="width: 30%; padding: 5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Asesmen Awal Pembelajaran</td>
        <td style="width: 3%; padding: 5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 5pt 8pt; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.asesmen.asesmenAwal || 'Kuis singkat pengetahuan prasyarat via Quizizz / Google Forms'}</td>
      </tr>
      <tr>
        <td style="padding: 5pt 8pt; font-weight: bold; color: #1e293b; border-bottom: 0.5pt solid #e2e8f0; background-color: ${lightBg};">Asesmen Proses Pembelajaran</td>
        <td style="padding: 5pt 2pt; text-align: center; border-bottom: 0.5pt solid #e2e8f0;">:</td>
        <td style="padding: 5pt 8pt; border-bottom: 0.5pt solid #e2e8f0; ${orangeBorder}">${doc.asesmen.asesmenProses || 'Observasi keaktifan diskusi, kinerja LKPD, dan penilaian sikap 5R'}</td>
      </tr>
      <tr>
        <td style="padding: 5pt 8pt; font-weight: bold; color: #1e293b; background-color: ${lightBg};">Asesmen Akhir Pembelajaran</td>
        <td style="padding: 5pt 2pt; text-align: center;">:</td>
        <td style="padding: 5pt 8pt; ${orangeBorder}">${doc.asesmen.asesmenAkhir || 'Presentasi hasil projek, uji unjuk kerja, dan gelar karya produk'}</td>
      </tr>
    </table>

    <!-- TANDA TANGAN -->
    <table style="width: 100%; border-collapse: collapse; border: none; margin-top: 14pt;">
      <tr>
        <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
          <div style="color: #475569;">Guru Mata Pelajaran</div>
          <div style="height: 48pt;">&nbsp;</div>
          <div style="font-weight: bold; text-decoration: underline; color: #0f172a;">${doc.tandaTangan.guruNama || doc.guru.namaGuru}</div>
          <div style="font-size: 8.5pt; color: #475569;">NIP/NIPPK. ${doc.tandaTangan.guruNip || doc.guru.nip || '-'}</div>
        </td>
        <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
          <div style="color: #475569;">Mengetahui,</div>
          <div style="font-weight: bold; color: #0f172a;">Kepala Sekolah</div>
          <div style="height: 48pt;">&nbsp;</div>
          <div style="font-weight: bold; text-decoration: underline; color: #0f172a;">${doc.tandaTangan.kepalaSekolahNama || doc.sekolah.namaKepalaSekolah || 'Kurniawan Basuki, S.Pd., M.T'}</div>
          <div style="font-size: 8.5pt; color: #475569;">NIP. ${doc.tandaTangan.kepalaSekolahNip || doc.sekolah.nipKepalaSekolah || '196709291990031013'}</div>
        </td>
      </tr>
    </table>
  `;
}

function generateClassicWordHtml(doc: RPPDocument): string {
  const activeDims = getActiveDimensions(doc);
  const tableBorderColor = '#000000';
  const cellBorderColor = '#000000';
  const headerBgColor = '#00b0f0';
  const headerTextColor = '#000000';

  return `
    <!-- HALAMAN 1 -->
    <!-- KOP SURAT RESMI DINAS -->
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 2pt;">
      <tr>
        <td style="width: 14%; text-align: center; vertical-align: middle; border: none; padding: 2pt;">
          <div style="font-size: 26pt; font-weight: bold; color: #1e3a8a;">&#9670;</div>
        </td>
        <td style="width: 72%; text-align: center; vertical-align: middle; border: none; padding: 2pt;">
          <div style="font-family: Arial, sans-serif; font-size: 11pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH PROVINSI JAWA TENGAH</div>
          <div style="font-family: Arial, sans-serif; font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 1pt 0;">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
          <div style="font-family: Arial, sans-serif; font-size: 13pt; font-weight: bold; text-transform: uppercase; color: #1b365d; margin: 1pt 0;">SEKOLAH MENENGAH KEJURUAN NEGERI 2 MAGELANG</div>
          <div style="font-family: Arial, sans-serif; font-size: 8.5pt; color: #333333; margin-top: 2pt; line-height: 1.25;">
            ${doc.sekolah.alamat || 'Jl. A Yani 135A, Kramat Selatan, Kec. Magelang Utara, Kota Magelang'}<br/>
            Kode Pos 56115, Telepon 0293-362577, Faksimile 0293-313172, laman http://smkn2mgl.sch.id
          </div>
        </td>
        <td style="width: 14%; text-align: center; vertical-align: middle; border: none; padding: 2pt;">
          <div style="font-size: 26pt; font-weight: bold; color: #0284c7;">&#9670;</div>
        </td>
      </tr>
    </table>
    <div style="border-top: 2.5pt solid #000000; border-bottom: 1pt solid #000000; height: 3pt; margin: 4pt 0 14pt 0;">&nbsp;</div>

    <!-- JUDUL DOKUMEN -->
    <div style="text-align: center; margin-bottom: 14pt;">
      <div style="font-family: Arial, sans-serif; font-size: 13pt; font-weight: bold; letter-spacing: 1.5pt; text-transform: uppercase; color: #1b365d;">
        RENCANA PELAKSANAAN PEMBELAJARAN (RPP)
      </div>
      <div style="font-family: Arial, sans-serif; font-size: 14pt; font-weight: 900; letter-spacing: 1pt; text-transform: uppercase; color: #1b365d; margin-top: 2pt;">
        PEMBELAJARAN MENDALAM (DEEP LEARNING)
      </div>
      <div style="font-family: Arial, sans-serif; font-size: 9pt; font-weight: bold; color: #64748b; margin-top: 3pt;">
        TAHUN AJARAN ${doc.sekolah.tahunAjaran || '2025/2026'} &bull; FASE ${doc.guru.fase}
      </div>
    </div>

    <!-- BAGIAN 1: IDENTITAS PPM -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 12pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td colspan="3" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          I. IDENTITAS PERENCANAAN PEMBELAJARAN MENDALAM (PPM)
        </td>
      </tr>
      <tr>
        <td style="width: 28%; padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Nama Sekolah</td>
        <td style="width: 3%; padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">${doc.sekolah.namaSekolah || 'SMK NEGERI 2 MAGELANG'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Nama Guru Pengampu</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.guru.namaGuru}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">NIP / NIPPK</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.guru.nip || '-'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Mata Pelajaran</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">${doc.guru.mataPelajaran}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Fase / Kelas / Semester</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.guru.fase} / ${doc.guru.kelas} / ${doc.guru.semester}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Alokasi Waktu</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">${doc.pengaturan.jumlahJp} JP &times; ${doc.pengaturan.durasiJp} Menit (${doc.pengaturan.jumlahJp * doc.pengaturan.durasiJp} Menit)</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Model Pembelajaran</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.pengaturan.modelPembelajaran || 'Project Based Learning (PjBL)'}</td>
      </tr>
    </table>

    <!-- BAGIAN 2: IDENTIFIKASI & DIMENSI PROFIL LULUSAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 12pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td colspan="3" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          II. IDENTIFIKASI &amp; DIMENSI PROFIL LULUSAN
        </td>
      </tr>
      <tr>
        <td style="width: 28%; padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Sasaran Peserta Didik</td>
        <td style="width: 3%; padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">Peserta didik kelas ${doc.guru.kelas} program keahlian ${doc.guru.programKeahlian || 'SMK'} dengan karakteristik siap kerja dan berwawasan industri.</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Materi / Elemen Pokok</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">${doc.karakteristik.strukturMateri || 'Materi Pokok'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold; vertical-align: top;">Dimensi Profil Lulusan</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center; vertical-align: top;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">
          ${activeDims.length === 0 ? '<em>(Diselaraskan dengan capaian pembelajaran)</em>' : activeDims.map((d) => `<div style="margin-bottom: 2pt;"><strong>[&radic;]</strong> ${d.label}</div>`).join('')}
        </td>
      </tr>
    </table>

    <!-- BAGIAN 3: CAPAIAN PEMBELAJARAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 12pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          III. CAPAIAN PEMBELAJARAN (CP)
        </td>
      </tr>
      <tr>
        <td style="padding: 7pt 10pt; border: 1pt solid ${cellBorderColor}; text-align: justify; line-height: 1.45;">
          ${doc.capaianPembelajaran}
        </td>
      </tr>
    </table>

    <!-- PAGE BREAK 1 -> 2 -->
    <div style="page-break-before: always; mso-special-character: line-break;">&nbsp;</div>

    <!-- HALAMAN 2 -->
    <!-- BAGIAN 4: DESAIN PEMBELAJARAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 12pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td colspan="3" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          IV. DESAIN PEMBELAJARAN
        </td>
      </tr>
      <tr>
        <td style="width: 28%; padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Lintas Disiplin Ilmu</td>
        <td style="width: 3%; padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">Informatika, Bahasa Inggris Teknis, Matematika Terapan, dan Budaya Kerja Industri 5R.</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold; vertical-align: top;">Tujuan Pembelajaran (TP)</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center; vertical-align: top;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">
          ${doc.tujuanPembelajaran.map((tp, idx) => `<div style="margin-bottom: 2pt;"><strong>${idx + 1}.</strong> ${tp}</div>`).join('')}
        </td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Topik Pembelajaran</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">${doc.karakteristik.strukturMateri || 'Materi Pokok'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Praktik Pedagogis</td>
        <td style="padding: 4.5pt 4pt; border: 1pt solid ${cellBorderColor}; text-align: center;">:</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.pengaturan.modelPembelajaran || 'Project Based Learning (PjBL)'}</td>
      </tr>
    </table>

    <!-- BAGIAN 5: KEMITRAAN PEMBELAJARAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 12pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td colspan="2" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          V. KEMITRAAN PEMBELAJARAN
        </td>
      </tr>
      <tr>
        <td style="width: 30%; padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Lingkungan Sekolah</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.kemitraan.lingkunganSekolah || 'Laboratorium Praktik SMK Negeri 2 Magelang'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Lingkungan Luar Sekolah</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.kemitraan.lingkunganLuarSekolah || 'Mitra DU-DI Kota Magelang'}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Masyarakat</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.kemitraan.masyarakat || 'Dukungan Orang Tua Murid'}</td>
      </tr>
    </table>

    <!-- BAGIAN 6: PEMANFAATAN DIGITAL -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 12pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td colspan="2" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          VI. PEMANFAATAN DIGITAL
        </td>
      </tr>
      <tr>
        <td style="width: 30%; padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Perencanaan</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.pemanfaatanDigital.perencanaan}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Pelaksanaan</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.pemanfaatanDigital.pelaksanaan}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Asesmen</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.pemanfaatanDigital.asesmen}</td>
      </tr>
    </table>

    <!-- BAGIAN 7: AWAL PEMBELAJARAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 12pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          VII. PENGALAMAN PEMBELAJARAN &mdash; 1. PENDAHULUAN
        </td>
      </tr>
      <tr>
        <td style="padding: 8pt 10pt; border: 1pt solid ${cellBorderColor}; text-align: justify; line-height: 1.45;">
          ${doc.pengalamanPembelajaran.pendahuluan.deskripsi}
          <div style="text-align: right; font-weight: bold; margin-top: 5pt;">
            Alokasi Waktu: ${doc.pengalamanPembelajaran.pendahuluan.waktu}
          </div>
        </td>
      </tr>
    </table>

    <!-- PAGE BREAK 2 -> 3 -->
    <div style="page-break-before: always; mso-special-character: line-break;">&nbsp;</div>

    <!-- HALAMAN 3 -->
    <!-- BAGIAN 7: INTI PEMBELAJARAN (6 FASE PjBL) -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 12pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td colspan="2" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          VII. PENGALAMAN PEMBELAJARAN &mdash; 2. INTI (6 FASE MODEL PjBL)
        </td>
      </tr>
      ${doc.pengalamanPembelajaran.kegiatanInti.map((f) => `
        <tr style="background-color: #f1f5f9;">
          <td style="padding: 4.5pt 8pt; font-weight: bold; border: 1pt solid ${cellBorderColor}; width: 75%;">
            ${f.fase}
          </td>
          <td style="padding: 4.5pt 8pt; font-weight: bold; text-align: right; border: 1pt solid ${cellBorderColor}; width: 25%;">
            ${f.waktu}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 6pt 10pt; text-align: justify; line-height: 1.35; border: 1pt solid ${cellBorderColor};">
            ${f.deskripsi}
          </td>
        </tr>
      `).join('')}
    </table>

    <!-- BAGIAN 7: PENUTUP -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 12pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          VII. PENGALAMAN PEMBELAJARAN &mdash; 3. PENUTUP
        </td>
      </tr>
      <tr>
        <td style="padding: 8pt 10pt; border: 1pt solid ${cellBorderColor}; text-align: justify; line-height: 1.45;">
          ${doc.pengalamanPembelajaran.penutup.deskripsi}
          <div style="text-align: right; font-weight: bold; margin-top: 5pt;">
            Alokasi Waktu: ${doc.pengalamanPembelajaran.penutup.waktu}
          </div>
        </td>
      </tr>
    </table>

    <!-- PAGE BREAK 3 -> 4 -->
    <div style="page-break-before: always; mso-special-character: line-break;">&nbsp;</div>

    <!-- HALAMAN 4 -->
    <!-- BAGIAN 8: ASESMEN PEMBELAJARAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 10pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td colspan="2" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          VIII. ASESMEN PEMBELAJARAN
        </td>
      </tr>
      <tr>
        <td style="width: 30%; padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Asesmen Awal (Formatif)</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.asesmen.asesmenAwal}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Asesmen Proses (Formatif)</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.asesmen.asesmenProses}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Asesmen Akhir (Sumatif)</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.asesmen.asesmenAkhir}</td>
      </tr>
    </table>

    <!-- BAGIAN 9: REMEDIAL DAN PENGAYAAN -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 10pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td colspan="2" style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          IX. REMEDIAL DAN PENGAYAAN
        </td>
      </tr>
      <tr>
        <td style="width: 25%; padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Remedial</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.remedialDanPengayaan.remedial}</td>
      </tr>
      <tr>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor}; font-weight: bold;">Pengayaan</td>
        <td style="padding: 4.5pt 8pt; border: 1pt solid ${cellBorderColor};">${doc.remedialDanPengayaan.pengayaan}</td>
      </tr>
    </table>

    <!-- BAGIAN 10: GLOSARIUM & DAFTAR PUSTAKA -->
    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid ${tableBorderColor}; margin-bottom: 12pt;">
      <tr style="background-color: ${headerBgColor}; color: ${headerTextColor};">
        <td style="padding: 5pt 10pt; font-family: Arial, sans-serif; font-size: 10pt; font-weight: bold; border: 1pt solid ${tableBorderColor};">
          X. GLOSARIUM &amp; DAFTAR PUSTAKA
        </td>
      </tr>
      <tr>
        <td style="padding: 6pt 10pt; border: 1pt solid ${cellBorderColor}; font-size: 8.5pt;">
          <strong>GLOSARIUM:</strong><br/>
          ${(doc.glosarium || []).map((g) => `&bull; <strong>${g.istilah}</strong>: ${g.definisi}`).join('<br/>')}
          <div style="margin-top: 5pt;"><strong>DAFTAR PUSTAKA:</strong><br/>
          ${(doc.daftarPustaka || []).map((p) => `&bull; ${p}`).join('<br/>')}</div>
        </td>
      </tr>
    </table>

    <!-- PENGESAHAN / TANDA TANGAN -->
    <table style="width: 100%; border-collapse: collapse; border: none; margin-top: 14pt;">
      <tr>
        <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
          <div>Mengetahui,</div>
          <div style="font-weight: bold;">Kepala Sekolah</div>
          <div style="height: 45pt;">&nbsp;</div>
          <div style="font-weight: bold; text-decoration: underline;">${doc.tandaTangan.kepalaSekolahNama || doc.sekolah.namaKepalaSekolah || 'Kurniawan Basuki, S.Pd., M.T'}</div>
          <div>NIP. ${doc.tandaTangan.kepalaSekolahNip || doc.sekolah.nipKepalaSekolah || '196709291990031013'}</div>
        </td>
        <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
          <div>${doc.tandaTangan.tempatTanggal || 'Kota Magelang, 13 Juli 2026'}</div>
          <div>Guru Mata Pelajaran</div>
          <div style="height: 45pt;">&nbsp;</div>
          <div style="font-weight: bold; text-decoration: underline;">${doc.tandaTangan.guruNama || doc.guru.namaGuru}</div>
          <div>NIP/NIPPK. ${doc.tandaTangan.guruNip || doc.guru.nip || '-'}</div>
        </td>
      </tr>
    </table>
  `;
}

export function generateRppWordHtml(doc: RPPDocument, templateMode: 'modern' | 'classic' = 'modern'): string {
  if (templateMode === 'classic') {
    return generateClassicWordHtml(doc);
  }
  return generateModernWordHtml(doc);
}

export function exportRppToWord(doc: RPPDocument, templateMode: 'modern' | 'classic' = 'modern'): void {
  const htmlContent = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>${getRppFileName(doc, 'doc')}</title>
    <!--[if gte mso 9]>
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
      @page Section1 {
        size: 210mm 297mm;
        margin: 15mm 18mm 15mm 18mm;
        mso-header-margin: 10mm;
        mso-footer-margin: 10mm;
        mso-paper-source: 0;
      }
      div.Section1 { page: Section1; }
      body {
        font-family: Arial, 'Segoe UI', Tahoma, sans-serif;
        font-size: 9.5pt;
        line-height: 1.35;
        color: #000000;
        background: #ffffff;
        margin: 0;
      }
      p { margin: 0 0 4pt 0; }
      table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      td, th { vertical-align: top; }
    </style>
  </head>
  <body>
    <div class="Section1">
      ${generateRppWordHtml(doc, templateMode)}
    </div>
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = getRppFileName(doc, 'doc');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}

/**
 * Unduh dokumen Word dengan gambar screenshot Ultra-HD tertanam per halaman.
 * Solusi 100% Anti-Geser: dijamin persis seperti pratinjau tanpa perubahan posisi/format di versi Word manapun.
 */
export async function exportRppToWordWithImages(
  doc: RPPDocument,
  templateMode: 'modern' | 'classic' = 'modern',
  existingImages?: Record<number, string>,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<void> {
  const images: Record<number, string> = { ...existingImages };
  for (let p = 1; p <= 4; p++) {
    if (!images[p]) {
      if (onProgress) onProgress(p, 4, `Mengambil screenshot Halaman ${p} (HD 300 DPI)...`);
      const { dataUrl } = await captureRppPageScreenshot(doc, templateMode, p as 1 | 2 | 3 | 4, 2.5);
      images[p] = dataUrl;
    }
  }

  if (onProgress) onProgress(4, 4, 'Menyusun dokumen Word Anti-Geser (HD)...');

  const htmlContent = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>${getRppFileName(doc, 'doc')}</title>
    <!--[if gte mso 9]>
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
      @page WordSection1 {
        size: 210mm 297mm;
        margin: 10mm 10mm 10mm 10mm;
        mso-header-margin: 5mm;
        mso-footer-margin: 5mm;
        mso-paper-source: 0;
      }
      div.WordSection1 { page: WordSection1; }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: #ffffff;
      }
      .page-container {
        text-align: center;
        margin: 0;
        padding: 0;
      }
      .page-img {
        width: 100%;
        max-width: 190mm;
        height: auto;
        display: block;
        margin: 0 auto;
      }
      .page-break {
        page-break-after: always;
        mso-break-type: section-break;
        clear: both;
      }
    </style>
  </head>
  <body>
    <div class="WordSection1">
      ${[1, 2, 3, 4]
        .map(
          (p) => `
        <div class="page-container ${p < 4 ? 'page-break' : ''}">
          <img src="${images[p]}" class="page-img" alt="Halaman ${p}" />
        </div>
      `
        )
        .join('')}
    </div>
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const baseName = getRppFileName(doc, 'doc').replace('.doc', '');
  a.download = `${baseName}_ANTI_GESER_HD.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}

// Print dialog helper
export function triggerPrintRpp(): void {
  window.print();
}
