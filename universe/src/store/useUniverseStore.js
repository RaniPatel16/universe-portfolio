import { create } from 'zustand';
import { PLANETS } from '../lib/navigation';

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
  openProject: (id) => set({ activeProjectId: id }),
  closeProject: () => set({ activeProjectId: null }),

  // active certificate url for the full preview image modal
  activeCertificateModalUrl: null,
  openCertificateModal: (url) => set({ activeCertificateModalUrl: url }),
  closeCertificateModal: () => set({ activeCertificateModalUrl: null }),

  // Certificates / Knowledge Core State
  certificatesScanning: false,
  certificatesScanned: false,
  certificatesExplored: [], // Array of visited certificate IDs
  focusedCertificateId: null,
  focusedCertificatePosition: null, // [x, y, z] or null

  setFocusedCertificate: (id, pos) => set({
    focusedCertificateId: id,
    focusedCertificatePosition: pos
  }),

  exploreCertificate: (id) => set((state) => {
    if (state.certificatesExplored.includes(id)) return {};
    return {
      certificatesExplored: [...state.certificatesExplored, id]
    };
  }),

  startCertificatesScan: () => set({
    certificatesScanning: true,
    certificatesScanned: false
  }),

  finishCertificatesScan: () => set({
    certificatesScanning: false,
    certificatesScanned: true
  }),

  travelTo: (planetId) => {
    const { activePlanetId, isTraveling } = get();
    if (isTraveling || planetId === activePlanetId) return;
    const exists = PLANETS.find((p) => p.id === planetId);
    if (!exists) return;

    // Reset individual page focus targets when leaving
    set({
      targetPlanetId: planetId,
      isTraveling: true,
      focusedCertificateId: null,
      focusedCertificatePosition: null
    });
  },

  arriveAtPlanet: () => {
    const target = get().targetPlanetId;
    set((state) => ({
      activePlanetId: target,
      isTraveling: false,
    }));

    // Automatically trigger scanning if we arrive at certificates for the first time
    if (target === 'certificates' && !get().certificatesScanned && !get().certificatesScanning) {
      get().startCertificatesScan();
    }
  },

  soundOn: true,
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
}));
