import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header, ActiveTab } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { IdentityFormView } from './components/IdentityFormView';
import { ProtaImportView } from './components/ProtaImportView';
import { CpListView } from './components/CpListView';
import { RppEditorView } from './components/RppEditorView';
import { RppPreviewDoc } from './components/RppPreviewDoc';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';

import {
  SchoolProfile,
  TeacherProfile,
  LearningSettings,
  ProtaData,
  CPItem,
  RPPDocument
} from './types/rpp';

import {
  getSavedSchoolProfile,
  saveSchoolProfile,
  getSavedTeacherProfile,
  saveTeacherProfile,
  getSavedLearningSettings,
  saveLearningSettings,
  getSavedProtaList,
  saveProtaList,
  getCurrentProta,
  setCurrentProtaId,
  getSavedRppDocuments,
  saveRppDocument,
  deleteRppDocument,
  getRppById,
  duplicateRppDocument,
  updateCpStatus,
  resetToProta20262027
} from './utils/storage';

import {
  exportRppToPdf,
  exportCombinedRppPdf,
  exportRppToWord
} from './utils/pdfExport';

import {
  SAMPLE_PROTA_PPLG,
  SAMPLE_PROTA_INFORMATIKA,
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_TEACHER_PROFILE,
  DEFAULT_LEARNING_SETTINGS
} from './utils/sampleData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('daftar-cp');
  const [school, setSchool] = useState<SchoolProfile>(getSavedSchoolProfile);
  const [teacher, setTeacher] = useState<TeacherProfile>(getSavedTeacherProfile);
  const [settings, setSettings] = useState<LearningSettings>(getSavedLearningSettings);
  const [protaList, setProtaList] = useState<ProtaData[]>(getSavedProtaList);
  const [currentProta, setCurrentProta] = useState<ProtaData>(getCurrentProta);
  const [rppList, setRppList] = useState<RPPDocument[]>(getSavedRppDocuments);
  const [activeRpp, setActiveRpp] = useState<RPPDocument | null>(null);
  const [selectedCp, setSelectedCp] = useState<CPItem | null>(null);
  const [autoSavedTime, setAutoSavedTime] = useState<string | null>(null);

  // Sync to master PROTA 2026/2027 & pre-generated RPPs
  const handleResetToProta2026 = useCallback(() => {
    const res = resetToProta20262027();
    setSchool(res.school);
    setTeacher(res.teacher);
    setSettings(res.settings);
    setProtaList(getSavedProtaList());
    setCurrentProta(res.prota);
    setRppList(res.rpps);
    if (res.prota.items.length > 0) {
      setSelectedCp(res.prota.items[0]);
    }
    if (res.rpps.length > 0) {
      setActiveRpp(res.rpps[0]);
    }
    setAutoSavedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  // Sync selected CP with active RPP on initial load
  useEffect(() => {
    if (!selectedCp && currentProta.items.length > 0) {
      setSelectedCp(currentProta.items[0]);
    }
  }, [currentProta, selectedCp]);

  // If a selectedCp has an existing RPP, make it active
  useEffect(() => {
    if (selectedCp) {
      const existing = rppList.find((r) => r.cpId === selectedCp.id);
      if (existing) {
        setActiveRpp(existing);
      }
    }
  }, [selectedCp, rppList]);

  // Handler: Save School & Teacher & Settings
  const handleSaveIdentity = (newSchool: SchoolProfile, newTeacher: TeacherProfile, newSettings: LearningSettings) => {
    setSchool(newSchool);
    setTeacher(newTeacher);
    setSettings(newSettings);
    saveSchoolProfile(newSchool);
    saveTeacherProfile(newTeacher);
    saveLearningSettings(newSettings);
    setAutoSavedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
  };

  // Handler: PROTA Imported
  const handleProtaImported = (newProta: ProtaData) => {
    const updatedList = [newProta, ...protaList.filter((p) => p.id !== newProta.id)];
    setProtaList(updatedList);
    saveProtaList(updatedList);
    setCurrentProta(newProta);
    setCurrentProtaId(newProta.id);
    if (newProta.items.length > 0) {
      setSelectedCp(newProta.items[0]);
      setActiveRpp(null);
    }
    // Update teacher mapel if inferred from prota
    if (newProta.mataPelajaran) {
      const updatedTeacher = { ...teacher, mataPelajaran: newProta.mataPelajaran, kelas: newProta.kelas || teacher.kelas };
      setTeacher(updatedTeacher);
      saveTeacherProfile(updatedTeacher);
    }
  };

  // Handler: Select CP to work on
  const handleSelectCpForGenerator = (cp: CPItem) => {
    setSelectedCp(cp);
    const existing = rppList.find((r) => r.cpId === cp.id);
    if (existing) {
      setActiveRpp(existing);
    } else {
      setActiveRpp(null);
    }
    setActiveTab('generator');
  };

  // Handler: Save RPP
  const handleSaveRpp = (doc: RPPDocument, markStatus?: 'draft' | 'selesai') => {
    const updatedStatus = markStatus || doc.status;
    const toSave: RPPDocument = {
      ...doc,
      status: updatedStatus,
      updatedAt: new Date().toISOString()
    };

    saveRppDocument(toSave);
    setActiveRpp(toSave);

    // Refresh RPP list & PROTA status
    const updatedRpps = getSavedRppDocuments();
    setRppList(updatedRpps);
    setProtaList(getSavedProtaList());
    setCurrentProta(getCurrentProta());

    setAutoSavedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

    if (updatedStatus === 'selesai') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Handler: Full AI Generation for CP
  const handleGenerateFullAi = async (cp: CPItem): Promise<RPPDocument | null> => {
    try {
      const response = await fetch('/api/generate-rpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school,
          teacher,
          cpItem: cp,
          modelPembelajaran: settings.modelPembelajaran,
          jumlahJp: cp.jp || settings.jumlahJp,
          durasiJp: settings.durasiJp,
          kktp: settings.kktp,
          tanggalRpp: settings.tanggalRpp
        })
      });

      const resData = await response.json();
      const generated = resData.rpp;

      const newDoc: RPPDocument = {
        id: `rpp-${Date.now()}`,
        cpId: cp.id,
        protaId: currentProta.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        status: 'draft',
        sekolah: school,
        guru: teacher,
        pengaturan: {
          ...settings,
          jumlahJp: cp.jp || settings.jumlahJp
        },
        dimensiProfilLulusan: generated.dimensiProfilLulusan,
        karakteristik: generated.karakteristik,
        capaianPembelajaran: cp.cp, // Strictly preserved from PROTA
        tujuanPembelajaran: generated.tujuanPembelajaran || (cp.tp ? [cp.tp] : []),
        kemitraan: generated.kemitraan,
        pemanfaatanDigital: generated.pemanfaatanDigital,
        pengalamanPembelajaran: generated.pengalamanPembelajaran,
        asesmen: generated.asesmen,
        remedialDanPengayaan: generated.remedialDanPengayaan,
        glosarium: generated.glosarium,
        daftarPustaka: generated.daftarPustaka,
        tandaTangan: {
          kepalaSekolahNama: school.namaKepalaSekolah,
          kepalaSekolahNip: school.nipKepalaSekolah,
          guruNama: teacher.namaGuru,
          guruNip: teacher.nip,
          tempatTanggal: `${school.kotaKabupaten}, ${settings.tanggalRpp}`
        }
      };

      saveRppDocument(newDoc);
      setActiveRpp(newDoc);
      setRppList(getSavedRppDocuments());
      setCurrentProta(getCurrentProta());
      setAutoSavedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      return newDoc;
    } catch (err) {
      console.error('Error calling /api/generate-rpp:', err);
      return null;
    }
  };

  // Handler: Regenerate Section
  const handleRegenerateSection = async (section: string, rpp: RPPDocument) => {
    try {
      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          cpItem: selectedCp,
          teacher: rpp.guru,
          modelPembelajaran: rpp.pengaturan.modelPembelajaran,
          jumlahJp: rpp.pengaturan.jumlahJp,
          durasiJp: rpp.pengaturan.durasiJp,
          kktp: rpp.pengaturan.kktp
        })
      });

      const resData = await response.json();
      return resData.data;
    } catch (err) {
      console.error('Failed to regenerate section:', err);
      return null;
    }
  };

  // Handler: Duplicate RPP
  const handleDuplicateRpp = (rppId: string) => {
    const duplicated = duplicateRppDocument(rppId);
    if (duplicated) {
      setActiveRpp(duplicated);
      setRppList(getSavedRppDocuments());
      setActiveTab('generator');
      alert(`Berhasil membuat duplikasi RPP (Versi ${duplicated.version})`);
    }
  };

  // Handler: Delete RPP
  const handleDeleteRpp = (rppId: string) => {
    deleteRppDocument(rppId);
    setRppList(getSavedRppDocuments());
    setCurrentProta(getCurrentProta());
    if (activeRpp?.id === rppId) {
      setActiveRpp(null);
    }
  };

  // Handler: Preview RPP
  const handlePreviewRpp = (rppId: string) => {
    const found = getRppById(rppId);
    if (found) {
      setActiveRpp(found);
      setActiveTab('preview');
    }
  };

  // Handler: Download All RPPs (Individual files sequentially)
  const handleDownloadAllRpps = () => {
    const available = rppList.filter((r) => r.status === 'selesai' || r.status === 'pdf');
    if (available.length === 0) {
      alert('Belum ada RPP dengan status selesai untuk diunduh.');
      return;
    }
    available.forEach((doc, idx) => {
      setTimeout(() => {
        exportRppToPdf(doc);
      }, idx * 600);
    });
  };

  // Handler: Download Combined PDF
  const handleDownloadCombinedPdf = () => {
    const available = rppList.filter((r) => r.status === 'selesai' || r.status === 'pdf');
    if (available.length === 0) {
      alert('Belum ada RPP selesai untuk digabungkan.');
      return;
    }
    exportCombinedRppPdf(
      available,
      `RPP_GABUNGAN_${teacher.mataPelajaran.replace(/[^a-zA-Z0-9]/g, '_')}_${teacher.kelas.replace(/[^a-zA-Z0-9]/g, '_')}`
    );
  };

  // Handler: Backup / Restore JSON
  const handleExportAllJson = () => {
    const data = {
      school,
      teacher,
      settings,
      protaList,
      rppList,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_rpp_smkn2_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.school) {
        setSchool(parsed.school);
        saveSchoolProfile(parsed.school);
      }
      if (parsed.teacher) {
        setTeacher(parsed.teacher);
        saveTeacherProfile(parsed.teacher);
      }
      if (parsed.settings) {
        setSettings(parsed.settings);
        saveLearningSettings(parsed.settings);
      }
      if (parsed.protaList) {
        setProtaList(parsed.protaList);
        saveProtaList(parsed.protaList);
        setCurrentProta(parsed.protaList[0]);
      }
      if (parsed.rppList) {
        localStorage.setItem('rpp_smkn2_rpp_documents', JSON.stringify(parsed.rppList));
        setRppList(parsed.rppList);
      }
      alert('Data cadangan berhasil dipulihkan!');
    } catch (err: any) {
      alert('Gagal membaca file JSON: ' + err?.message);
    }
  };

  const handleResetFactory = () => {
    handleResetToProta2026();
    alert('Aplikasi telah diatur ulang ke data resmi PROTA 2026/2027 beserta 5 RPP lengkap.');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Official Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRpp={activeRpp}
        currentProta={currentProta}
        onQuickDownload={() => activeRpp && exportRppToPdf(activeRpp)}
        autoSavedTime={autoSavedTime}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            protaList={protaList}
            currentProta={currentProta}
            rppList={rppList}
            onSelectCpForGenerator={handleSelectCpForGenerator}
            onNavigate={setActiveTab}
            onDownloadAllRpps={handleDownloadAllRpps}
            onDownloadCombinedPdf={handleDownloadCombinedPdf}
            onLoadSampleProta={() => handleProtaImported(SAMPLE_PROTA_PPLG)}
          />
        )}

        {activeTab === 'identitas' && (
          <IdentityFormView
            school={school}
            teacher={teacher}
            settings={settings}
            onSave={handleSaveIdentity}
          />
        )}

        {activeTab === 'import-prota' && (
          <ProtaImportView
            onProtaImported={handleProtaImported}
            onNavigateToCpList={() => setActiveTab('daftar-cp')}
          />
        )}

        {activeTab === 'daftar-cp' && (
          <CpListView
            currentProta={currentProta}
            rppList={rppList}
            onSelectCp={handleSelectCpForGenerator}
            onPreviewRpp={handlePreviewRpp}
            onDownloadSinglePdf={exportRppToPdf}
            onDownloadAllRpps={handleDownloadAllRpps}
            onDownloadCombinedPdf={handleDownloadCombinedPdf}
            onNavigateToImport={() => setActiveTab('import-prota')}
            onResetToProta2026={handleResetToProta2026}
          />
        )}

        {activeTab === 'generator' && (
          <RppEditorView
            rpp={activeRpp}
            selectedCp={selectedCp}
            school={school}
            teacher={teacher}
            settings={settings}
            onSaveRpp={handleSaveRpp}
            onPreviewRpp={handlePreviewRpp}
            onExportPdf={exportRppToPdf}
            onExportWord={exportRppToWord}
            onDuplicateRpp={handleDuplicateRpp}
            onGenerateFullAi={handleGenerateFullAi}
            onRegenerateSection={handleRegenerateSection}
          />
        )}

        {activeTab === 'preview' && (
          <RppPreviewDoc
            doc={activeRpp}
            onBackToEditor={() => setActiveTab('generator')}
            onExportPdf={exportRppToPdf}
            onExportWord={exportRppToWord}
          />
        )}

        {activeTab === 'riwayat' && (
          <HistoryView
            rppList={rppList}
            onOpenInEditor={(id) => {
              const r = getRppById(id);
              if (r) {
                setActiveRpp(r);
                const cp = currentProta.items.find((c) => c.id === r.cpId) || null;
                setSelectedCp(cp);
                setActiveTab('generator');
              }
            }}
            onPreviewRpp={handlePreviewRpp}
            onDownloadPdf={exportRppToPdf}
            onDownloadWord={exportRppToWord}
            onDuplicateRpp={handleDuplicateRpp}
            onDeleteRpp={handleDeleteRpp}
            onDownloadAllRpps={handleDownloadAllRpps}
            onDownloadCombinedPdf={handleDownloadCombinedPdf}
          />
        )}

        {activeTab === 'pengaturan' && (
          <SettingsView
            school={school}
            onSaveSchool={(s) => {
              setSchool(s);
              saveSchoolProfile(s);
              // Also sync school logos and profile to activeRpp and rppList
              if (activeRpp) {
                const updatedActive = { ...activeRpp, sekolah: s };
                setActiveRpp(updatedActive);
                saveRppDocument(updatedActive);
              }
              const updatedRppList = rppList.map((r) => ({ ...r, sekolah: s }));
              setRppList(updatedRppList);
              localStorage.setItem('rpp_smkn2_rpp_documents', JSON.stringify(updatedRppList));
            }}
            onExportAllJson={handleExportAllJson}
            onImportJson={handleImportJson}
            onResetFactory={handleResetFactory}
          />
        )}
      </main>

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>RPP Auto Generator</strong> &mdash; Perencanaan Pembelajaran Mendalam (PPM) SMK Negeri 2 Magelang.
          </div>
          <div className="text-[11px] text-slate-400">
            Dinas Pendidikan dan Kebudayaan Provinsi Jawa Tengah &bull; Tahun Ajaran 2026/2027
          </div>
        </div>
      </footer>
    </div>
  );
}
