// ---------------------------------------------------------------------------
// PLACEHOLDER CONTENT — replace every value in this file with your real data.
// Nothing here is fetched from a live API; it's all static, hand-edited data.
// ---------------------------------------------------------------------------

export const profile = {
  name: 'Rani Patel',
  title: 'Full Stack Developer',
  tagline: 'I build things that live on the internet — and occasionally in orbit.',
  photo: '/assets/rani_patel_profile.jpg',
  resumeUrl: '/assets/resume-placeholder.pdf', // TODO: replace with real resume PDF
  social: {
    github: 'https://github.com/your-username',
    linkedin: 'https://linkedin.com/in/your-username',
    leetcode: 'https://leetcode.com/your-username',
    twitter: 'https://twitter.com/your-username',
    youtube: 'https://youtube.com/@your-channel',
    instagram: 'https://instagram.com/your-username',
    email: 'mailto:you@example.com',
  },
};

export const about = {
  summary:
    'Full stack developer focused on building fast, accessible, and delightful web experiences. Comfortable across the stack — from crafting pixel-perfect interfaces in React to designing APIs and databases that scale.',
  education: [
    { year: '2022 — 2026', title: 'B.Tech, Computer Science', place: 'Your University' },
  ],
  timeline: [
    { year: '2023', label: 'Started learning full stack development' },
    { year: '2024', label: 'First internship — Frontend Engineering' },
    { year: '2025', label: 'Shipped production full-stack applications' },
    { year: '2026', label: 'Open to new opportunities' },
  ],
};

export const skills = {
  frontend: [
    { name: 'React', level: 90 },
    { name: 'JavaScript', level: 88 },
    { name: 'Tailwind CSS', level: 85 },
    { name: 'Three.js', level: 70 },
  ],
  backend: [
    { name: 'Node.js', level: 82 },
    { name: 'Express', level: 80 },
    { name: 'REST APIs', level: 85 },
  ],
  database: [
    { name: 'MongoDB', level: 78 },
    { name: 'MySQL', level: 72 },
  ],
  tools: [
    { name: 'Git & GitHub', level: 88 },
    { name: 'Figma', level: 75 },
    { name: 'Postman', level: 80 },
  ],
  soft: [
    { name: 'Communication', level: 85 },
    { name: 'Problem Solving', level: 90 },
    { name: 'Teamwork', level: 85 },
  ],
};

export const projects = [
  {
    id: 'ruralrich',
    title: 'RuralReach (Rupiya App)',
    category: 'Logistics Platform',
    description: 'RuralReach is a full-stack MERN logistics platform designed to transform rural delivery into a viable, community-driven ecosystem.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
    features: ['Artisan storefronts', 'Order tracking', 'Secure payments', 'Community logistics routes'],
    github: 'https://github.com/RaniPatel16/ruralRich',
    live: 'https://ruralreach-frontend.onrender.com/',
    youtube: 'https://www.youtube.com/watch?v=wblTGqGLQ8c&t=15s',
    postman: 'https://documenter.getpostman.com/view/example',
    figma: '',
    screenshots: [],
  },
  {
    id: 'meta-glasses-reviews',
    title: 'Meta Glasses Reviews',
    category: 'Full-Stack Management System',
    description: 'Meta Glasses Reviews is a comprehensive full-stack backend platform designed to collect, manage, and audit reviews for smart eyewear.',
    tech: ['Node.js', 'Express', 'MongoDB', 'Postman', 'JWT'],
    features: ['MVC Architecture', 'JWT Authentication', 'Aggregation Pipelines', 'API documentation auditing'],
    github: 'https://github.com/RaniPatel16/meta_glasses_reviews_rani_patel',
    live: 'https://meta-glasses-reviews-rani-patel.vercel.app/',
    youtube: 'https://www.youtube.com/@RaniPatel-l2o',
    postman: 'https://documenter.getpostman.com/view/example2',
    figma: '',
    screenshots: [],
  },
  {
    id: 'bbc-clone',
    title: 'BBC Website Clone',
    category: 'Frontend Clone',
    description: 'A pixel-perfect responsive clone of the BBC news website demonstrating complex layouts, navigation, and visual hierarchy.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    features: ['Grid & Flexbox Layouts', 'Responsive Navigation', 'Dynamic News Feeds'],
    github: 'https://github.com/RaniPatel16/fullwebsite',
    live: 'https://bbc-website-clone.vercel.app',
    youtube: 'https://www.youtube.com/watch?v=t-UYdnEztRA',
    postman: '',
    figma: '',
    screenshots: [],
  },
  {
    id: 'bigbasket-clone',
    title: 'BigBasket Clone',
    category: 'E-Commerce Frontend',
    description: 'A frontend clone of the popular online grocery store BigBasket featuring product catalogs and card matrices.',
    tech: ['React', 'Tailwind CSS', 'Framer Motion'],
    features: ['Product Catalog', 'Interactive Cart', 'Filter & Sorting matrices'],
    github: 'https://github.com/RaniPatel16/portfolio',
    live: 'https://bigbasket-clone.vercel.app',
    youtube: 'https://www.youtube.com/watch?v=zHx1Xmdqec8',
    postman: '',
    figma: '',
    screenshots: [],
  },
  {
    id: 'electric-hammer',
    title: 'Electric Hammer Website',
    category: 'Product Promo Frontend',
    description: 'Interactive promotional website for electric tools/products displaying rich layouts and card sliders.',
    tech: ['React', 'Three.js', 'Vite', 'Vanilla CSS'],
    features: ['3D Product Viewer', 'Rich Slider Layouts', 'Interactive Spec Sheet'],
    github: 'https://github.com/RaniPatel16/ed-learning',
    live: 'https://electric-hammer.vercel.app',
    youtube: 'https://www.youtube.com/watch?v=eZhPrYYkNoc',
    postman: '',
    figma: '',
    screenshots: [],
  },
  {
    id: 'porter-courier',
    title: 'Porter Courier Web Prototype',
    category: 'Logistic Frontend Concept',
    description: 'User portal concept for managing express parcel distribution and cargo scheduling.',
    tech: ['React', 'Tailwind CSS', 'Framer Motion'],
    features: ['Courier Dashboard', 'Cargo Booking System', 'Responsive Scheduler'],
    github: 'https://github.com/RaniPatel16/github-portfolio-analyzer-GEC-1',
    live: 'https://porter-courier.vercel.app',
    youtube: 'https://www.youtube.com/watch?v=lEPRguq0zVA&t=58s',
    postman: '',
    figma: '',
    screenshots: [],
  },
  {
    id: 'kore-ai',
    title: 'Kore.AI Air Website',
    category: 'AI Assistant Interface',
    description: 'Promo page and terminal simulation landing website inspired by Kore.AI assistant platform.',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'SpeechSynthesis'],
    features: ['Terminal Simulation', 'Interactive AI chat interface', 'Responsive Hero layouts'],
    github: 'https://github.com/RaniPatel16/ai-chatbott',
    live: 'https://kore-ai-air.vercel.app',
    youtube: 'https://www.youtube.com/watch?v=gnWBCmkPF44&t=27s',
    postman: '',
    figma: '',
    screenshots: [],
  },
  {
    id: 'click-counter',
    title: 'Interactive Click Counter Game',
    category: 'Vanilla Game Dev',
    description: 'A simple and interactive Click Counter Game built to demonstrate core JavaScript concepts like event listeners, DOM manipulation, and state management.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    features: ['Real-time State Updates', 'DOM Event Listeners', 'Futuristic Sound Effects'],
    github: 'https://github.com/RaniPatel16/assignment1',
    live: 'https://click-counter.vercel.app',
    youtube: 'https://www.youtube.com/watch?v=-_RKagaQiU4',
    postman: '',
    figma: '',
    screenshots: [],
  },
];

