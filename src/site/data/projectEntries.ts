export interface ProjectEntry {
  id: string;
  title: string;
  technologies: string[];
  /** Full lead copy — expanded view (and fallback if no summary) */
  description: string;
  /** One-line preview on grid cards */
  summary?: string;
  /** Category chip (e.g. OpenClaw, Frontend) — expanded + grid */
  roleTag?: string;
  /** e.g. "2026 • React, …" — expanded view only */
  metaLine?: string;
  /** Shown only in expanded view — stack, scope, or feature summary */
  details?: string;
  /** Bullet list — expanded view only */
  highlights?: string[];
  cover?: string;
  media?: string;
  /** youtu.be/… or youtube.com/watch?v=… — embedded in the card */
  youtubeUrl?: string;
  autoplayVideo?: boolean;
  link?: string;
  github?: string;
  /** Extra paragraph, expanded view only */
  detailText?: string;
}

export const PROJECTS: ProjectEntry[] = [
  {
    id: 'countertop',
    title: 'Countertop',
    roleTag: 'macOS',
    technologies: ['Swift', 'SwiftUI', 'AppKit', 'App Sandbox', 'Sparkle'],
    summary: 'A quiet menu bar app that puts your downloads away.',
    metaLine: '2026 • Swift, SwiftUI, App Sandbox, Sparkle',
    cover: '/projects/countertop/hero.png',
    link: 'https://github.com/kumarannathan/Countertop/releases/latest',
    github: 'https://github.com/kumarannathan/Countertop',
    description:
      'Your Downloads folder fills up like a kitchen counter. Countertop clears it for you: when a download finishes, it moves the file into a folder that matches what it is — images to Images, installers to Applications, .fbx models to 3D. You never open it. Download something, and a moment later it is sorted.',
    highlights: [
      'Waits for the download to finish: partial files from Chrome (.crdownload), Safari (.download) and Firefox (.part) are left alone until they are complete.',
      'Never overwrites: if photo.jpg is already there the new file becomes photo 2.jpg, and anything that cannot be moved stays in Downloads with a reason.',
      'Your rules first: sorting checks your rules, then your categories, then the built-in ones, then what macOS knows about the file type. send .blend to Blender Assets, .rbxl to Roblox, anything named Screenshot to Screenshots.',
      'Undo: every move is listed in Activity with Show in Finder and Put Back.',
      'Private by construction: it runs in the App Sandbox with no network access, so it can only see Downloads and the folders you pick. no account, no analytics, no server.',
      'Updates: Sparkle checks the repo once a day in its own sandboxed downloader and verifies each build with an EdDSA signature before installing.'
    ],
    detailText:
      'Free and open source, macOS 15 or later, Apple silicon and Intel. it is not notarized — that needs a paid developer membership — so the first launch takes a trip through System Settings, and the readme walks through it.'
  },
  {
    id: 'toshi',
    title: 'Toshi',
    roleTag: 'Full Stack',
    technologies: ['React 19', 'TypeScript', 'Vite', 'visx', 'Firebase', 'Cloud Functions', 'Gemini'],
    summary: 'Paste a dealer quote and see what the car actually costs before you sign.',
    metaLine: '2026 • React 19, TypeScript, Vite, visx, Firebase, Gemini',
    cover: '/projects/toshi/cover.jpg',
    media: '/projects/toshi/walkthrough.mp4',
    description:
      'Dealers sell you a monthly payment. Toshi starts from the same quote and rebuilds the full picture — selling price, fees, add-ons, APR or money factor, then insurance, fuel and upkeep — so you can compare offers on the number that actually matters.',
    highlights: [
      'The problem: a worksheet spreads the real cost across selling price, doc fee, protection package, APR and term. the payment is the only line designed to look friendly. insurance and fuel never show up at all.',
      'One deal schema: everything in the app — finance, lease, score, ownership tools — reads the same structured deal. paste a listing, a pdf, a screenshot or a window sticker and the parser (rules first, gemini second) fills what it can and leaves nulls instead of inventing numbers.',
      'Show your work: every figure keeps a source and a confidence. amortization and lease math (gross cap, depreciation, rent charge, residual) are printable step by step. estimates stay labelled as estimates.',
      'A score you can push back on: price vs msrp, apr vs market, term, doc fee, add-ons and payment-to-income each get a rating and a reason. long loans and dealer markup get called out in plain language.',
      'Beyond the payment: true monthly cost and five-year ownership fold interest, insurance, fuel and upkeep into the same BRZ sample deal, so "$568/mo" stops looking like the whole story.',
      'iPhone next: the mobile app is built around scanning a window sticker or worksheet at the lot and comparing offers on five-year cost — same deal model, smaller screen.'
    ],
    detailText:
      'I used one sample deal the whole way through (a 2026 Subaru BRZ tS at $34,990, $499 doc fee, $399 protection, 5.90% APR over 72 months) so every tool had to agree. when the gemini call flakes, it retries once and falls over to a backup model — a paste should not die on a 503.'
  },
  {
    id: 'milo-mission-control',
    title: 'Milo — Mission Control',
    roleTag: 'OpenClaw',
    technologies: ['React', 'Netlify Functions', 'Supabase', 'Python', 'Ollama', 'RapidAPI'],
    summary:
      'Run a fleet of specialized AI agents from one Mission Control dashboard—live status, shared memory, and a task bus you can actually watch.',
    metaLine: '2026 • React, Netlify Functions, Supabase, Python, Ollama, RapidAPI',
    description:
      'Run a fleet of specialized AI agents from one Mission Control dashboard—live status, shared memory, and a task bus you can actually watch instead of guessing what your bots are doing. I wired end-to-end pipelines from research and drafts through publish and social, with Milo orchestrating handoffs across agents in production. The whole stack is serverless APIs plus Supabase-backed state, tuned so cheap local inference (Ollama) keeps monthly costs trivial until you need to scale.',
    highlights: [
      'Built a multi-agent architecture orchestrated via shared task queues and memory (Supabase)',
      'Designed a Mission Control UI (React) to visualize agent status, activity feeds, and pipelines in real time',
      'Implemented a serverless backend (Netlify Functions) for agent communication, logging, and coordination',
      'Optimized for low-cost local inference (Ollama) with ~$1.50/month API usage (option to scale with paid models)',
      'Trade Bot: Tracks Polymarket activity and auto-researches positions/trends',
      'Competitor Intelligence Bot: Monitors tweets, news, and trends based on brand configs using RapidAPI + Clawdbot',
      'Content Pipeline Agents: End-to-end automation (research → draft → optimize → publish) across multiple specialized bots',
      'Orchestrator (Milo): Manages task scheduling, agent coordination, and pipeline execution via shared agent_tasks'
    ],
    media: '/milo.mp4',
    autoplayVideo: true
  },
  {
    id: 'neetcode-redesign',
    title: 'NeetCode Redesign',
    roleTag: 'Frontend',
    technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'GSAP'],
    summary:
      'Built a full NeetCode-inspired redesign with a modern dark aesthetic to make interview prep feel like a polished product.',
    metaLine: '2026 • Next.js 16, React 19, TypeScript, Tailwind CSS v4, GSAP',
    description:
      'Built a full NeetCode-inspired redesign with a modern dark aesthetic to make interview prep feel like a polished product rather than a static content site. Shipped for an X competition with animated landing experiences, state-driven dashboard navigation, and reusable interaction systems across key prep flows.',
    highlights: [
      'Built an animated landing with rotating insight cards, structured course explorer, roadmap section, and interactive resources blocks',
      'Developed a rich dashboard prototype with in-page sections (Home, Coding Interviews, Problems, Company Tagged, System Design, Roadmap)',
      'Implemented reusable UI systems (cards, chips, counters, hover/focus transitions, responsive sidebar behavior, reduced-motion-safe polish)',
      'Integrated route flow end-to-end (/sign-in → fake auth → /dashboard) and resolved production TypeScript/build blockers'
    ],
    media: '/neetcode.mp4',
    autoplayVideo: true,
    link: 'https://neatcoded.netlify.app/',
    github: 'https://github.com/kumarannathan/Neetcode.git'
  },
  {
    id: 'sipt',
    title: 'Sipt',
    roleTag: 'Mobile',
    technologies: ['React', 'React Native', 'TypeScript', 'mobile development'],
    summary: 'Letterboxd for specialty coffee—social discovery, taste identity, and community around how you rate brews.',
    metaLine: '2026 • React, React Native, TypeScript, mobile development',
    description:
      'Letterboxd for specialty coffee. Existing coffee loggers help you track brews privately, but they stop short of discovery, taste identity, and community. Sipt adds the social layer: log coffees with a 3-axis rating across Enjoyment, Balance, and Clarity, follow people whose taste you trust, and build a profile that actually says something about what you like.',
    media: '/videos/coffee.mp4',
    autoplayVideo: true
  },
  {
    id: 'booking-platform',
    title: 'Startup Booking Platform',
    roleTag: 'Frontend',
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'JWT'],
    summary:
      'Full-stack booking platform with TypeScript/React and Node/Express—100+ monthly reservations with PostgreSQL and JWT auth.',
    metaLine: '2025 • React • Node.js • Express • PostgreSQL • JWT',
    description:
      'Full-stack booking platform with TypeScript/React frontend and Node.js/Express backend handling 100+ monthly reservations with PostgreSQL managing relational customer and availability data. Built RESTful API layer with automated email notifications and JWT authentication.',
    media: '/mtm.mp4',
    autoplayVideo: true
  },
  {
    id: 'soul-forest',
    title: 'Soul of the Forest',
    roleTag: 'Game Dev',
    technologies: ['Unity', 'C#', 'Figma', 'Jira', 'Git'],
    summary: 'Commercial game UI/UX—timelines, playtesting, menus in Figma, C#, Unity.',
    metaLine: '2023 • Unity • C# • Figma • Jira • Git',
    description:
      'Directed UI/UX department for commercial game development, establishing development timelines using Jira, Confluence, and Git. Led comprehensive playtesting and implemented menu designs using Figma, C# Scripts, and Unity Game Engine.',
    media: '/soul-of-the-forest.mp4',
    link: 'https://store.steampowered.com/app/2877660/Soul_of_the_Forest/',
    autoplayVideo: true
  },
  {
    id: 'tennis-analytics',
    title: 'CV Tennis Analytics',
    roleTag: 'Computer Vision',
    technologies: ['React', 'FastAPI', 'YOLOv8', 'PyTorch', 'D3.js'],
    summary:
      'Full-stack sports analytics with React dashboard and FastAPI—YOLOv8 and PyTorch on match footage.',
    metaLine: '2025 • React • FastAPI • YOLOv8 • PyTorch • D3.js',
    description:
      'Full-stack sports analytics platform with React dashboard and FastAPI backend processing match footage using custom YOLOv8 and PyTorch models. Designed RESTful APIs serving real-time analysis endpoints with PostgreSQL storing match statistics.',
    detailText:
      'I built the full path from raw match footage to usable analysis: a browser dashboard for uploads, a FastAPI layer for orchestration, and a CV pipeline that turned detections into rally-level stats and tactical feedback. The product goal was speed and clarity, so players could move from video to insight without touching a notebook or labeling tool.'
  },
  {
    id: 'dance-ar',
    title: 'Dance AR',
    roleTag: 'Game Dev',
    technologies: ['Next.js', 'MediaPipe', 'WebRTC', 'Firebase', 'GCP'],
    summary: 'AR fitness platform analyzing movement against choreography using MediaPipe pose estimation.',
    metaLine: '2025 • Next.js • MediaPipe • WebRTC • Firebase • GCP',
    description:
      'Full-stack AR fitness platform analyzing movement against choreography using MediaPipe pose estimation. Engineered RESTful API handling real-time WebRTC streams and movement scoring algorithms. Deployed via CI/CD on GCP.',
    detailText: 'Shipped real-time pose feedback and score overlays, focused on responsiveness and user motivation loops.'
  },
  {
    id: 'jobsim-vr',
    title: 'JobSim VR',
    roleTag: 'Game Dev',
    technologies: ['Unreal Engine 5', 'Blueprints', 'C++'],
    summary:
      'Corporate life simulator in VR—NPCs, head-tracking, dialogue, and a Severance-inspired Macrodata Refinement Room.',
    metaLine: '2024 • Unreal Engine 5 • Blueprints • C++',
    description:
      "Corporate life simulator featuring NPCs with dynamic behaviors, head-tracking, movement, and dialogue. Designed 'Severance'-inspired Macrodata Refinement Room with interactable components and immersive VR environment. Featured in UMich Game Design Showcase.",
    detailText:
      'This project was about making a strange office space feel alive in VR. I focused on interaction design, NPC behavior, and environmental pacing so the world stayed readable and uncanny at the same time, with enough system depth that the player could explore, observe, and feel the room reacting back.',
    youtubeUrl: 'https://youtu.be/EPbTNA2fU0g',
    github: 'https://github.com/kumarannathan/JobSimVR'
  },
  {
    id: 'ann-arbor-go',
    title: 'AnnArborGo',
    roleTag: 'Location AR',
    technologies: ['Unreal Engine 5', 'AR', 'GPS', 'Blueprints', 'C++'],
    summary:
      'Location-based AR game—virtual tree planting, landmarks, eco-defense, GPS navigation, and squirrel encounters.',
    metaLine: '2024 • Unreal Engine 5 • AR • GPS • Blueprints • C++',
    description:
      'Location-based AR game promoting environmental stewardship through virtual tree planting, landmark exploration, and eco-defense mechanics. Features Environmental Achievement Recognition System with eco-medals, GPS landmark navigation, interactive history reveals, and dynamic squirrel encounters requiring strategic acorn-throwing defense.',
    detailText:
      'I treated AnnArborGo as a city-scale progression system, combining GPS movement, landmark discovery, and lightweight AR interactions into something that felt playful instead of purely educational. The core challenge was balancing exploration, reward loops, and local context so the experience felt grounded in Ann Arbor rather than like a generic location game.',
    github: 'https://github.com/kumarannathan/AnnArborGo'
  },
  {
    id: 'focus-zone',
    title: 'CV Distraction Tracker',
    roleTag: 'MediaPipe',
    technologies: ['React', 'TypeScript', 'MediaPipe', 'Computer Vision'],
    summary:
      'Computer vision-powered focus tracking with MediaPipe face mesh—hand gestures and real-time distraction detection.',
    metaLine: '2025 • React • TypeScript • MediaPipe • Computer Vision',
    description:
      'Computer vision-powered focus tracking application using MediaPipe face mesh detection. Features hand gesture controls and real-time distraction detection.',
    detailText:
      'Focus Zone started as a practical browser tool for staying locked in during deep work. I built low-latency face and gesture tracking in the client, then layered in distraction signals and simple controls so the system could react in real time without feeling heavy or invasive. It is the same kind of CV loop I want to revisit later with stronger video-driven UX.',
    github: 'https://github.com/kumarannathan/cv-distraction-tracker'
  }
];
