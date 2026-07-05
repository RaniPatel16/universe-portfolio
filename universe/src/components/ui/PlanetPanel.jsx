import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUniverseStore } from '../../store/useUniverseStore';
import { PLANETS, getNextPlanet } from '../../lib/navigation';
import {
  profile,
  about,
  skills,
  projects,
  figmaDesigns,
  certificates,
  hackathons,
  achievements,
} from '../../data/portfolioData';
import ContactForm from './ContactForm';

export default function PlanetPanel() {
  const phase = useUniverseStore((s) => s.phase);
  const panelOpen = useUniverseStore((s) => s.panelOpen);
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setPanelOpen = useUniverseStore((s) => s.setPanelOpen);
  const travelTo = useUniverseStore((s) => s.travelTo);
  const isTraveling = useUniverseStore((s) => s.isTraveling);
  const openProject = useUniverseStore((s) => s.openProject);
  const unlockedPlanets = useUniverseStore((s) => s.unlockedPlanets);

  // Knowledge Core local / store states
  const certificatesScanning = useUniverseStore((s) => s.certificatesScanning);
  const certificatesScanned = useUniverseStore((s) => s.certificatesScanned);
  const certificatesExplored = useUniverseStore((s) => s.certificatesExplored);
  const focusedCertificateId = useUniverseStore((s) => s.focusedCertificateId);
  const setFocusedCertificate = useUniverseStore((s) => s.setFocusedCertificate);
  const finishCertificatesScan = useUniverseStore((s) => s.finishCertificatesScan);
  const openCertificateModal = useUniverseStore((s) => s.openCertificateModal);
  const [scanStep, setScanStep] = useState(0);

  // Hackathon Arena store/local states
  const hackathonsScanning = useUniverseStore((s) => s.hackathonsScanning);
  const hackathonsScanned = useUniverseStore((s) => s.hackathonsScanned);
  const hackathonsExplored = useUniverseStore((s) => s.hackathonsExplored);
  const focusedBoothId = useUniverseStore((s) => s.focusedBoothId);
  const setFocusedBooth = useUniverseStore((s) => s.setFocusedBooth);
  const finishHackathonsScan = useUniverseStore((s) => s.finishHackathonsScan);
  const soundOn = useUniverseStore((s) => s.soundOn);
  const [hackScanStep, setHackScanStep] = useState(0);

  const [showCompletionFlash, setShowCompletionFlash] = useState(false);
  const completionFlashed = useRef(false);

  useEffect(() => {
    if (activePlanetId === 'hackathons' && hackathonsScanned) {
      const completed = hackathonsExplored.length >= hackathons.length && hackathons.length > 0;
      if (completed && !completionFlashed.current) {
        completionFlashed.current = true;
        setShowCompletionFlash(true);
        const timer = setTimeout(() => setShowCompletionFlash(false), 2000);
        return () => clearTimeout(timer);
      }
    }
    if (hackathonsExplored.length < hackathons.length) {
      completionFlashed.current = false;
    }
  }, [activePlanetId, hackathonsScanned, hackathonsExplored.length]);

  // Sequential scanning trigger effect for certificates
  useEffect(() => {
    if (activePlanetId !== 'certificates' || !certificatesScanning) {
      setScanStep(0);
      return;
    }

    const interval = setInterval(() => {
      setScanStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep < 4) {
          return nextStep;
        } else {
          clearInterval(interval);
          finishCertificatesScan();
          return prev;
        }
      });
    }, 950);

    return () => clearInterval(interval);
  }, [activePlanetId, certificatesScanning, finishCertificatesScan]);

  // Sequential scanning trigger effect for hackathons
  useEffect(() => {
    if (activePlanetId !== 'hackathons' || !hackathonsScanning) {
      setHackScanStep(0);
      return;
    }

    const interval = setInterval(() => {
      setHackScanStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep < 6) {
          return nextStep;
        } else {
          clearInterval(interval);
          finishHackathonsScan();
          return prev;
        }
      });
    }, 950);

    return () => clearInterval(interval);
  }, [activePlanetId, hackathonsScanning, finishHackathonsScan]);

  // Space AI voice player helper for NOVA TTS
  const playNovaVoice = (text) => {
    if (!soundOn || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const femaleKeywords = ['zira', 'amy', 'samantha', 'siri', 'hazel', 'female', 'heera', 'susan', 'google us english', 'natural'];
    let voice = voices.find((v) => {
      if (!v.lang.startsWith('en')) return false;
      const nameLower = v.name.toLowerCase();
      return femaleKeywords.some((keyword) => nameLower.includes(keyword));
    });
    if (!voice) {
      voice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.toLowerCase().includes('google') ||
            v.name.toLowerCase().includes('microsoft'))
      );
    }
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  // Trigger speech when scan starts
  useEffect(() => {
    if (activePlanetId === 'hackathons' && hackathonsScanning) {
      playNovaVoice('Scanning Hackathon Arena database, initialising tactical hologram interfaces.');
    }
  }, [activePlanetId, hackathonsScanning]);

  // Trigger speech when scan completes
  useEffect(() => {
    if (activePlanetId === 'hackathons' && hackathonsScanned && !hackathonsScanning) {
      const completed = hackathonsExplored.length >= hackathons.length && hackathons.length > 0;
      if (!focusedBoothId && !completed) {
        playNovaVoice('Scan completed. Five local arenas detected.');
      }
    }
  }, [activePlanetId, hackathonsScanned, hackathonsScanning]);

  // Trigger speech when booth is focused
  useEffect(() => {
    if (activePlanetId === 'hackathons' && focusedBoothId) {
      const h = hackathons.find((hack) => hack.id === focusedBoothId);
      if (h) {
        playNovaVoice(`Accessing details for ${h.name}. Loading database credentials.`);
      }
    }
  }, [activePlanetId, focusedBoothId]);

  // Trigger speech on completion
  const completionSpoken = useRef(false);
  useEffect(() => {
    if (activePlanetId === 'hackathons' && hackathonsScanned) {
      const completed = hackathonsExplored.length >= hackathons.length && hackathons.length > 0;
      if (completed && !completionSpoken.current) {
        completionSpoken.current = true;
        playNovaVoice('Hackathon Arena database fully restored. Excellence verified. Excellent work, commander.');
      }
    }
    if (hackathonsExplored.length < hackathons.length) {
      completionSpoken.current = false;
    }
  }, [activePlanetId, hackathonsScanned, hackathonsExplored.length]);

  if (phase !== 'journey') return null;

  const active = PLANETS.find((p) => p.id === activePlanetId);
  const next = getNextPlanet(activePlanetId);

  return (
    <>
      <AnimatePresence>
        {showCompletionFlash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-gradient-to-r from-yellow-500/60 to-[#FFB454]/40 pointer-events-none mix-blend-color-dodge backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panelOpen && (
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            className="fixed top-0 right-0 z-40 h-full w-full sm:w-[420px] bg-void/85 backdrop-blur-md border-l border-ion/20 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b border-ion/15">
              <div>
                <h2 className="font-display text-xs font-bold text-holo holo-text-glow uppercase tracking-widest font-mono">
                  Log Command Console
                </h2>
              </div>
              <button onClick={() => setPanelOpen(false)} className="text-white/50 hover:text-white text-md cursor-pointer">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-hidden relative flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePlanetId}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="absolute inset-0 overflow-y-auto holo-scroll p-6 flex flex-col gap-6"
                >
                  <div className="border-b border-ion/10 pb-4 mb-2">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-ion">{active?.subtitle}</p>
                    <h3 className="font-display text-2xl font-bold text-holo holo-text-glow">{active?.label}</h3>
                  </div>

                  <PanelContent planetId={activePlanetId} openProject={openProject} scanStep={scanStep} hackScanStep={hackScanStep} />

                  {next && (
                    <button
                      disabled={isTraveling}
                      onClick={() => travelTo(next.id)}
                      className="w-full py-3 mt-4 rounded-full bg-gradient-to-r from-[#35F0D0] to-[#FFB454] text-void font-display text-xs uppercase tracking-[0.2em] font-bold shadow-glow-ion hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center disabled:opacity-40 disabled:scale-100"
                    >
                      WARP TO {next.label.toUpperCase()}
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function PanelContent({ planetId, openProject, scanStep, hackScanStep }) {
  const certificatesScanning = useUniverseStore((s) => s.certificatesScanning);
  const certificatesExplored = useUniverseStore((s) => s.certificatesExplored);
  const focusedCertificateId = useUniverseStore((s) => s.focusedCertificateId);
  const setFocusedCertificate = useUniverseStore((s) => s.setFocusedCertificate);
  const openCertificateModal = useUniverseStore((s) => s.openCertificateModal);

  // Hackathon Arena hooks
  const hackathonsScanning = useUniverseStore((s) => s.hackathonsScanning);
  const hackathonsScanned = useUniverseStore((s) => s.hackathonsScanned);
  const hackathonsExplored = useUniverseStore((s) => s.hackathonsExplored);
  const focusedBoothId = useUniverseStore((s) => s.focusedBoothId);
  const setFocusedBooth = useUniverseStore((s) => s.setFocusedBooth);
  const activePhotoId = useUniverseStore((s) => s.activePhotoId);
  const setActivePhoto = useUniverseStore((s) => s.setActivePhoto);
  const activeTabId = useUniverseStore((s) => s.activeTabId);
  const setActiveTab = useUniverseStore((s) => s.setActiveTab);
  // Shared custom cards for Developer and Launch Pad
  const devCards = (
    <div className="grid grid-cols-2 gap-3 mt-1">
      <div className="glass-panel flex flex-col gap-2 rounded-xl p-4 border border-ion/10 hover:border-ion/25 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-ion text-lg">💡</span>
          <h4 className="font-display text-xs font-bold text-ion uppercase tracking-wider">Development</h4>
        </div>
        <p className="text-[10px] text-white/50 leading-normal">
          High quality code with modern practices.
        </p>
      </div>
      <div className="glass-panel flex flex-col gap-2 rounded-xl p-4 border border-solar/10 hover:border-solar/25 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-solar text-lg">🎨</span>
          <h4 className="font-display text-xs font-bold text-solar uppercase tracking-wider">Design</h4>
        </div>
        <p className="text-[10px] text-white/50 leading-normal">
          User-centric and beautiful interfaces.
        </p>
      </div>
    </div>
  );

  const customBio = (
    "I am a passionate Full Stack Developer and Computer Science student. I specialize in building responsive, high-performance web applications using modern web technologies. I love solving complex algorithms, participating in nationwide hackathons, and constructing beautiful, interactive 3D digital experiences. Currently exploring creative frontends and secure, scalable backend architectures."
  );

  switch (planetId) {
    case 'launchpad':
      return (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full border-2 border-ion/30 overflow-hidden shadow-glow-ion/10">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-holo leading-tight">{profile.name}</h3>
              <p className="text-ion font-mono text-xs uppercase tracking-widest mt-1">{profile.title}</p>
            </div>
          </div>

          <p className="text-white/85 text-sm leading-relaxed">
            {customBio}
          </p>

          {devCards}
        </div>
      );

    case 'about':
      return (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full border-2 border-ion/30 overflow-hidden shadow-glow-ion/10">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-holo leading-tight">{profile.name}</h3>
              <p className="text-ion font-mono text-xs uppercase tracking-widest mt-1">{profile.title}</p>
            </div>
          </div>

          <p className="text-white/80 text-sm leading-relaxed">
            {customBio}
          </p>

          {devCards}

          <div>
            <p className="label text-ion font-mono text-[10px] uppercase tracking-wider mb-2">Education</p>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-white/70">
                <span className="text-holo">Idar Primery School</span> — Primary Education{' '}
                <span className="text-white/40 font-mono text-xs">(2021 - 2023)</span>
              </div>
              <div className="text-sm text-white/70">
                <span className="text-holo">Gyanmanjari Vidhyapith, Bhavnagar</span> — Higher Secondary{' '}
                <span className="text-white/40 font-mono text-xs">(2023 - 2025)</span>
              </div>
              <div className="text-sm text-white/70">
                <span className="text-holo">Swaminarayan University, Kalol</span> — Bachelor of Technology{' '}
                <span className="text-white/40 font-mono text-xs">(2025 - 2029)</span>
              </div>
            </div>
          </div>

          <div>
            <p className="label text-ion font-mono text-[10px] uppercase tracking-wider mb-2">Career Timeline</p>
            <div className="mt-2 flex flex-col gap-2 border-l border-ion/30 pl-4">
              {about.timeline.map((t) => (
                <div key={t.year} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-ion" />
                  <p className="text-xs font-mono text-ion">{t.year}</p>
                  <p className="text-sm text-white/70">{t.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'skills': {
      const groups = [
        ['Frontend', skills.frontend],
        ['Backend', skills.backend],
        ['Database', skills.database],
        ['Tools', skills.tools],
        ['Soft Skills', skills.soft],
      ];
      return (
        <div className="flex flex-col gap-5">
          <p className="text-white/80 text-sm leading-relaxed">
            This sector catalogues my technical capabilities and toolkits. I continually update this matrix to stay ahead of the technology curve, specializing in modern frontend libraries, backend databases, API development, and essential developer tools.
          </p>
          {groups.map(([label, list]) => (
            <div key={label}>
              <p className="label text-ion font-mono text-[10px] uppercase tracking-wider mb-2">{label}</p>
              <div className="flex flex-col gap-2 mt-2">
                {list.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs font-mono text-white/60 mb-1">
                      <span>{s.name}</span>
                      <span>{s.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-solar to-ion" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    case 'projects':
      return (
        <div className="flex flex-col gap-3">
          <p className="text-white/80 text-sm leading-relaxed">
            Welcome to my digital workshop, showcasing full-stack solutions, creative frontend interfaces, and interactive web experiences. Click on any project node or select from the console logs below to analyze feature highlights, GitHub code, and live deployments.
          </p>
          <p className="text-white/50 text-xs">Tap a building in the cyber city, or select a project below.</p>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => openProject(p.id)}
              className="text-left glass-panel rounded-lg px-4 py-3 hover:border-ion/50 transition-colors cursor-pointer"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-alert">{p.category}</p>
              <p className="text-holo font-semibold">{p.title}</p>
              <p className="text-white/50 text-xs mt-1 line-clamp-2">{p.description}</p>
            </button>
          ))}
        </div>
      );

    case 'figma':
      return (
        <div className="flex flex-col gap-4">
          <p className="text-white/80 text-sm leading-relaxed">
            Visual aesthetics and clean user experiences are core to my development process. This gallery showcases my user interface designs, mockups, and community prototypes crafted in Figma, focusing on layout flow, component logic, and responsive design systems.
          </p>
          <EmptyOrList
            items={figmaDesigns}
            emptyText="Add your Figma designs to src/data/portfolioData.js (figmaDesigns array)."
            render={(d) => (
              <div key={d.id} className="glass-panel rounded-lg px-4 py-3 flex flex-col gap-1.5">
                <div>
                  <p className="text-holo font-semibold">{d.title}</p>
                  {d.description && (
                    <p className="text-white/50 text-xs mt-0.5">{d.description}</p>
                  )}
                </div>
                {d.prototypeUrl && (
                  <a
                    href={d.prototypeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ion text-[11px] font-mono underline self-start mt-1"
                  >
                    Open Prototype
                  </a>
                )}
              </div>
            )}
          />
        </div>
      );

    case 'certificates': {
      // 1. Scanning State view
      if (certificatesScanning) {
        return (
          <div className="flex flex-col gap-6 py-4">
            <div className="flex justify-between items-center px-4 py-2.5 bg-ion/10 border border-ion/30 rounded-lg animate-pulse">
              <span className="font-mono text-xs text-ion uppercase tracking-widest font-bold">SYSTEM SCAN IN PROGRESS</span>
              <span className="font-mono text-xs text-ion">{Math.min(100, Math.floor(((scanStep + 1) / 4) * 100))}%</span>
            </div>

            <div className="flex flex-col gap-3.5 font-mono text-[11px] leading-relaxed">
              {['Scanning Planet...', 'Knowledge Core Detected...', 'Loading Learning Database...', 'Knowledge Crystals Found...'].map((line, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-300 flex items-center gap-2.5 ${scanStep >= idx ? 'text-holo opacity-100' : 'text-white/20 opacity-30'
                    }`}
                >
                  {scanStep >= idx ? (
                    <span className="text-ion font-bold">▶</span>
                  ) : (
                    <span className="text-white/20">&nbsp;&nbsp;</span>
                  )}
                  {line}
                </div>
              ))}
            </div>

            <div className="h-10 w-full relative overflow-hidden bg-void/50 border border-white/5 rounded-lg flex items-center justify-center p-3">
              <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
                <div
                  className="h-full bg-ion transition-all duration-700 rounded"
                  style={{ width: `${(scanStep + 1) * 25}%` }}
                />
              </div>
            </div>
          </div>
        );
      }

      // 2. Focused Crystal Details view
      if (focusedCertificateId) {
        const c = certificates.find((cert) => cert.id === focusedCertificateId);
        if (!c) return null;
        return (
          <div className="flex flex-col gap-4 py-2 h-full">
            <button
              onClick={() => setFocusedCertificate(null, null)}
              className="text-left font-mono text-[10px] tracking-widest text-ion uppercase hover:text-holo flex items-center gap-1.5 cursor-pointer pb-2 border-b border-white/10 transition-colors"
            >
              ◀ RETRACE OVERVIEW
            </button>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[72vh] pr-1 styled-scrollbar">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-solar px-2 py-0.5 border border-solar/20 bg-solar/5 rounded">
                  DECRYPTED KNOWLEDGE SOURCE
                </span>
                <span className="font-mono text-[9px] text-white/40">{c.issueDate}</span>
              </div>

              {/* Certificate Visual Container */}
              <div className="relative w-full h-[280px] rounded-lg overflow-hidden border border-ion/40 bg-void/85 shadow-glow-ion/10 mt-1 flex items-center justify-center">
                {c.credentialUrl && (c.credentialUrl.endsWith('.jpg') || c.credentialUrl.endsWith('.png') || c.credentialUrl.endsWith('.jpeg')) ? (
                  <img
                    src={c.credentialUrl}
                    onClick={() => openCertificateModal(c.credentialUrl)}
                    className="w-full h-full object-contain bg-void/30 cursor-zoom-in hover:brightness-110 transition-all"
                    alt={c.title}
                    title="Click for full-screen preview"
                  />
                ) : (
                  <iframe
                    src={`${c.credentialUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    className="w-full h-full border-0"
                    title={c.title}
                  />
                )}
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <h3 className="text-lg font-bold text-holo leading-tight text-glow-holo">{c.title}</h3>
                <p className="text-white/80 text-sm font-semibold">{c.organization}</p>
              </div>

              {c.description && (
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-mono text-[9px] text-white/40 uppercase tracking-widest">DATA ARCHIVE SUMMARY</h4>
                  <p className="text-white/70 text-xs leading-relaxed border-l-2 border-ion/50 pl-3 py-1 bg-white/5 rounded-r font-sans text-justify">
                    {c.description}
                  </p>
                </div>
              )}

              {c.skillsLearned && c.skillsLearned.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-mono text-[9px] text-white/40 uppercase tracking-widest animate-pulse">ACQUIRED TECHNOLOGY INTEL</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {c.skillsLearned.map((skill, si) => (
                      <span
                        key={si}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-ion/10 border border-ion/20 text-holo shadow-glow-ion/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {c.credentialId && (
                <div className="flex flex-row justify-between items-center border-t border-white/5 pt-2 mt-1">
                  <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Credential ID:</span>
                  <span className="font-mono text-xs text-solar">{c.credentialId}</span>
                </div>
              )}

              <div className="flex justify-between items-center gap-2 mt-2">
                <button
                  onClick={() => openCertificateModal(c.credentialUrl)}
                  className="w-full py-2.5 text-center text-xs font-mono uppercase tracking-widest transition-all border border-ion/30 hover:border-ion hover:bg-ion/10 text-holo rounded-lg bg-void/50 cursor-pointer"
                >
                  FULL PREVIEW ↗
                </button>
              </div>
            </div>
          </div>
        );
      }

      // 3. Main Dashboard Overview (decryption statuses)
      const exploredCount = certificatesExplored.length;
      const allExplored = exploredCount >= certificates.length && certificates.length > 0;

      return (
        <div className="flex flex-col gap-4">
          <p className="text-white/80 text-sm leading-relaxed">
            Continuous education and verified expertise are the foundation of my technical path. This database archives my completed certifications, engineering courses, and technical training. Select any crystalline node to inspect verification IDs and skills learned.
          </p>
          <div className="glass-panel p-4 rounded-lg border-dashed border-white/10 flex flex-col gap-1.5 text-center">
            {allExplored ? (
              <>
                <p className="text-solar text-xs font-mono font-bold tracking-widest animate-pulse">ARCHIVE SYSTEM COMPLETE</p>
                <p className="text-white/50 text-[10px] uppercase leading-relaxed mt-1">
                  Every certificate represents another milestone in Rani Patel's developer journey.
                </p>
              </>
            ) : (
              <>
                <p className="text-holo text-xs font-mono tracking-widest uppercase">ENCRYPTED CRYSTAL MATRIX ACTIVE</p>
                <p className="text-white/50 text-[10px] uppercase leading-relaxed mt-1">
                  Select a crystal in orbit to decrypt and retrieve database credentials. ({exploredCount} / {certificates.length} DECRYPTED)
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            {certificates.map((c) => {
              const visited = certificatesExplored.includes(c.id);
              const isActive = focusedCertificateId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setFocusedCertificate(c.id, null)}
                  className={`text-left glass-panel rounded-lg px-4 py-3 hover:border-ion/50 transition-colors flex items-center justify-between cursor-pointer ${isActive ? 'border-ion/70 bg-ion/5 shadow-glow-ion/10' : ''
                    }`}
                >
                  <div>
                    <p className="text-holo font-semibold text-xs">{c.title}</p>
                    <p className="text-white/40 text-[10px] mt-0.5">{c.organization}</p>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded border transition-all ${visited
                      ? 'border-solar/35 text-solar bg-solar/5'
                      : 'border-white/10 text-white/30 bg-white/5'
                      }`}
                  >
                    {visited ? 'DECRYPTED' : 'ENCRYPTED'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    case 'hackathons': {
      // 1. Scanning State view
      if (hackathonsScanning) {
        return (
          <div className="flex flex-col gap-6 py-4">
            <div className="flex justify-between items-center px-4 py-2.5 bg-neon/10 border border-[#00FA9A]/30 rounded-lg animate-pulse">
              <span className="font-mono text-xs text-[#00FA9A] uppercase tracking-widest font-bold font-mono">SYSTEM SCAN IN PROGRESS</span>
              <span className="font-mono text-xs text-[#00FA9A]">{Math.min(100, Math.floor(((hackScanStep + 1) / 6) * 100))}%</span>
            </div>

            <div className="flex flex-col gap-3.5 font-mono text-[11px] leading-relaxed">
              {[
                'Scanning Planet...',
                'Hackathon Arena Detected...',
                'Connecting Innovation Network...',
                'Loading Competition Database...',
                'Scanning Mission Records...',
                'Hackathon Booths Activated.'
              ].map((line, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-300 flex items-center gap-2.5 ${hackScanStep >= idx ? 'text-holo opacity-100' : 'text-white/20 opacity-30'
                    }`}
                >
                  {hackScanStep >= idx ? (
                    <span className="text-[#00FA9A] font-bold">▶</span>
                  ) : (
                    <span className="text-white/20">&nbsp;&nbsp;</span>
                  )}
                  {line}
                </div>
              ))}
            </div>

            <div className="h-10 w-full relative overflow-hidden bg-void/50 border border-white/5 rounded-lg flex items-center justify-center p-3">
              <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
                <div
                  className="h-full bg-[#00FA9A] transition-all duration-700 rounded"
                  style={{ width: `${((hackScanStep + 1) / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>
        );
      }

      // 2. Focused Booth Details view
      if (focusedBoothId) {
        const h = hackathons.find((hack) => hack.id === focusedBoothId);
        if (!h) return null;

        // Parse YouTube embed ID for Demo/Trailer videos
        const getYoutubeEmbedId = (url) => {
          if (!url) return '';
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = url.match(regExp);
          return (match && match[2].length === 11) ? match[2] : '';
        };

        const activePhotoIndex = activePhotoId ? h.photos.findIndex(p => p.id === activePhotoId) : -1;
        const activePhoto = activePhotoIndex !== -1 ? h.photos[activePhotoIndex] : null;

        // Helper to calculate photo world position for next/prev navigation
        const getPhotoWorldPos = (idx) => {
          const angle = (idx / h.photos.length) * Math.PI * 2;
          const rx = Math.cos(angle) * 2.4;
          const rz = Math.sin(angle) * 2.4;
          const ry = 2.5 + Math.sin(idx * 1.5) * 0.2;
          const bp = h.position;

          const targetPlanet = PLANETS.find(p => p.id === 'hackathons');
          const planetPosition = targetPlanet ? targetPlanet.position : [-50, 0, 160];
          return [
            planetPosition[0] + bp[0] + rx,
            planetPosition[1] + bp[1] + ry,
            planetPosition[2] + bp[2] + rz
          ];
        };

        const handleNextPhoto = () => {
          if (h.photos.length === 0) return;
          const nextIdx = (activePhotoIndex + 1) % h.photos.length;
          setActivePhoto(h.photos[nextIdx].id, getPhotoWorldPos(nextIdx));
        };

        const handlePrevPhoto = () => {
          if (h.photos.length === 0) return;
          const prevIdx = (activePhotoIndex - 1 + h.photos.length) % h.photos.length;
          setActivePhoto(h.photos[prevIdx].id, getPhotoWorldPos(prevIdx));
        };

        return (
          <div className="flex flex-col gap-4 py-2 h-full">
            <button
              onClick={() => setFocusedBooth(null, null)}
              className="text-left font-mono text-[10px] tracking-widest text-[#00FA9A] uppercase hover:text-white flex items-center gap-1.5 cursor-pointer pb-2 border-b border-white/10 transition-colors"
            >
              ◀ RETRACE OVERVIEW
            </button>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[72vh] pr-1 styled-scrollbar">
              {/* Category tag */}
              <div className="flex justify-between items-center">
                <span
                  className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border rounded"
                  style={{ color: h.color, borderColor: `${h.color}33`, backgroundColor: `${h.color}11` }}
                >
                  ARENA OPERATIONAL DATA
                </span>
                <span className="font-mono text-[9px] text-white/40">{h.date}</span>
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-1 mt-1">
                <h3 className="text-lg font-bold text-holo leading-tight text-glow-holo">{h.name}</h3>
                <p className="text-white/60 text-xs font-mono select-none">
                  Organizer: <span className="text-white">{h.organizer}</span>
                </p>
                <div className="text-[10px] text-white/50 leading-relaxed font-mono flex flex-wrap gap-x-2 mt-0.5">
                  <span>Team: {h.teamMembers}</span>
                  <span>•</span>
                  <span>Role: {h.myRole}</span>
                </div>
              </div>

              {/* Action Tabs Panel Container */}
              <div className="border border-white/10 rounded-lg p-3 bg-void/50 mt-1 flex flex-col gap-3">
                <div className="flex border-b border-white/10 pb-2 gap-3 justify-between">
                  {[
                    { id: 'demo', label: '🎥 Demo' },
                    { id: 'trailer', label: '📽 Trailer' },
                    { id: 'architecture', label: '📊 Schema' },
                    { id: 'slides', label: '📄 Slides' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`text-[9px] font-mono uppercase tracking-wider select-none cursor-pointer border-b-2 pb-1 transition-all ${activeTabId === tab.id
                        ? 'text-[#00FA9A] border-[#00FA9A] font-bold'
                        : 'text-white/40 border-transparent hover:text-white/80'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content renderer */}
                <div className="relative min-h-[160px] flex flex-col justify-center">
                  {activeTabId === 'demo' && (
                    h.demoVideo ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeEmbedId(h.demoVideo)}`}
                        className="w-full h-[180px] rounded border border-white/10 bg-void"
                        allowFullScreen
                        title="Demo Video"
                      />
                    ) : (
                      <p className="text-center font-mono text-[10px] text-white/40 uppercase">No live demo video file found.</p>
                    )
                  )}

                  {activeTabId === 'trailer' && (
                    h.trailerVideo ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeEmbedId(h.trailerVideo)}`}
                        className="w-full h-[180px] rounded border border-white/10 bg-void"
                        allowFullScreen
                        title="Trailer Video"
                      />
                    ) : (
                      <p className="text-center font-mono text-[10px] text-white/40 uppercase">No trailer video file found.</p>
                    )
                  )}

                  {activeTabId === 'architecture' && (
                    <div className="glass-panel p-3.5 rounded border border-white/10 font-mono text-[9px] text-white/80 leading-relaxed bg-[#0b0c16]/90 overflow-x-auto truncate">
                      <p className="text-[#00FA9A] uppercase tracking-wider text-[10px] font-bold border-b border-white/5 pb-1 mb-2">DATALAYER ARCHITECTURE SCHEMA</p>
                      <pre className="whitespace-pre font-mono text-[9px] leading-4 text-justify">
                        {h.architecture || 'No schema layout loaded.'}
                      </pre>
                    </div>
                  )}

                  {activeTabId === 'slides' && (
                    h.presentation ? (
                      <iframe
                        src={h.presentation}
                        className="w-full h-[180px] rounded border border-white/10 bg-void"
                        title="Presentation Slides"
                      />
                    ) : (
                      <p className="text-center font-mono text-[10px] text-white/40 uppercase">No presentation slides linked.</p>
                    )
                  )}
                </div>
              </div>

              {/* Photo Frame zoom-in detail modal inside command console */}
              {activePhoto && (
                <div className="border border-[#00FA9A]/40 rounded-lg p-3 bg-[#0a1b18]/60 mt-1 flex flex-col gap-3 relative animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-[#00FA9A]/20 pb-1.5">
                    <span className="font-mono text-[9px] text-[#00FA9A] uppercase tracking-widest font-bold">
                      HOLOGRAPHIC EYE: {activePhoto.category}
                    </span>
                    <button
                      onClick={() => setActivePhoto(null, null)}
                      className="text-white/40 hover:text-white text-[11px] font-mono cursor-pointer"
                    >
                      CLOSE VIEW ✕
                    </button>
                  </div>

                  <div className="relative w-full h-[200px] rounded overflow-hidden border border-[#00FA9A]/20 bg-void/90 flex items-center justify-center">
                    <img
                      src={activePhoto.url}
                      className="w-full h-full object-contain"
                      alt={activePhoto.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/hackathons/expenses_management.jpg';
                      }}
                    />
                  </div>

                  <div>
                    <h4 className="text-holo text-xs font-bold font-mono">{activePhoto.title}</h4>
                    <p className="text-white/70 text-[10.5px] leading-relaxed mt-1 font-sans text-justify">
                      {activePhoto.description}
                    </p>
                  </div>

                  {/* Carousel navigation controls */}
                  <div className="flex justify-between items-center border-[#00FA9A]/20 pt-2.5 mt-0.5 border-t">
                    <button
                      onClick={handlePrevPhoto}
                      className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-holo border border-holo/20 hover:border-holo hover:bg-holo/5 rounded transition-all cursor-pointer"
                    >
                      ◀ PREV FRAME
                    </button>
                    <span className="font-mono text-[9px] text-white/40 select-none">
                      {activePhotoIndex + 1} / {h.photos.length}
                    </span>
                    <button
                      onClick={handleNextPhoto}
                      className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-holo border border-holo/20 hover:border-holo hover:bg-holo/5 rounded transition-all cursor-pointer"
                    >
                      NEXT FRAME ▶
                    </button>
                  </div>
                </div>
              )}

              {/* Standard text briefs */}
              {!activePhoto && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <h4 className="font-mono text-[9px] text-white/40 uppercase tracking-widest">TACTICAL MISSION STATEMENT</h4>
                    <p className="text-white/75 text-[11px] leading-relaxed border-l-2 border-holo/50 pl-3 py-1 bg-white/5 rounded-r font-sans text-justify">
                      {h.problemStatement}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h4 className="font-mono text-[9px] text-white/40 uppercase tracking-widest">PROPOSED INFRASTRUCTURE SOLUTION</h4>
                    <p className="text-white/75 text-[11px] leading-relaxed border-l-2 border-[#00FA9A]/50 pl-3 py-1 bg-white/5 rounded-r font-sans text-justify">
                      {h.solution}
                    </p>
                  </div>

                  {h.challenges && (
                    <div className="flex flex-col gap-1.5">
                      <h4 className="font-mono text-[9px] text-white/40 uppercase tracking-widest">BATTLEFIELD OBSTACLES</h4>
                      <p className="text-white/75 text-[11px] leading-relaxed border-l-2 border-red-400/50 pl-3 py-1 bg-white/5 rounded-r font-sans text-justify">
                        {h.challenges}
                      </p>
                    </div>
                  )}

                  {h.learnings && (
                    <div className="flex flex-col gap-1.5">
                      <h4 className="font-mono text-[9px] text-white/40 uppercase tracking-widest">ACQUIRED KNOWLEDGE ASSETS</h4>
                      <p className="text-white/75 text-[11px] leading-relaxed border-l-2 border-amber-300/50 pl-3 py-1 bg-white/5 rounded-r font-sans text-justify">
                        {h.learnings}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <h4 className="font-mono text-[9px] text-white/40 uppercase tracking-widest animate-pulse">INTEGRATED TECH STACK</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {h.techStack.map((tech, ti) => (
                        <span
                          key={ti}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00FA9A]/10 border border-[#00FA9A]/20 text-white shadow-glow-ion/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center border-t border-white/5 pt-2 mt-1 font-mono text-[10px]">
                    <span className="text-white/40 uppercase">Outcome:</span>
                    <span className="text-[#FFB454] uppercase tracking-wider font-bold animate-pulse">{h.outcome}</span>
                  </div>
                </>
              )}

              {/* Mission Gallery carousel grid */}
              <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-3">
                <h4 className="font-mono text-[9px] text-white/40 uppercase tracking-widest font-bold">MISSION ARCHIVE GALLERY</h4>
                <div className="flex gap-2 overflow-x-auto pb-2 styled-scrollbar font-mono select-none">
                  {h.photos.map((p, idx) => {
                    const isSelected = activePhotoId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Calculate exact world pos
                          const angle = (idx / h.photos.length) * Math.PI * 2;
                          const rx = Math.cos(angle) * 2.4;
                          const rz = Math.sin(angle) * 2.4;
                          const ry = 2.5 + Math.sin(idx * 1.5) * 0.2;
                          const bp = h.position;
                          const targetPlanet = PLANETS.find(p => p.id === 'hackathons');
                          const planetPosition = targetPlanet ? targetPlanet.position : [-50, 0, 160];
                          const wPos = [
                            planetPosition[0] + bp[0] + rx,
                            planetPosition[1] + bp[1] + ry,
                            planetPosition[2] + bp[2] + rz
                          ];
                          setActivePhoto(p.id, wPos);
                        }}
                        className={`flex-none w-[95px] h-[75px] rounded border overflow-hidden cursor-pointer transition-all relative ${isSelected ? 'border-[#00FA9A] scale-[1.03] ring-1 ring-[#00FA9A]/50' : 'border-white/10 opacity-70 hover:opacity-100'
                          }`}
                      >
                        <img
                          src={p.url}
                          className="w-full h-full object-cover"
                          alt={p.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/hackathons/expenses_management.jpg';
                          }}
                        />
                        <span className="absolute bottom-0 inset-x-0 text-[6.5px] bg-void/80 text-white/80 py-0.5 truncate text-center">
                          {p.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Code link buttons */}
              <div className="flex justify-between items-center gap-2 mt-4">
                {h.github && (
                  <a
                    href={h.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 text-center text-[10px] font-mono uppercase tracking-widest transition-all border border-[#00FA9A]/30 hover:border-[#00FA9A] hover:bg-[#00FA9A]/10 text-white rounded-lg bg-void/50 cursor-pointer"
                  >
                    CODE REPOSITORY ↗
                  </a>
                )}
                {h.live && (
                  <a
                    href={h.live}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 text-center text-[10px] font-mono uppercase tracking-widest transition-all border border-holo/30 hover:border-holo hover:bg-holo/10 text-white rounded-lg bg-void/50 cursor-pointer"
                  >
                    LIVE DEPLOYMENT ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      }

      // 3. Main Dashboard Overview (decryption statuses)
      const hackExploredCount = hackathonsExplored.length;
      const allHackExplored = hackExploredCount >= hackathons.length && hackathons.length > 0;

      return (
        <div className="flex flex-col gap-4">
          <p className="text-white/80 text-sm leading-relaxed">
            The arena where code meets speed. I thrive in high-pressure team environments, rapid prototyping challenges, and national coding sprints. This sector documents my hackathon participations, showing project walkthroughs, presentation slides, and demo recordings.
          </p>
          <div className="glass-panel p-4 rounded-lg border-dashed border-white/10 flex flex-col gap-1.5 text-center">
            {allHackExplored ? (
              <>
                <p className="text-[#FFB454] text-xs font-mono font-bold tracking-widest animate-pulse">HACKATHON DECRYPT MATRIX 100% SECURED</p>
                <p className="text-white/50 text-[10px] uppercase leading-relaxed mt-1">
                  All systems restored. Innovation metrics verified. Excellence status: Commander.
                </p>
              </>
            ) : (
              <>
                <p className="text-holo text-xs font-mono tracking-widest uppercase">RADIAL ARENA NETWORK HOSTS ACTIVE</p>
                <p className="text-white/50 text-[10px] uppercase leading-relaxed mt-1">
                  Explore and activate all kiosk arenas to synchronize files. ({hackExploredCount} / {hackathons.length} SECURED)
                </p>
              </>
            )}
          </div>

          {/* Progress Tracker bar */}
          <div className="flex flex-col gap-1.5 font-mono text-[9px] text-white/50">
            <div className="flex justify-between">
              <span>ARENA CALIBRATION RATE:</span>
              <span className="text-holo font-bold">{Math.floor((hackExploredCount / hackathons.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-holo to-[#00FA9A] transition-all duration-500"
                style={{ width: `${(hackExploredCount / hackathons.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {hackathons.map((h) => {
              const visited = hackathonsExplored.includes(h.id);
              const isActive = focusedBoothId === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setFocusedBooth(h.id, null)}
                  className={`text-left glass-panel rounded-lg px-4 py-3 hover:border-ion/50 transition-colors flex items-center justify-between cursor-pointer ${isActive ? 'border-holo bg-holo/5 shadow-glow-ion/10' : ''
                    }`}
                >
                  <div>
                    <p className="text-holo font-semibold text-xs">{h.name}</p>
                    <p className="text-white/40 text-[10px] mt-0.5">{h.organizer}</p>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded border transition-all ${visited
                      ? 'border-[#00FA9A]/35 text-[#00FA9A] bg-[#00FA9A]/5'
                      : 'border-white/10 text-white/30 bg-white/5'
                      }`}
                  >
                    {visited ? 'SECURED' : 'UNEXPLORED'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    case 'achievements':
      return (
        <div className="flex flex-col gap-4">
          <p className="text-white/80 text-sm leading-relaxed">
            A telemetry overview of key developer milestones, algorithmic puzzles solved on platforms like LeetCode, certificates earned, and production-ready applications successfully shipped to orbit.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {achievements.milestones.map((m) => (
              <div key={m.label} className="glass-panel rounded-lg px-4 py-4 text-center">
                <p className="font-display text-3xl text-solar holo-text-glow">{m.value}+</p>
                <p className="text-white/50 text-[10px] font-mono uppercase mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'resume':
      return (
        <div className="flex flex-col gap-5">
          {/* Header bio */}
          <div className="glass-panel rounded-xl p-4 border border-ion/20 flex flex-col gap-1">
            <p className="font-display text-lg font-bold text-holo holo-text-glow">Rani Patel</p>
            <p className="font-mono text-[10px] text-ion uppercase tracking-widest">Full-Stack Developer</p>
            <p className="text-white/60 text-xs mt-1 leading-relaxed">
              Building fast, accessible and delightful web experiences — pixel-perfect UIs in React to scalable Node.js APIs and MongoDB databases.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['React.js','Node.js','MongoDB','Tailwind CSS','Three.js','Figma','Git'].map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-ion/10 border border-ion/30 text-ion font-mono text-[9px] uppercase tracking-wider">{t}</span>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Projects', value: '8+' },
              { label: 'Certifications', value: '25+' },
              { label: 'Hackathons', value: '5' },
            ].map(s => (
              <div key={s.label} className="glass-panel rounded-lg py-3 text-center border border-white/10">
                <p className="font-display text-xl font-bold text-solar">{s.value}</p>
                <p className="text-white/40 font-mono text-[9px] uppercase mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col gap-2">
            <p className="font-mono text-[9px] text-ion uppercase tracking-widest mb-1">Education</p>
            {[
              { school: 'Swaminarayan University, Kalol', degree: 'B.Tech — Computer Science', years: '2025–2029' },
              { school: 'Gyanmanjari Vidhyapith, Bhavnagar', degree: 'Higher Secondary', years: '2023–2025' },
              { school: 'Jawahar Navodaya Vidyalaya, Vadnagar', degree: 'Secondary Education', years: '2021–2023' },
            ].map(e => (
              <div key={e.school} className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-white/80 text-xs font-semibold">{e.school}</p>
                  <p className="text-white/40 text-[10px]">{e.degree}</p>
                </div>
                <span className="text-ion font-mono text-[9px] whitespace-nowrap mt-0.5">{e.years}</span>
              </div>
            ))}
          </div>

          {/* Featured projects */}
          <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col gap-3">
            <p className="font-mono text-[9px] text-ion uppercase tracking-widest">Featured Projects</p>
            {[
              { name: 'Rupiya App (FinTech OCR)', tech: 'React · Node.js · Tesseract.js · MongoDB', url: 'https://github.com/RaniPatel16/rupiya-app' },
              { name: 'Smart Expense Manager', tech: 'Tailwind · Node.js · JWT · RBAC', url: 'https://github.com/RaniPatel16/expance-managment' },
              { name: 'LearnSmart AI — EdTech', tech: 'React · Node.js · Emotion API', url: 'https://github.com/RaniPatel16/ed-learning' },
              { name: 'GitHub Analyzer', tech: 'React · GitHub API · Data Viz', url: 'https://github.com/RaniPatel16/git-anhalyzer' },
            ].map(p => (
              <div key={p.name} className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-white/80 text-xs font-semibold">{p.name}</p>
                  <p className="text-white/40 text-[10px]">{p.tech}</p>
                </div>
                <a href={p.url} target="_blank" rel="noreferrer"
                   className="shrink-0 text-ion font-mono text-[9px] underline mt-0.5 hover:text-solar transition-colors">
                  GitHub ↗
                </a>
              </div>
            ))}
          </div>

          {/* Live preview */}
          <div>
            <p className="font-mono text-[9px] text-ion uppercase tracking-widest mb-2">Live Preview</p>
            <div className="w-full rounded-xl overflow-hidden border border-ion/20" style={{ height: '400px' }}>
              <iframe
                src={profile.resumeUrl}
                title="Rani Patel Resume"
                className="w-full bg-white"
                style={{ width: '133%', height: '133%', transform: 'scale(0.75)', transformOrigin: 'top left' }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 rounded-full border border-ion/40 text-ion font-mono text-[10px] uppercase tracking-widest text-center hover:bg-ion/10 transition-colors"
            >
              Open Full View ↗
            </a>
            <a
              href={profile.resumeUrl}
              download="Rani_Patel_Resume.html"
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#35F0D0] to-[#FFB454] text-void font-mono text-[10px] uppercase tracking-widest font-bold text-center shadow-glow-ion hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => useUniverseStore.getState().triggerInteractionSpeech('download_resume', 'Resume download initiated.')}
            >
              ⬇ Download
            </a>
          </div>

          {/* Contact quick links */}
          <div className="glass-panel rounded-xl p-3 border border-white/10 flex flex-wrap items-center gap-3">
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider w-full">Contact</p>
            <a href="mailto:ranip161206@gmail.com" className="text-ion text-xs hover:text-solar transition-colors">✉ ranip161206@gmail.com</a>
            <span className="text-white/20">·</span>
            <a href="tel:+919898225910" className="text-ion text-xs hover:text-solar transition-colors">📞 +91 98982 25910</a>
            <span className="text-white/20">·</span>
            <span className="text-white/50 text-xs">📍 Idar, Gujarat</span>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="flex flex-col gap-4">
          <p className="text-white/80 text-sm leading-relaxed">
            Interested in starting a new project, collaborating on a technical venture, or discussing career opportunities? Send an encrypted transmission below, and I will get back to you as soon as possible.
          </p>
          <ContactForm />
        </div>
      );

    case 'social': {
      const socialPlatforms = [
        {
          key: 'github', label: 'GitHub', url: profile.social.github,
          icon: '⌥', color: '#e2e8f0', glow: 'rgba(226,232,240,0.07)', border: 'rgba(226,232,240,0.2)',
          desc: 'Open-source repos, projects & coding history.',
          cta: '@RaniPatel16',
        },
        {
          key: 'linkedin', label: 'LinkedIn', url: profile.social.linkedin,
          icon: 'in', color: '#38bdf8', glow: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.3)',
          desc: 'Professional profile, posts & career updates.',
          cta: 'Rani Patel',
        },
        {
          key: 'leetcode', label: 'LeetCode', url: profile.social.leetcode,
          icon: '◊', color: '#FFA116', glow: 'rgba(255,161,22,0.08)', border: 'rgba(255,161,22,0.3)',
          desc: '80+ problems — Easy, Medium & Hard solved.',
          cta: 'u/QGxRFjxdGR',
        },
        {
          key: 'youtube', label: 'YouTube', url: profile.social.youtube,
          icon: '▶', color: '#ff4444', glow: 'rgba(255,68,68,0.08)', border: 'rgba(255,68,68,0.3)',
          desc: 'Dev tutorials, walkthroughs & project showcases.',
          cta: '@RaniPatel-l2o',
        },
        {
          key: 'twitter', label: 'Twitter / X', url: profile.social.twitter,
          icon: '𝕏', color: '#cbd5e1', glow: 'rgba(203,213,225,0.06)', border: 'rgba(203,213,225,0.18)',
          desc: 'Tech thoughts, dev updates & community chats.',
          cta: '@RaniPatel161206',
        },
        {
          key: 'sololearn', label: 'SoloLearn', url: profile.social.sololearn,
          icon: '◎', color: '#4ade80', glow: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.3)',
          desc: 'Coding challenges, learning streaks & certs.',
          cta: 'Profile #34707279',
        },
      ];
      return (
        <div className="flex flex-col gap-4">
          <p className="text-white/50 text-xs leading-relaxed">
            Connect with me across the developer ecosystem.
          </p>
          <div className="flex flex-col gap-2.5">
            {socialPlatforms.map((p) => (
              <a
                key={p.key}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => useUniverseStore.getState().triggerInteractionSpeech(`open_${p.key}`, `Opening ${p.label}.`)}
                className="group flex items-center gap-3 rounded-xl p-3 border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: p.glow, borderColor: p.border }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm"
                  style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.border}` }}
                >
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="font-display font-bold text-sm" style={{ color: p.color }}>{p.label}</p>
                    <span className="font-mono text-[9px] text-white/30 truncate">{p.cta}</span>
                  </div>
                  <p className="text-white/40 text-[10px] mt-0.5 leading-snug">{p.desc}</p>
                </div>
                <span className="text-white/20 group-hover:text-white/70 transition-colors shrink-0">↗</span>
              </a>
            ))}
          </div>
        </div>
      );
    }

    default:
      return <p className="text-white/50 text-sm">Content coming soon.</p>;
  }
}

function EmptyOrList({ items, render, emptyText = 'Add entries to src/data/portfolioData.js.' }) {
  if (!items || items.length === 0) {
    return <p className="text-white/40 text-sm">{emptyText}</p>;
  }
  return <div className="flex flex-col gap-3">{items.map(render)}</div>;
}

const getUnlockConditionText = (planetId) => {
  switch (planetId) {
    case 'launchpad':
      return "Explore Rani's profile details to initialize warp.";
    case 'about':
      return "Select any Education or Career Timeline milestone below.";
    case 'skills':
      return "Examine technical capability matrix values.";
    case 'projects':
      return "Inspect the architectural details of any project kiosk.";
    case 'figma':
      return "Access any Figma design prototype link.";
    case 'certificates':
      return "Decrypt any certification crystal in orbit.";
    case 'hackathons':
      return "Secure and explore any hackathon arena booth.";
    case 'achievements':
      return "Analyze key performance achievements.";
    case 'resume':
      return "Download or preview decrypted resume file.";
    case 'contact':
      return "Transmit secure message package to Rani Patel.";
    default:
      return "Complete current sector analysis.";
  }
};
