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

  // Mission system states
  unlockedPlanetIds: ['launchpad'],
  visitedPlanetIds: [],
  missionComplete: false,

  travelTo: (planetId) => {
    const { activePlanetId, isTraveling, unlockedPlanetIds } = get();
    if (isTraveling || planetId === activePlanetId) return;
    const exists = PLANETS.find((p) => p.id === planetId);
    if (!exists) return;
    // Block traveling if not unlocked
    if (!unlockedPlanetIds.includes(planetId)) return;
    set({ targetPlanetId: planetId, isTraveling: true });
  },

  arriveAtPlanet: () => {
    const { targetPlanetId, unlockedPlanetIds, visitedPlanetIds } = get();
    const newVisited = visitedPlanetIds.includes(targetPlanetId)
      ? visitedPlanetIds
      : [...visitedPlanetIds, targetPlanetId];

    const currentIdx = PLANETS.findIndex((p) => p.id === targetPlanetId);
    let newUnlockedIds = [...unlockedPlanetIds];
    const nextPlanet = PLANETS[currentIdx + 1];
    if (nextPlanet && !newUnlockedIds.includes(nextPlanet.id)) {
      newUnlockedIds.push(nextPlanet.id);
    }

    const isLast = currentIdx === PLANETS.length - 1;

    set({
      activePlanetId: targetPlanetId,
      isTraveling: false,
      unlockedPlanetIds: newUnlockedIds,
      visitedPlanetIds: newVisited,
      missionComplete: isLast,
    });
  },

  resetMission: () => {
    set({
      activePlanetId: 'launchpad',
      targetPlanetId: 'launchpad',
      isTraveling: false,
      unlockedPlanetIds: ['launchpad'],
      visitedPlanetIds: [],
      missionComplete: false,
    });
  },

  soundOn: true,
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
}));
