import { create } from 'zustand';
import { PLANETS } from '../lib/navigation';
import { certificates, hackathons } from '../data/portfolioData';

const TRAVEL_DIALOGUES = [
  "Warp drive engaged.",
  "Calculating trajectory.",
  "Entering hyperspace.",
  "Approaching destination.",
  "Landing sequence initiated.",
  "Systems operating normally.",
  "Navigation complete.",
  "Preparing for arrival.",
  "Course correction complete.",
  "Gravity stabilizers active.",
  "Entering planetary orbit."
];

const PLANET_ENTER_DIALOGUES = {
  launchpad: "Welcome to Launch Pad.",
  about: "Developer Planet.",
  skills: "Skills Planet.",
  projects: "Projects Planet.",
  figma: "Figma Design.",
  certificates: "Knowledge Core.",
  hackathons: "Hackathon Arena.",
  achievements: "Achievement Planet.",
  resume: "Resume Vault.",
  contact: "Communication Station.",
  social: "Social Network Hub."
};

// Pick the best sweet female voice available in the browser
function pickFemaleVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();

  // Priority list: softer, natural female voices
  const priorities = [
    'google uk english female',
    'samantha',
    'karen',
    'moira',
    'tessa',
    'veena',
    'zira',
    'amy',
    'hazel',
    'google us english',
  ];

  for (const keyword of priorities) {
    const match = voices.find(
      (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes(keyword)
    );
    if (match) return match;
  }

  // Fallback: any English female-sounding voice
  return (
    voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null
  );
}

