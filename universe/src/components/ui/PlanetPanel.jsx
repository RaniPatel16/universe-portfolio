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
  missionControl,
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

  // Knowledge Core local / store states
  const certificatesScanning = useUniverseStore((s) => s.certificatesScanning);
  const certificatesScanned = useUniverseStore((s) => s.certificatesScanned);
  const certificatesExplored = useUniverseStore((s) => s.certificatesExplored);
  const focusedCertificateId = useUniverseStore((s) => s.focusedCertificateId);
  const setFocusedCertificate = useUniverseStore((s) => s.setFocusedCertificate);
  const finishCertificatesScan = useUniverseStore((s) => s.finishCertificatesScan);
  const openCertificateModal = useUniverseStore((s) => s.openCertificateModal);
  const [scanStep, setScanStep] = useState(0);

  // Sequential scanning trigger effect
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

  if (phase !== 'journey') return null;

  const active = PLANETS.find((p) => p.id === activePlanetId);
  const next = getNextPlanet(activePlanetId);

  return (
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

                <PanelContent planetId={activePlanetId} openProject={openProject} scanStep={scanStep} />

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
  );
}

function PanelContent({ planetId, openProject, scanStep }) {
  const certificatesScanning = useUniverseStore((s) => s.certificatesScanning);
  const certificatesExplored = useUniverseStore((s) => s.certificatesExplored);
  const focusedCertificateId = useUniverseStore((s) => s.focusedCertificateId);
  const setFocusedCertificate = useUniverseStore((s) => s.setFocusedCertificate);
  const openCertificateModal = useUniverseStore((s) => s.openCertificateModal);
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
                <a href={d.prototypeUrl} target="_blank" rel="noreferrer" className="text-ion text-[11px] font-mono underline self-start mt-1">
                  Open Prototype
                </a>
              )}
            </div>
          )}
        />
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

    case 'hackathons':
      return (
        <EmptyOrList
          items={hackathons}
          render={(h) => (
            <div key={h.id} className="glass-panel rounded-lg px-4 py-3 flex flex-col gap-1">
              <p className="text-holo font-semibold">{h.name}</p>
              <p className="text-white/50 text-xs">
                <span className="text-white/70">Problem:</span> {h.problemStatement}
              </p>
              <p className="text-white/50 text-xs">
                <span className="text-white/70">Solution:</span> {h.solution}
              </p>
              <p className="text-solar text-xs font-mono uppercase">{h.outcome}</p>
              {h.github && (
                <a href={h.github} target="_blank" rel="noreferrer" className="text-ion text-xs font-mono underline">
                  Repository
                </a>
              )}
            </div>
          )}
        />
      );

    case 'achievements':
      return (
        <div className="grid grid-cols-2 gap-3">
          {achievements.milestones.map((m) => (
            <div key={m.label} className="glass-panel rounded-lg px-4 py-4 text-center">
              <p className="font-display text-3xl text-solar holo-text-glow">{m.value}+</p>
              <p className="text-white/50 text-[10px] font-mono uppercase mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      );

    case 'missioncontrol':
      return (
        <div className="flex flex-col gap-3 text-sm text-white/70">
          <p>
            Live GitHub stats for <span className="text-ion font-mono">@{missionControl.githubUsername}</span> — wire up a
            GitHub stats card image or the GitHub REST API here.
          </p>
          <a
            href={`https://github.com/${missionControl.githubUsername}`}
            target="_blank"
            rel="noreferrer"
            className="text-ion font-mono text-xs underline"
          >
            View GitHub Profile
          </a>
          <a
            href={`https://leetcode.com/${missionControl.leetcodeUsername}`}
            target="_blank"
            rel="noreferrer"
            className="text-ion font-mono text-xs underline"
          >
            View LeetCode Profile
          </a>
          <p className="text-white/40 text-xs mt-2">
            Tip: services like github-readme-stats.vercel.app can generate live stat images you can drop straight in here.
          </p>
        </div>
      );

    case 'resume':
      return (
        <div className="flex flex-col gap-4">
          <p className="text-white/70 text-sm">Preview the resume below, or download it directly.</p>
          <div className="aspect-[3/4] w-full rounded-lg overflow-hidden border border-ion/20">
            <iframe src={profile.resumeUrl} title="Resume" className="w-full h-full bg-white" />
          </div>
          <a
            href={profile.resumeUrl}
            download
            className="self-start px-5 py-2 rounded-full bg-ion text-void font-mono text-[10px] uppercase tracking-widest font-semibold shadow-glow-ion"
          >
            Download Resume
          </a>
        </div>
      );

    case 'contact':
      return <ContactForm />;

    case 'social':
      return (
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(profile.social).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="glass-panel rounded-lg px-4 py-3 text-center hover:border-ion/50 transition-colors"
            >
              <p className="text-holo font-mono text-xs uppercase tracking-widest">{key}</p>
            </a>
          ))}
        </div>
      );

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
