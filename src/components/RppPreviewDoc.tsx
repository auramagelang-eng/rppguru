import React, { useState } from 'react';
import {
  Printer,
  Download,
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Building2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Camera,
  Copy,
  Check,
  Image as ImageIcon,
  X,
  ExternalLink,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { RPPDocument } from '../types/rpp';
import {
  generateRppHtml,
  triggerPrintRpp,
  exportRppToPdf,
  exportPdfFromScreenshots,
  downloadPageScreenshot,
  downloadAllPageScreenshots,
  copyPageScreenshotToClipboard,
  captureRppPageScreenshot,
  exportRppToWord,
  exportRppToWordWithImages
} from '../utils/pdfExport';
import { validateRppDocument } from '../utils/storage';

interface RppPreviewDocProps {
  doc: RPPDocument | null;
  onBackToEditor: () => void;
  onExportPdf: (doc: RPPDocument, templateMode?: 'modern' | 'classic') => void;
  onExportWord: (doc: RPPDocument, templateMode?: 'modern' | 'classic') => void;
}

export type PreviewPageSelect = 'all' | 1 | 2 | 3 | 4;

export const RppPreviewDoc: React.FC<RppPreviewDocProps> = ({
  doc,
  onBackToEditor,
  onExportWord
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [templateMode, setTemplateMode] = useState<'modern' | 'classic'>('modern');
  const [currentPage, setCurrentPage] = useState<PreviewPageSelect>('all');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // High-Resolution Screenshot States
  const [isCapturingSs, setIsCapturingSs] = useState(false);
  const [ssStatusText, setSsStatusText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPage, setCopiedPage] = useState<number | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [modalActivePage, setModalActivePage] = useState<1 | 2 | 3 | 4>(1);
  const [galleryImages, setGalleryImages] = useState<Record<number, string>>({});
  const [isGeneratingGallery, setIsGeneratingGallery] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  if (!doc) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-md mx-auto my-12 space-y-4">
        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-bold text-slate-800 text-base">Belum Ada Dokumen untuk Dipratinjau</h3>
        <p className="text-xs text-slate-500">
          Silakan pilih Capaian Pembelajaran dan generate RPP terlebih dahulu melalui menu Generator RPP.
        </p>
        <button
          onClick={onBackToEditor}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          Buka Generator RPP
        </button>
      </div>
    );
  }

  const validation = validateRppDocument(doc);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Direct PDF Download compiled directly from high-resolution screenshots
  const handleDownloadPdf = async (targetPage: 'all' | 1 | 2 | 3 | 4 = 'all') => {
    setIsExportingPdf(true);
    setSsStatusText(
      targetPage === 'all'
        ? 'Mengompilasi dokumen PDF dari seluruh screenshot halaman...'
        : `Menyusun PDF Halaman ${targetPage} (HD)...`
    );
    try {
      await exportRppToPdf(
        doc,
        templateMode,
        targetPage,
        galleryImages,
        (cur, total, msg) => {
          setSsStatusText(msg);
        }
      );
      showToast(
        targetPage === 'all'
          ? 'Dokumen PDF (Kompilasi Screenshot HD 4 Halaman) berhasil diunduh!'
          : `Dokumen PDF Halaman ${targetPage} (HD) berhasil diunduh!`
      );
    } catch (e) {
      console.error(e);
      showToast('Terjadi kesalahan saat mengunduh PDF.');
    } finally {
      setIsExportingPdf(false);
      setSsStatusText('');
    }
  };

  // Single Page Screenshot Download & cache
  const handleDownloadSingleScreenshot = async (page: 1 | 2 | 3 | 4) => {
    if (isCapturingSs) return;
    setIsCapturingSs(true);
    setSsStatusText(`Mengambil tangkapan layar Halaman ${page} (HD 300 DPI)...`);
    try {
      const res = await captureRppPageScreenshot(doc, templateMode, page, 3);
      setGalleryImages((prev) => ({ ...prev, [page]: res.dataUrl }));
      const url = URL.createObjectURL(res.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = res.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1200);
      showToast(`Screenshot Halaman ${page} (Ultra-HD PNG) berhasil diunduh!`);
    } catch (err) {
      console.error('Screenshot download error:', err);
      showToast(`Gagal mengunduh screenshot Halaman ${page}.`);
    } finally {
      setIsCapturingSs(false);
      setSsStatusText('');
    }
  };

  // Download All 4 Pages as Individual High-Res PNGs & cache
  const handleDownloadAllScreenshots = async () => {
    if (isCapturingSs) return;
    setIsCapturingSs(true);
    try {
      const loaded: Record<number, string> = { ...galleryImages };
      for (let p = 1; p <= 4; p++) {
        setSsStatusText(`Mengambil screenshot Halaman ${p} dari 4 (HD 300 DPI)...`);
        const res = await captureRppPageScreenshot(doc, templateMode, p as 1 | 2 | 3 | 4, 3);
        loaded[p] = res.dataUrl;
        setGalleryImages({ ...loaded });
        const url = URL.createObjectURL(res.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = res.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1200);
        await new Promise((resolve) => setTimeout(resolve, 450));
      }
      showToast('Semua 4 Halaman RPP berhasil diunduh sebagai gambar PNG resolusi tinggi!');
    } catch (err) {
      console.error('All screenshots download error:', err);
      showToast('Terjadi kesalahan saat mengunduh screenshot dokumen.');
    } finally {
      setIsCapturingSs(false);
      setSsStatusText('');
    }
  };

  // Download Word Document with HD Screenshots Embedded (Anti-Geser 100%)
  const handleDownloadWordHd = async () => {
    if (!doc) return;
    setIsCapturingSs(true);
    setSsStatusText('Menyiapkan screenshot Ultra-HD untuk dokumen Word...');
    try {
      await exportRppToWordWithImages(doc, templateMode, galleryImages, (_c, _t, msg) => {
        setSsStatusText(msg);
      });
      showToast('Dokumen Word Anti-Geser (HD) berhasil diunduh! Tampilan terkunci persis seperti pratinjau.');
    } catch (err) {
      console.error('Word HD error:', err);
      showToast('Gagal menyusun dokumen Word Anti-Geser.');
    } finally {
      setIsCapturingSs(false);
      setSsStatusText('');
    }
  };

  // Copy Screenshot directly to Clipboard
  const handleCopyScreenshot = async (page: 1 | 2 | 3 | 4) => {
    if (isCapturingSs) return;
    setIsCapturingSs(true);
    setSsStatusText(`Menyalin gambar Halaman ${page} ke clipboard...`);
    try {
      const ok = await copyPageScreenshotToClipboard(doc, templateMode, page);
      if (ok) {
        setCopiedPage(page);
        showToast(`Gambar Halaman ${page} berhasil disalin ke clipboard! Siap di-paste ke WhatsApp/Word/Canva.`);
        setTimeout(() => setCopiedPage(null), 3000);
      } else {
        // Fallback: Download file
        await downloadPageScreenshot(doc, templateMode, page);
        showToast(`Browser tidak mengizinkan direct clipboard copy, screenshot Halaman ${page} otomatis diunduh.`);
      }
    } catch (err) {
      console.error('Copy screenshot error:', err);
      showToast('Gagal menyalin gambar ke clipboard.');
    } finally {
      setIsCapturingSs(false);
      setSsStatusText('');
    }
  };

  // Open Screenshot Gallery & pre-generate previews
  const handleOpenGallery = async () => {
    setShowGalleryModal(true);
    if (Object.keys(galleryImages).length < 4) {
      setIsGeneratingGallery(true);
      try {
        const loaded: Record<number, string> = { ...galleryImages };
        for (let p = 1; p <= 4; p++) {
          if (!loaded[p]) {
            const { dataUrl } = await captureRppPageScreenshot(doc, templateMode, p as 1 | 2 | 3 | 4, 1.8);
            loaded[p] = dataUrl;
            setGalleryImages({ ...loaded });
          }
        }
      } catch (err) {
        console.error('Gallery pre-render error:', err);
      } finally {
        setIsGeneratingGallery(false);
      }
    }
  };

  const pageTitles: { page: 1 | 2 | 3 | 4; title: string; subtitle: string }[] = [
    { page: 1, title: 'Halaman 1', subtitle: 'Identitas, Profil & CP' },
    { page: 2, title: 'Halaman 2', subtitle: 'Desain & Awal' },
    { page: 3, title: 'Halaman 3', subtitle: 'Inti (6 Fase PjBL)' },
    { page: 4, title: 'Halaman 4', subtitle: 'Akhir, Asesmen & TTD' }
  ];

  const goToPrevPage = () => {
    setCurrentPage((prev) => {
      if (prev === 'all' || prev <= 1) return 4;
      return (prev - 1) as 1 | 2 | 3 | 4;
    });
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => {
      if (prev === 'all' || prev >= 4) return 1;
      return (prev + 1) as 1 | 2 | 3 | 4;
    });
  };

  // Quick keyboard arrow navigation between pages
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !showGalleryModal) {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' && !showGalleryModal) {
        goToPrevPage();
      } else if (e.key === 'Escape') {
        if (fullscreenImage) setFullscreenImage(null);
        else if (showGalleryModal) setShowGalleryModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGalleryModal, fullscreenImage]);

  return (
    <div className="space-y-4 relative">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Capture Indicator Modal / Overlay */}
      {isCapturingSs && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-200 text-center max-w-sm space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Menghasilkan Screenshot Ultra-HD</h4>
            <p className="text-xs text-slate-500 font-medium">{ssStatusText || 'Sedang memproses dokumen penuh...'}</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full animate-pulse w-3/4"></div>
            </div>
            <p className="text-[10px] text-slate-400">
              Dokumen dirender pada skala 3x (300 DPI) untuk memastikan teks &amp; tabel tetap tajam tanpa pergeseran layout.
            </p>
          </div>
        </div>
      )}

      {/* Top Floating Action Bar */}
      <div className="sticky top-[95px] z-30 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToEditor}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Editor
          </button>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Pratinjau Dokumen &mdash; {doc.guru.mataPelajaran}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  templateMode === 'modern'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                }`}
              >
                {templateMode === 'modern' ? 'Desain Modern Geometris' : 'Format Klasik Dinas'}
              </span>
            </h3>
            <span className="text-[11px] text-slate-500">
              SMK Negeri 2 Magelang &bull; {doc.guru.kelas} &bull; {doc.pengaturan.jumlahJp} JP
            </span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Template Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => {
                setTemplateMode('modern');
                setGalleryImages({});
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                templateMode === 'modern'
                  ? 'bg-white text-blue-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Modern Geometris</span>
            </button>
            <button
              onClick={() => {
                setTemplateMode('classic');
                setGalleryImages({});
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                templateMode === 'classic'
                  ? 'bg-white text-blue-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Klasik Dinas</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-1.5 py-0.5 text-xs text-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="p-1 hover:bg-slate-200 rounded cursor-pointer"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-semibold min-w-[45px] text-center text-[11px]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
              className="p-1 hover:bg-slate-200 rounded cursor-pointer"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 cursor-pointer ml-1"
              title="Reset Zoom (100%)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* SCREENSHOT ACTION GROUP: FEATURE HIGHLIGHT */}
          <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-lg border border-purple-200">
            {/* If Single Page Active: Direct Single Page Screenshot */}
            {currentPage !== 'all' && (
              <button
                onClick={() => handleDownloadSingleScreenshot(currentPage)}
                disabled={isCapturingSs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold rounded-md shadow-2xs transition-colors cursor-pointer"
                title={`Unduh gambar screenshot penuh Halaman ${currentPage} (PNG HD 300 DPI, format anti-geser)`}
              >
                <Camera className="w-3.5 h-3.5 text-purple-200" />
                <span>SS Hal. {currentPage} (HD)</span>
              </button>
            )}

            {/* All Pages Screenshot Download */}
            <button
              onClick={handleDownloadAllScreenshots}
              disabled={isCapturingSs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-md shadow-2xs transition-colors cursor-pointer"
              title="Unduh seluruh 4 halaman sebagai file gambar PNG resolusi tinggi (300 DPI)"
            >
              <Camera className="w-3.5 h-3.5 text-purple-200" />
              <span>Unduh SS Semua (4 Hal PNG)</span>
            </button>

            {/* Open Gallery Modal */}
            <button
              onClick={handleOpenGallery}
              className="p-1.5 text-purple-800 hover:bg-purple-100 rounded-md transition-colors cursor-pointer"
              title="Buka Galeri Screenshot & Salin Gambar ke Clipboard"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Word Export Controls (Teks Rapi & Bergambar HD Anti-Geser) */}
          <div className="flex items-center rounded-lg border border-blue-200 bg-blue-50 text-blue-800 text-xs font-semibold shadow-2xs overflow-hidden">
            <button
              onClick={() => onExportWord ? onExportWord(doc, templateMode) : exportRppToWord(doc!, templateMode)}
              className="inline-flex items-center gap-1.5 px-3 py-2 hover:bg-blue-100 transition-colors cursor-pointer"
              title="Unduh dokumen Microsoft Word (.doc) dengan teks rapi terstruktur sesuai template"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Word (Teks)</span>
            </button>
            <div className="w-[1px] h-5 bg-blue-200"></div>
            <button
              onClick={handleDownloadWordHd}
              disabled={isCapturingSs}
              className="inline-flex items-center gap-1 px-2.5 py-2 hover:bg-blue-100 text-blue-900 transition-colors cursor-pointer text-[11px] font-bold"
              title="Unduh dokumen Word dengan gambar screenshot HD tertanam (100% Anti-Geser, persis pratinjau)"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Word HD (Anti-Geser)</span>
            </button>
          </div>

          {/* Full Document PDF Download Compiled from High-Res Screenshots */}
          <button
            onClick={() => handleDownloadPdf('all')}
            disabled={isExportingPdf || isCapturingSs}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Unduh seluruh 4 halaman RPP yang dikompilasi langsung dari screenshot resolusi tinggi (Anti-Geser 100%)"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyusun PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF (Screenshot HD)</span>
              </>
            )}
          </button>

          <button
            onClick={triggerPrintRpp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Cetak langsung ke printer atau Simpan sebagai PDF via browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Print</span>
          </button>
        </div>
      </div>

      {/* ANTI-FORMAT-BERUBAH INFO BANNER */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 border border-purple-200/80 rounded-xl p-3 px-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 print:hidden">
        <div className="flex items-center gap-2.5 text-purple-950 font-medium">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-1.5 text-slate-900">
              <span>Solusi Anti Format Berubah: PDF Langsung Dikompilasi dari Screenshot HD</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold border border-emerald-300">100% Presisi Anti-Geser</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Dokumen PDF disusun langsung dari tangkapan layar 300 DPI per halaman (PNG lossless). Format tabel, margin, font, dan tanda tangan <strong>terkunci sempurna</strong> saat dibuka di perangkat mana pun.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleDownloadPdf('all')}
            disabled={isExportingPdf || isCapturingSs}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
            title="Kompilasi dan unduh dokumen PDF 4 halaman yang diambil langsung dari screenshot HD"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh PDF dari Screenshot</span>
          </button>
          <button
            onClick={handleDownloadAllScreenshots}
            disabled={isCapturingSs}
            className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <Camera className="w-3 h-3" />
            Unduh 4 PNG
          </button>
          <button
            onClick={handleOpenGallery}
            className="px-3 py-1.5 bg-white hover:bg-purple-100 text-purple-800 border border-purple-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <ImageIcon className="w-3 h-3" />
            Galeri
          </button>
        </div>
      </div>

      {/* Page Navigation & Interactive Thumbnails Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
        {/* Left: Page Mode Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setCurrentPage('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentPage === 'all'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Halaman (4 Hal)</span>
          </button>

          {pageTitles.map((p) => {
            const isActive = currentPage === p.page;
            return (
              <button
                key={p.page}
                onClick={() => setCurrentPage(p.page)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{p.title}:</span>
                <span className="font-normal opacity-90 truncate max-w-[130px]">{p.subtitle}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Stepper Buttons & Page Indicator */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={goToPrevPage}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-700">
            {currentPage === 'all' ? 'Halaman 1 - 4' : `Halaman ${currentPage} dari 4`}
          </span>

          <button
            onClick={goToNextPage}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Halaman Berikutnya"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Visual Page Mini-Thumbnails (Per-Halaman Quick Jump & Screenshot Actions) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden">
        {pageTitles.map((p) => {
          const isSelected = currentPage === p.page;
          return (
            <div
              key={p.page}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-purple-600 bg-purple-50/60 shadow-xs ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                onClick={() => setCurrentPage(p.page)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {p.title}
                  </span>
                  <Eye className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                </div>
                <div className="text-[11px] font-medium text-slate-800 leading-tight truncate">
                  {p.subtitle}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {templateMode === 'modern' ? 'Format Modern Geometris' : 'Format Klasik Dinas'}
                </div>
              </div>

              {/* Quick Screenshot Button per Thumbnail */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                <button
                  onClick={() => handleCopyScreenshot(p.page)}
                  disabled={isCapturingSs}
                  className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                  title={`Salin screenshot Halaman ${p.page} ke clipboard`}
                >
                  {copiedPage === p.page ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Salin</span>
                </button>
                <button
                  onClick={() => handleDownloadSingleScreenshot(p.page)}
                  disabled={isCapturingSs}
                  className="p-1 px-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-semibold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                  title={`Unduh PNG Halaman ${p.page}`}
                >
                  <Camera className="w-3 h-3" />
                  <span>SS PNG</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render Document on A4 Paper Canvas with Per-Page Screenshot Headers */}
      <div className="bg-slate-200/80 p-4 sm:p-8 rounded-2xl flex flex-col items-center overflow-x-auto print:p-0 print:bg-white shadow-inner">
        <div
          id="rpp-preview-canvas"
          className="shadow-2xl rounded-sm print:shadow-none print:w-full print:m-0 transition-transform origin-top flex flex-col items-center gap-8"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center'
          }}
        >
          {currentPage === 'all' ? (
            // All 4 Pages rendered as distinct sheets with Per-Page Action Bars
            <>
              {[1, 2, 3, 4].map((p) => (
                <div key={p} className="flex flex-col items-center">
                  {/* Per-Page Screenshot Control Bar */}
                  <div className="w-[210mm] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2 rounded-t-lg flex items-center justify-between text-xs shadow-md print:hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-bold bg-white text-slate-900 px-2 py-0.5 rounded text-[11px]">
                        Halaman {p} dari 4
                      </span>
                      <span className="text-slate-200 font-medium truncate max-w-xs">
                        {pageTitles.find((pt) => pt.page === p)?.subtitle}
                      </span>
                      <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-700/60 font-semibold">
                        PNG HD &bull; 300 DPI
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyScreenshot(p as 1 | 2 | 3 | 4)}
                        disabled={isCapturingSs}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                        title="Salin gambar halaman ini ke clipboard"
                      >
                        {copiedPage === p ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Gambar</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDownloadSingleScreenshot(p as 1 | 2 | 3 | 4)}
                        disabled={isCapturingSs}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                        title="Unduh tangkapan layar halaman penuh ini sebagai gambar PNG resolusi tinggi"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>SS Hal. {p} (PNG)</span>
                      </button>

                      <button
                        onClick={() => handleDownloadPdf(p as 1 | 2 | 3 | 4)}
                        disabled={isCapturingSs || isExportingPdf}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                        title="Unduh dokumen PDF halaman ini yang dikompilasi langsung dari screenshot (Anti-Geser)"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF Hal. {p}</span>
                      </button>
                    </div>
                  </div>

                  {/* A4 Document Sheet - Exactly 210mm x 297mm */}
                  <div
                    id={`rpp-sheet-${p}`}
                    className="w-[210mm] h-[297mm] bg-white border border-slate-300 shadow-xl relative overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: generateRppHtml(doc, templateMode, p as 1 | 2 | 3 | 4)
                    }}
                  />
                </div>
              ))}
            </>
          ) : (
            // Single page preview with navigation & dedicated screenshot bar
            <div className="flex flex-col items-center">
              {/* Single Page Status & Action Ribbon */}
              <div className="w-[210mm] bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white px-4 py-2.5 rounded-t-lg flex items-center justify-between text-xs shadow-md print:hidden">
                <div className="flex items-center gap-2">
                  <span className="font-bold bg-white text-slate-900 px-2 py-0.5 rounded text-[11px]">
                    Halaman {currentPage} dari 4
                  </span>
                  <span className="font-medium text-slate-200 truncate max-w-sm">
                    {pageTitles.find((p) => p.page === currentPage)?.subtitle}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900 text-purple-200 border border-purple-700/60 font-semibold">
                    Resolusi Tinggi (300 DPI)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyScreenshot(currentPage)}
                    disabled={isCapturingSs}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                    title="Salin gambar halaman ini ke clipboard"
                  >
                    {copiedPage === currentPage ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Gambar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadSingleScreenshot(currentPage)}
                    disabled={isCapturingSs}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                    title={`Unduh tangkapan layar penuh Halaman ${currentPage} sebagai gambar PNG beresolusi tinggi`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>SS Hal. {currentPage} (PNG)</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(currentPage)}
                    disabled={isCapturingSs || isExportingPdf}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                    title={`Unduh dokumen PDF Halaman ${currentPage} yang dikompilasi dari screenshot (Anti-Geser)`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF Hal. {currentPage}</span>
                  </button>
                </div>
              </div>

              {/* Single Page A4 Sheet - Exactly 210mm x 297mm */}
              <div
                id={`rpp-sheet-${currentPage}`}
                className="w-[210mm] h-[297mm] bg-white border border-slate-300 shadow-xl relative overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: generateRppHtml(doc, templateMode, currentPage)
                }}
              />

              {/* Bottom Quick Page Jump Controls */}
              <div className="w-[210mm] bg-white p-3 rounded-b-lg border border-slate-300 shadow-sm flex items-center justify-between text-xs text-slate-600 print:hidden">
                <button
                  onClick={goToPrevPage}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Halaman Sebelumnya
                </button>
                <button
                  onClick={() => setCurrentPage('all')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded font-semibold cursor-pointer"
                >
                  Beralih ke Pratinjau 4 Halaman Sekaligus
                </button>
                <button
                  onClick={goToNextPage}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Halaman Berikutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GALERI SCREENSHOT MODAL: LIHAT & SALIN SEMUA HALAMAN */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Galeri Screenshot Dokumen Penuh (Anti Format Berubah)</h3>
                  <p className="text-[11px] text-slate-400">
                    SMK Negeri 2 Magelang &bull; {doc.guru.mataPelajaran} &bull; {doc.guru.kelas}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Feature Benefit Callout */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-xs text-purple-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-purple-950">Mengapa Menggunakan Screenshot Resolusi Tinggi (PNG)?</div>
                  <p className="text-[11px] leading-relaxed text-purple-800">
                    Ketika dokumen diunduh dalam format Word (.doc) atau PDF pada versi software yang berbeda, kerap terjadi pergeseran tabel, ukuran font, atau pemotongan halaman. Gambar PNG resolusi tinggi ini menangkap dokumen <strong>100% identik</strong> sesuai tampilan resmi tanpa pergeseran sekecil apa pun.
                  </p>
                </div>
              </div>

              {/* Page Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                {pageTitles.map((p) => (
                  <button
                    key={p.page}
                    onClick={() => setModalActivePage(p.page)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      modalActivePage === p.page
                        ? 'bg-purple-700 text-white shadow-xs font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{p.title}</span>
                    <span className="text-[10px] opacity-80">({p.subtitle})</span>
                  </button>
                ))}
              </div>

              {/* Active Page Preview Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Visual Image Preview Column */}
                <div className="md:col-span-7 bg-slate-100 rounded-xl p-3 border border-slate-200 flex flex-col items-center justify-center relative min-h-[420px]">
                  {galleryImages[modalActivePage] ? (
                    <div className="relative group max-w-full">
                      <img
                        src={galleryImages[modalActivePage]}
                        alt={`Screenshot Halaman ${modalActivePage}`}
                        className="rounded shadow-md border border-slate-300 max-h-[450px] object-contain cursor-zoom-in"
                        onClick={() => setFullscreenImage(galleryImages[modalActivePage])}
                      />
                      <button
                        onClick={() => setFullscreenImage(galleryImages[modalActivePage])}
                        className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        Perbesar
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-8 space-y-3">
                      <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
                      <p className="text-xs text-slate-500 font-medium">Memuat tangkapan layar resolusi tinggi...</p>
                    </div>
                  )}
                </div>

                {/* Details & Action Column */}
                <div className="md:col-span-5 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      Spesifikasi Gambar
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {pageTitles.find((p) => p.page === modalActivePage)?.title} &mdash; {pageTitles.find((p) => p.page === modalActivePage)?.subtitle}
                    </h4>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 pt-1">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Format: <strong>PNG 24-bit Lossless</strong>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Resolusi: <strong>300 DPI Print Quality</strong> (~2382 &times; 3369 px)
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Ukuran Kertas: <strong>A4 Penuh (210 &times; 297 mm)</strong>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Status: <strong>Siap dicetak atau dibagikan ke WhatsApp</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownloadSingleScreenshot(modalActivePage)}
                      disabled={isCapturingSs}
                      className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh PNG Halaman {modalActivePage} (HD)</span>
                    </button>

                    <button
                      onClick={() => handleCopyScreenshot(modalActivePage)}
                      disabled={isCapturingSs}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {copiedPage === modalActivePage ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Gambar Tersalin ke Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-600" />
                          <span>Salin Gambar ke Clipboard</span>
                        </>
                      )}
                    </button>

                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <button
                        onClick={() => {
                          setShowGalleryModal(false);
                          handleDownloadPdf('all');
                        }}
                        disabled={isCapturingSs || isExportingPdf}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                        title="Menggabungkan hasil tangkapan layar 4 halaman menjadi 1 file PDF A4 utuh (100% Anti-Geser)"
                      >
                        <Download className="w-4 h-4" />
                        <span>Satukan Jadi Dokumen PDF (4 Halaman HD)</span>
                      </button>

                      <button
                        onClick={handleDownloadAllScreenshots}
                        disabled={isCapturingSs}
                        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Unduh Semua 4 Halaman (4 File PNG)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>SMK Negeri 2 Magelang &bull; RPP Kurikulum Merdeka</span>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Tutup Galeri
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE MODAL ZOOM */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              src={fullscreenImage}
              alt="Full Resolution Screenshot"
              className="max-h-[95vh] max-w-[95vw] object-contain rounded shadow-2xl border border-white/20"
            />
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
