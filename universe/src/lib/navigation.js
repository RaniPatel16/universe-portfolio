// Defines every stop ("planet") on the journey: its position in the 3D
// universe, its visual identity, and whether it has a fully-built scene
// or is running on the generic placeholder template.
//
// Positions are spaced along a slow outward spiral so the spaceship's
// flight path always has a clear "next destination" direction.

export const PLANETS = [
  {
    id: 'launchpad',
    order: 0,
    label: 'Launch Pad',
    subtitle: 'Welcome',
    position: [0, 0, 0],
    color: '#35F0D0',
    radius: 3.2,
    hasRing: false,
    built: true,
  },
  {
    id: 'about',
    order: 1,
    label: 'Developer Planet',
    subtitle: 'About Me',
    position: [42, 3, -18],
    color: '#7C5CFF',
    radius: 4,
    hasRing: false,
    built: true,
  },
  {
    id: 'skills',
    order: 2,
    label: 'Skills Planet',
    subtitle: 'Abilities',
    position: [86, -4, -6],
    color: '#FFB454',
    radius: 4.6,
    hasRing: true,
    built: true,
  },
  {
    id: 'projects',
    order: 3,
    label: 'Projects Planet',
    subtitle: 'Cyber City',
    position: [132, 2, 20],
    color: '#FF5C7A',
    radius: 6,
    hasRing: false,
    built: true,
  },
  {
    id: 'figma',
    order: 4,
    label: 'Figma Design Planet',
    subtitle: 'Design Gallery',
    position: [176, -6, 42],
    color: '#35F0D0',
    radius: 3.6,
    hasRing: true,
    built: false,
  },
  {
    id: 'certificates',
    order: 5,
    label: 'Certificates Planet',
    subtitle: 'Credentials',
    position: [220, 5, 20],
    color: '#7C5CFF',
    radius: 3.8,
    hasRing: false,
    built: false,
  },
  {
    id: 'hackathons',
    order: 6,
    label: 'Hackathon Planet',
    subtitle: 'The Arena',
    position: [258, -3, -8],
    color: '#FFB454',
    radius: 4.2,
    hasRing: false,
    built: false,
  },
  {
    id: 'achievements',
    order: 7,
    label: 'Achievement Planet',
    subtitle: 'Golden City',
    position: [296, 4, -36],
    color: '#FFD700',
    radius: 4.4,
    hasRing: true,
    built: false,
  },
  {
    id: 'missioncontrol',
    order: 8,
    label: 'Mission Control',
    subtitle: 'Hidden Sector',
    position: [332, -8, -12],
    color: '#35F0D0',
    radius: 5,
    hasRing: false,
    built: false,
  },
  {
    id: 'resume',
    order: 9,
    label: 'Resume Planet',
    subtitle: 'Archive',
    position: [368, 6, 16],
    color: '#EAF6FF',
    radius: 3.4,
    hasRing: false,
    built: false,
  },
  {
    id: 'contact',
    order: 10,
    label: 'Communication Planet',
    subtitle: 'Satellite Station',
    position: [404, -2, 38],
    color: '#7C5CFF',
    radius: 3.8,
    hasRing: false,
    built: false,
  },
  {
    id: 'social',
    order: 11,
    label: 'Social Planet',
    subtitle: 'Signal Array',
    position: [440, 3, 10],
    color: '#FF5C7A',
    radius: 3.2,
    hasRing: false,
    built: false,
  },
];

export const getPlanet = (id) => PLANETS.find((p) => p.id === id);
export const getNextPlanet = (id) => {
  const idx = PLANETS.findIndex((p) => p.id === id);
  return PLANETS[idx + 1] ?? null;
};
export const getPrevPlanet = (id) => {
  const idx = PLANETS.findIndex((p) => p.id === id);
  return PLANETS[idx - 1] ?? null;
};

// Camera sits slightly back and above the ship, which itself parks a
// fixed offset in front of whichever planet is active.
export const CAMERA_OFFSET = [0, 4, 14];
export const SHIP_OFFSET = [0, -1, 9];
