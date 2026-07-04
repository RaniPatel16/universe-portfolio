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

  travelTo: (planetId) => {
    const { activePlanetId, isTraveling } = get();
    if (isTraveling || planetId === activePlanetId) return;
    const exists = PLANETS.find((p) => p.id === planetId);
    if (!exists) return;
    set({ targetPlanetId: planetId, isTraveling: true });
  },

  arriveAtPlanet: () =>
    set((state) => ({
      activePlanetId: state.targetPlanetId,
      isTraveling: false,
    })),

  soundOn: true,
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
}));
