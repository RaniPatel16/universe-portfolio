import { AnimatePresence, motion } from 'framer-motion';
import { projects } from '../../data/portfolioData';
import { useUniverseStore } from '../../store/useUniverseStore';

export default function ProjectModal() {
  const activeProjectId = useUniverseStore((s) => s.activeProjectId);
  const closeProject = useUniverseStore((s) => s.closeProject);
  const project = projects.find((p) => p.id === activeProjectId);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
          onClick={closeProject}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel clip-corner max-w-2xl w-full max-h-[85vh] overflow-y-auto holo-scroll p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-alert">{project.category}</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-holo holo-text-glow">{project.title}</h2>
              </div>
              <button onClick={closeProject} className="text-white/50 hover:text-white text-xl leading-none">
                ✕
              </button>
            </div>

            <p className="text-white/70 text-sm mb-5">{project.description}</p>

            <Section title="Tech Stack">
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full border border-ion/30 text-ion text-[10px] font-mono uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Features">
              <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Section>

            <Section title="Source & Deployment Hub">
              <div className="flex flex-col gap-3">
                <LinkButton href={project.github} label="Access GitHub Codebase" />
                <LinkButton href={project.live} label="Launch Live Deployment" />
                <LinkButton href={project.youtube} label="Watch YouTube Walkthrough" />
                <LinkButton href={project.postman} label="Open Postman API Docs" />
                <LinkButton href={project.figma} label="View Figma Designs" />
              </div>
            </Section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">{title}</p>
      {children}
    </div>
  );
}

function LinkButton({ href, label }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="w-full py-4 px-6 rounded-xl bg-void/40 border border-ion/15 hover:border-ion/60 text-holo hover:text-ion hover:shadow-glow-ion/10 transition-all flex items-center justify-between text-xs font-mono uppercase tracking-wider cursor-pointer"
    >
      <span>{label}</span>
      <span className="text-[10px] text-ion/70 racking-widest">LAUNCH LINK ↗</span>
    </a>
  );
}