export const useUniverseStore = create((set, get) => ({
  // 'loading' -> 'intro' -> 'journey'
  phase: 'loading',
  setPhase: (phase) => set({ phase }),

  // id of the planet the ship is currently parked at / traveling to
  activePlanetId: 'launchpad',
  targetPlanetId: 'launchpad',
  isTraveling: false,

  // whether the detail panel for the active planet is expanded
  panelOpen: true,
  setPanelOpen: (panelOpen) => set({ panelOpen }),

  // active project id for the project detail modal
  activeProjectId: null,
  openProject: (id) => {
    set({ activeProjectId: id });
    if (id) {
      get().triggerInteractionSpeech('open_project', 'Project loaded.');
    }
  },
  closeProject: () => set({ activeProjectId: null }),

  // active certificate url for the full preview image modal
  activeCertificateModalUrl: null,
  openCertificateModal: (url) => set({ activeCertificateModalUrl: url }),
  closeCertificateModal: () => set({ activeCertificateModalUrl: null }),

  // Certificates / Knowledge Core State
  certificatesScanning: false,
  certificatesScanned: false,
  certificatesExplored: [],
  focusedCertificateId: null,
  focusedCertificatePosition: null,

  setFocusedCertificate: (id, pos) => {
    set({ focusedCertificateId: id, focusedCertificatePosition: pos });
    if (id) {
      get().triggerInteractionSpeech('open_certificate', 'Certification verified.');
    }
  },

  exploreCertificate: (id) => set((state) => {
    if (state.certificatesExplored.includes(id)) return {};
    const nextExplored = [...state.certificatesExplored, id];
    if (nextExplored.length === certificates.length && certificates.length > 0) {
      setTimeout(() => {
        get().triggerInteractionSpeech('complete_certificates', 'Archive complete.');
      }, 1500);
    }
    return { certificatesExplored: nextExplored };
  }),

  startCertificatesScan: () => set({ certificatesScanning: true, certificatesScanned: false }),
  finishCertificatesScan: () => set({ certificatesScanning: false, certificatesScanned: true }),

  // Hackathons Arena State
  hackathonsScanning: false,
  hackathonsScanned: false,
  hackathonsExplored: [],
  focusedBoothId: null,
  focusedBoothPosition: null,
  focusedPhotoPosition: null,
  activePhotoId: null,
  activeTabId: 'demo',

  setFocusedBooth: (id, pos) => {
    set({
      focusedBoothId: id,
      focusedBoothPosition: pos,
      activePhotoId: null,
      focusedPhotoPosition: null
    });
    if (id) {
      get().triggerInteractionSpeech('open_hackathon_booth', 'Hackathon record loaded.');
    }
  },

  setActivePhoto: (id, pos) => {
    set({ activePhotoId: id, focusedPhotoPosition: pos });
    if (id) {
      get().triggerInteractionSpeech('open_mission_gallery', 'Gallery opened.');
    }
  },
  setActiveTab: (tabId) => set({ activeTabId: tabId }),

  exploreBooth: (id) => set((state) => {
    if (state.hackathonsExplored.includes(id)) return {};
    const nextExplored = [...state.hackathonsExplored, id];
    if (nextExplored.length === hackathons.length && hackathons.length > 0) {
      setTimeout(() => {
        get().triggerInteractionSpeech('complete_hackathons', 'Arena fully explored.');
      }, 1500);
    }
    return { hackathonsExplored: nextExplored };
  }),

  startHackathonsScan: () => set({ hackathonsScanning: true, hackathonsScanned: false }),
  finishHackathonsScan: () => set({ hackathonsScanning: false, hackathonsScanned: true }),

  // NOVA Voice Assistant State
  novaMuted: localStorage.getItem('novaMuted') === 'true',
  novaSpeaking: false,
  novaSubtitle: null,
  visitedPlanets: [],
  playedLines: [],
  missionCompleteAnnounced: false,
  showMissionComplete: false,

  // All planets are unlocked — no progression gating
  unlockedPlanets: PLANETS.map((p) => p.id),

  setNovaMuted: (muted) => {
    localStorage.setItem('novaMuted', muted ? 'true' : 'false');
    set({ novaMuted: muted });
    if (muted) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      set({ novaSpeaking: false, novaSubtitle: null });
    } else {
      setTimeout(() => get().speakNova("NOVA active."), 200);
    }
  },

  speakNova: (text) => {
    if (typeof window === 'undefined') return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (get()._subtitleTimeout) {
      clearTimeout(get()._subtitleTimeout);
    }

    set({ novaSubtitle: text, novaSpeaking: true });

    if (get().novaMuted) {
      // Show subtitle even when muted, just no audio
      const readingDuration = Math.max(2000, text.length * 55 + 800);
      const timer = setTimeout(() => {
        set({ novaSpeaking: false, novaSubtitle: null });
      }, readingDuration);
      set({ _subtitleTimeout: timer });
      return;
    }

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickFemaleVoice();
      if (voice) utterance.voice = voice;

      // Sweet, smooth, slightly slower and higher pitched
      utterance.rate = 0.82;   // slower = softer feel
      utterance.pitch = 1.15;  // higher = sweeter girl voice
      utterance.volume = 1.0;

      utterance.onend = () => set({ novaSpeaking: false, novaSubtitle: null });
      utterance.onerror = () => set({ novaSpeaking: false, novaSubtitle: null });

      window.speechSynthesis.speak(utterance);
    };

    // Voices may not be loaded yet on first call — wait if needed
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
    } else {
      doSpeak();
    }
  },

  triggerInteractionSpeech: (key, text) => {
    const { playedLines } = get();
    if (playedLines.includes(key)) return;
    set({ playedLines: [...playedLines, key] });
    get().speakNova(text);
  },

  travelTo: (planetId) => {
    const { activePlanetId, isTraveling, unlockedPlanets } = get();
    if (isTraveling || planetId === activePlanetId) return;

    // Locked planet — silent block (no announcement, just don't travel)
    if (!unlockedPlanets.includes(planetId)) return;

    const exists = PLANETS.find((p) => p.id === planetId);
    if (!exists) return;

    set({
      targetPlanetId: planetId,
      isTraveling: true,
      focusedCertificateId: null,
      focusedCertificatePosition: null,
      focusedBoothId: null,
      focusedBoothPosition: null,
      focusedPhotoPosition: null,
      activePhotoId: null,
      activeTabId: 'demo'
    });

    const randomDialog = TRAVEL_DIALOGUES[Math.floor(Math.random() * TRAVEL_DIALOGUES.length)];
    get().speakNova(randomDialog);
  },

  arriveAtPlanet: () => {
    const target = get().targetPlanetId;
    set({ activePlanetId: target, isTraveling: false });

    if (target === 'certificates' && !get().certificatesScanned && !get().certificatesScanning) {
      get().startCertificatesScan();
    }
    if (target === 'hackathons' && !get().hackathonsScanned && !get().hackathonsScanning) {
      get().startHackathonsScan();
    }

    // Auto unlock — not needed, all unlocked from start

    // Track visited planets & trigger mission complete after Social planet
    set((state) => {
      const nextVisited = state.visitedPlanets.includes(target)
        ? state.visitedPlanets
        : [...state.visitedPlanets, target];

      // If the Social planet is just visited, show mission complete overlay
      if (target === 'social' && !state.missionCompleteAnnounced) {
        setTimeout(() => {
          get().speakNova("Social sector explored. Mission complete.");
        }, 3000);
        setTimeout(() => {
          set({ showMissionComplete: true });
        }, 5000);
        return { visitedPlanets: nextVisited, missionCompleteAnnounced: true };
      }
      return { visitedPlanets: nextVisited };
    });

    // Announce the planet name
    const text = PLANET_ENTER_DIALOGUES[target];
    if (text) {
      setTimeout(() => get().speakNova(text), 800);
    }
  },

  soundOn: true,
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),

  // Restart the entire journey from scratch
  restartJourney: () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    set({
      activePlanetId: 'launchpad',
      targetPlanetId: 'launchpad',
      isTraveling: false,
      panelOpen: true,
      visitedPlanets: [],
      playedLines: [],
      missionCompleteAnnounced: false,
      showMissionComplete: false,
      novaSpeaking: false,
      novaSubtitle: null,
      focusedCertificateId: null,
      focusedCertificatePosition: null,
      certificatesScanning: false,
      certificatesScanned: false,
      certificatesExplored: [],
      hackathonsScanning: false,
      hackathonsScanned: false,
      hackathonsExplored: [],
      focusedBoothId: null,
      focusedBoothPosition: null,
      activePhotoId: null,
      activeTabId: 'demo',
    });
    setTimeout(() => get().speakNova("New mission initiated. Welcome back, Commander."), 600);
  },
}));