export const figmaDesigns = [
  {
    id: 'figma-ruralrich',
    title: 'RuralRich — Login & Signup UI (Community)',
    description: 'Custom login and signup page UI designs for the RuralRich community platform.',
    prototypeUrl: 'https://www.figma.com/proto/jxdjf4Gy8GGIGlDkfCaAZi/Custom-Login-page-and-Signup-page-UI--Community-?node-id=0-1',
  },
  {
    id: 'figma-redzo',
    title: 'Redzo — CV Resume (Community)',
    description: 'Clean modern layout concept for CV / Resume designs.',
    prototypeUrl: 'https://www.figma.com/design/9XnnHINYuQi5CfOGUBeDhv/CV-Resume--Community-?node-id=0-1&p=f&t=vVlMMjJiFauaHQcA-0',
  },
  {
    id: 'figma-logos-login',
    title: 'Custom Logos & Login Page UI',
    description: 'Assorted branding logos and access portal components.',
    prototypeUrl: 'https://www.figma.com/design/XpHJpZNHkaxgFXvX5cDe57/Untitled?t=vVlMMjJiFauaHQcA-0',
  },
  {
    id: 'figma-shopping',
    title: 'Shopping Mall Web UI (Community)',
    description: 'E-Commerce storefront designs and interactive layouts.',
    prototypeUrl: 'https://www.figma.com/design/YZ22MiqcIaTf6iiotB62JW/shopping-mall--Community-?t=vVlMMjJiFauaHQcA-0',
  },
  {
    id: 'figma-dashboard',
    title: 'CRM Dashboard View (Community)',
    description: 'Executive telemetry dashboard containing analytics matrices.',
    prototypeUrl: 'https://www.figma.com/design/2wznSqbVXidQrBrHfdlcvv/CRM-dashboard-view--Community-?t=vVlMMjJiFauaHQcA-0',
  },
  {
    id: 'figma-address',
    title: 'MHD Address Flow dev (Community)',
    description: 'Interactive address configuration flow for logistics.',
    prototypeUrl: 'https://www.figma.com/design/sDZVep4lYUOC7QUuqQgmM5/MHD-address-flow--dev---Community-?t=vVlMMjJiFauaHQcA-0',
  },
];

export const certificates = [
  {
    id: 'cert-1',
    title: 'GirlScript Summer of Code — Contributor',
    organization: 'GirlScript Foundation',
    issueDate: '2025',
    credentialUrl: '',
    image: '',
  },
  {
    id: 'cert-2',
    title: 'Full Stack Web Development',
    organization: 'Your Certification Provider',
    issueDate: '2025',
    credentialUrl: '',
    image: '',
  },
];

export const hackathons = [
  {
    id: 'hack-1',
    name: 'Smart India Hackathon',
    problemStatement: 'Bridging rural artisans with e-commerce markets.',
    solution: 'Built RuralRich, a direct-to-buyer marketplace platform.',
    outcome: 'Finalist',
    demoVideo: '',
    github: 'https://github.com/your-username/ruralrich',
    photos: [],
  },
];

export const achievements = {
  leetcode: { solved: 80, label: '80+ LeetCode Problems' },
  certifications: { count: 25, label: '25+ Certifications' },
  programs: ['GirlScript Summer of Code'],
  milestones: [
    { label: 'LeetCode Problems Solved', value: 80 },
    { label: 'Certifications Earned', value: 25 },
    { label: 'Hackathons Participated', value: 3 },
    { label: 'Projects Shipped', value: 8 },
  ],
};

export const missionControl = {
  githubUsername: 'your-username',
  leetcodeUsername: 'your-username',
};
