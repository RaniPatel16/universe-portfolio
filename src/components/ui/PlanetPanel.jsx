import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUniverseStore } from '../../store/useUniverseStore';
import { PLANETS } from '../../lib/navigation';
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
    const targetPlanetId = useUniverseStore((s) => s.targetPlanetId);
    const setPanelOpen = useUniverseStore((s) => s.setPanelOpen);
    const travelTo = useUniverseStore((s) => s.travelTo);
    const isTraveling = useUniverseStore((s) => s.isTraveling);
    const openProject = useUniverseStore((s) => s.openProject);

    const containerRef = useRef(null);
    const isScrollingRef = useRef(false);

    // Sync scroll container position with targetPlanetId
    useEffect(() => {
        if (!containerRef.current || !panelOpen) return;
        const targetElement = containerRef.current.querySelector(
            `[data-planet-id="${targetPlanetId}"]`
        );
        if (targetElement) {
            isScrollingRef.current = true;
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const timer = setTimeout(() => {
                isScrollingRef.current = false;
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [targetPlanetId, panelOpen]);

    const handleScroll = (e) => {
        if (isScrollingRef.current || isTraveling) return;
        const container = e.currentTarget;
        const containerCenter = container.scrollTop + container.clientHeight / 2;
        const children = container.querySelectorAll('[data-planet-id]');

        let closestPlanetId = activePlanetId;
        let minDistance = Infinity;

        children.forEach((child) => {
            const childTop = child.offsetTop;
            const childHeight = child.clientHeight;
            const childCenter = childTop + childHeight / 2;
            const distance = Math.abs(containerCenter - childCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestPlanetId = child.getAttribute('data-planet-id');
            }
        });

        if (closestPlanetId !== activePlanetId) {
            travelTo(closestPlanetId);
        }
    };

    if (phase !== 'journey') return null;

    return (
        <AnimatePresence>
            {panelOpen && (
                <motion.aside
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                    className="fixed top-0 right-0 z-40 h-full w-full sm:w-[420px] glass-panel border-l border-ion/20 flex flex-col overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 pb-4 border-b border-ion/15">
                        <div>
                            <h2 className="font-display text-xs font-bold text-holo holo-text-glow uppercase tracking-widest font-mono">
                                Log Command Console
                            </h2>
                        </div>
                        <button onClick={() => setPanelOpen(false)} className="text-white/50 hover:text-white text-md">
                            ✕
                        </button>
                    </div>

                    <div
                        ref={containerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto holo-scroll p-6 flex flex-col gap-12"
                    >
                        {PLANETS.map((p) => {
                            const isActive = p.id === activePlanetId;
                            return (
                                <div
                                    key={p.id}
                                    data-planet-id={p.id}
                                    className={`py-8 border-b last:border-0 border-ion/10 min-h-[60vh] flex flex-col justify-start transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-30'
                                        }`}
                                >
                                    <div className="mb-4">
                                        <p className="font-mono text-[9px] uppercase tracking-widest text-ion">{p.subtitle}</p>
                                        <h3 className="font-display text-lg font-bold text-holo holo-text-glow">{p.label}</h3>
                                    </div>
                                    <PanelContent planetId={p.id} openProject={openProject} />
                                </div>
                            );
                        })}
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}

function PanelContent({ planetId, openProject }) {
    switch (planetId) {
        case 'launchpad':
            return (
                <div className="flex flex-col gap-4">
                    <img
                        src={profile.photo}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full object-cover border border-ion/30"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <h3 className="font-display text-2xl text-holo">{profile.name}</h3>
                    <p className="text-ion font-mono text-xs uppercase tracking-widest">{profile.title}</p>
                    <p className="text-white/70 text-sm">{profile.tagline}</p>
                </div>
            );

        case 'about':
            return (
                <div className="flex flex-col gap-5">
                    <p className="text-white/70 text-sm">{about.summary}</p>
                    <div>
                        <p className="label">Education</p>
                        {about.education.map((e) => (
                            <div key={e.title} className="text-sm text-white/70 mt-1">
                                <span className="text-holo">{e.title}</span> — {e.place}{' '}
                                <span className="text-white/40 font-mono text-xs">({e.year})</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className="label">Career Timeline</p>
                        <div className="mt-2 flex flex-col gap-2 border-l border-ion/30 pl-4">
                            {about.timeline.map((t) => (
                                <div key={t.year} className="relative">
                                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-ion" />
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
                            <p className="label">{label}</p>
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
                            className="text-left glass-panel rounded-lg px-4 py-3 hover:border-ion/50 transition-colors"
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
                        <div key={d.id} className="glass-panel rounded-lg px-4 py-3">
                            <p className="text-holo font-semibold">{d.title}</p>
                            {d.prototypeUrl && (
                                <a href={d.prototypeUrl} target="_blank" rel="noreferrer" className="text-ion text-xs font-mono underline">
                                    Open Prototype
                                </a>
                            )}
                        </div>
                    )}
                />
            );

        case 'certificates':
            return (
                <EmptyOrList
                    items={certificates}
                    render={(c) => (
                        <div key={c.id} className="glass-panel rounded-lg px-4 py-3">
                            <p className="text-holo font-semibold">{c.title}</p>
                            <p className="text-white/50 text-xs">
                                {c.organization} · {c.issueDate}
                            </p>
                            {c.credentialUrl && (
                                <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-ion text-xs font-mono underline">
                                    View Credential
                                </a>
                            )}
                        </div>
                    )}
                />
            );

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
