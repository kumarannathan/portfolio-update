const YOGGER_CRM_IMAGES = [
  '/projects/yogger-crm/cover.jpg',
  '/projects/yogger-crm/profile.png',
  '/projects/yogger-crm/subscription.png',
  '/projects/yogger-crm/journey.png',
  '/projects/yogger-crm/trials.png',
];

export type ProductionLink = {
  label: string;
  href: string;
};

export type ProductionHighlight = {
  title: string;
  detail: string;
};

export type ProductionProject = {
  id: string;
  title: string;
  roleTag?: string;
  summary: string;
  lead: string;
  highlights: ProductionHighlight[];
  technologies: string;
  images?: string[];
  links?: ProductionLink[];
};

export const PRODUCTION_PROJECTS: ProductionProject[] = [
  {
    id: 'yogger-web-redesign',
    title: 'Yogger Redesign',
    roleTag: 'Web',
    summary: 'A calmer, clearer coach dashboard, plus the tasks, analytics and home exercise program tools it was missing',
    lead:
      "Redesigned Yogger's coach web app end to end: a new page shell and sidebar, rebuilt tasks, library, assessments, reports and athlete management, and new analytics and home exercise program (HEP) tools. Every screen now opens with a title and a one-line purpose, so a coach knows what the page is for before they read a single number. It shipped behind a toggle, so the classic UI stays the default and coaches opt into the new one from settings.",
    highlights: [
      {
        title: 'One shell for every page',
        detail:
          'a shared page header, segmented controls, toolbar and skeleton loaders replaced one-off layouts, and the sidebar collapses to an icon rail so the work gets the width.',
      },
      {
        title: 'Tasks as a roster, not a list',
        detail:
          'the old tasks page showed one athlete and a calendar. the new one lists the whole roster with late, watch and on-track status, filters for who needs attention, and per-athlete adherence, overdue count, day streak, weekly adherence and a mark-reviewed action for submitted work.',
      },
      {
        title: 'Coach analytics',
        detail:
          'a new page for the caseload at a glance: completion by task type, program performance, task status and athlete activity over time.',
      },
      {
        title: 'Home exercise programs',
        detail:
          'a program library, program builder (sets, reps, holds, duration, rest, side and frequency, with step-by-step instructions), exercise library and a HEP task roster with session tracking and adherence, gated to professional and clinic tiers.',
      },
      {
        title: 'Everything else, tightened',
        detail:
          'grid and list views in the library, color-coded scores in assessments, reports as a searchable table with drafts and saved counts, and athlete management as a table with status, tasks and a copyable invite link.',
      },
    ],
    technologies: 'React, TypeScript, MUI, Firebase (Firestore, Storage, Auth)',
    images: [
      '/projects/yogger-web/after/login-cover.jpg',
      '/projects/yogger-web/after/analytics-cover.jpg',
      '/projects/yogger-web/after/home.jpg',
      '/projects/yogger-web/after/tasks.png',
    ],
  },
  {
    id: 'home-exercise-builder',
    title: 'Home Exercise Builder',
    roleTag: 'Web',
    summary:
      'One continuous flow to create exercises and programs — designed as a premium reason for coaches to open Yogger every day',
    lead:
      "Built Yogger's home exercise builder as a product surface, not a settings drawer: create an exercise, drop it into a program, assign it, and see adherence without leaving the coach web app. The design bet was simple — if building and running programs feels premium and one-flow, coaches come back because the tool earns the visit, not because a notification dragged them in.",
    highlights: [
      {
        title: 'One-flow creation',
        detail:
          'name a program, set weeks and cover, then add exercises from the library or create new ones in place. prescriptions (sets, reps, side, frequency, holds) live on the program so the same movement can be dosed differently per athlete path — without bouncing between five screens.',
      },
      {
        title: 'Exercise library that feels owned',
        detail:
          'grid and list views, searchable names, clear target areas, and a detail modal with media, suggested dose, and numbered how-to steps. Yogger defaults ship alongside custom org exercises so day-one coaches still have something to assign.',
      },
      {
        title: 'Programs as the product',
        detail:
          'a program library with real cover thumbs, an overview card that scrolls under a sticky hero, assigned-athlete avatars, and an ordered exercise list — so a program reads like something you built, not a spreadsheet row.',
      },
      {
        title: 'A premium reason to return',
        detail:
          'HEP tasks and adherence sit next to the builder: who is on track, who went quiet, and what they were assigned. the builder is the craft surface; the roster is the reason to check in again tomorrow.',
      },
    ],
    technologies: 'React, TypeScript, MUI, Firebase (Firestore, Storage)',
    images: [
      '/projects/home-exercise-builder/program-overview.jpg',
      '/projects/home-exercise-builder/analytics-cover.jpg',
      '/projects/home-exercise-builder/exercise-library.jpg',
      '/projects/home-exercise-builder/exercise-detail.jpg',
      '/projects/home-exercise-builder/program-library.jpg',
      '/projects/home-exercise-builder/create-program.jpg',
    ],
  },
  {
    id: 'yogger-crm',
    title: 'CRM @ Yogger',
    roleTag: 'Production',
    summary: 'Internal CRM and admin platform for support, sales, and customer success',
    lead:
      "Architected and built Yogger's internal operations platform in React and TypeScript — 60+ components spanning deal pipelines, form submissions, support ticketing, and user/org management — replacing manual sales tracking with a single operator surface used daily across support, sales, and CS.",
    highlights: [
      {
        title: 'Deal pipeline & form submissions',
        detail:
          "inbound demo and trial requests flow through a staged pipeline, so sales sees every lead's state at a glance instead of digging through raw form data.",
      },
      {
        title: 'User & org management',
        detail:
          'search accounts, inspect coach/athlete relationships, resolve team-access issues, and adjust subscriptions and entitlements in place, with changes reflected instantly on iOS, Android, and web.',
      },
      {
        title: 'Config-driven segmentation engine',
        detail:
          "designed a segmentation layer over flattened Firestore queries that seeds bounded pool queries from indexable fields, working around Firestore's lack of full-text and dynamic OR search to support 20+ filterable fields.",
      },
      {
        title: 'Org KPI dashboards',
        detail:
          'clinic-trial progress tracking and UTM attribution built on scheduled Cloud Functions rollups, turning raw event streams into queryable cohort and funnel views.',
      },
    ],
    technologies: 'React, TypeScript, Firebase (Firestore, Auth, Cloud Functions), scheduled rollup jobs',
    images: YOGGER_CRM_IMAGES,
  },
  {
    id: 'saml-sso',
    title: 'Enterprise SAML SSO',
    roleTag: 'Platform',
    summary: 'Single sign-on across web, Android, and iOS — the unlock for our first enterprise customer',
    lead:
      "Owned enterprise SAML SSO end-to-end on Firebase Identity Platform, covering multi-tenant provider resolution, user provisioning, and a web auth bridge that brings the same flow to both mobile clients. Landed Sanford Health (47,000 employees) as Yogger's first enterprise customer.",
    highlights: [
      {
        title: 'Multi-tenant resolution',
        detail:
          'routes each sign-in to the correct identity provider so a single deployment serves many enterprise tenants.',
      },
      {
        title: 'Just-in-time provisioning',
        detail:
          'creates and links accounts on first login and maps them into the right org, no manual onboarding step.',
      },
      {
        title: 'Cross-platform auth bridge',
        detail:
          'a shared web-based flow the Android and iOS clients hand off to, keeping one implementation instead of three divergent native ones.',
      },
    ],
    technologies: 'Firebase Identity Platform, SAML 2.0, TypeScript, Kotlin, Swift',
  },
  {
    id: 'rag-gemini',
    title: 'RAG AI Assessment Summaries',
    roleTag: 'AI',
    summary: 'Grounded, clinically-sourced AI summaries for movement assessments',
    lead:
      'Shipped a retrieval-augmented summary feature that turns raw assessment scores into readable clinical narratives, grounded in an 18-document knowledge base spanning 14 assessment types — so output cites real source material instead of improvising.',
    highlights: [
      {
        title: 'Retrieval over a curated corpus',
        detail:
          'Gemini File Search retrieves the relevant clinical passages per assessment type; generation runs on Firebase Cloud Functions and is grounded in what comes back.',
      },
      {
        title: 'Hash-diffed sync CLI',
        detail:
          'custom tooling that diffs content hashes and pushes only what changed, making knowledge-base updates a single command instead of a manual re-upload.',
      },
      {
        title: 'Offline prompt eval harness',
        detail:
          'prompt changes are scored against a fixed set of cases before shipping, so regressions get caught off the critical path.',
      },
      {
        title: 'Layered fallbacks & caching',
        detail:
          'tiered retrieval and quota fallbacks keep the feature available under load; prompt-version plus content-hash caching on the iOS client avoids paying for identical generations twice.',
      },
    ],
    technologies: 'Google Gemini (File Search), Firebase Cloud Functions, Node.js CLI tooling, Swift',
  },
  {
    id: 'movement-age',
    title: 'Movement Age & the Android Assessment Engine',
    roleTag: 'Mobile',
    summary: "Yogger's flagship assessment product, shipped end-to-end on Android",
    lead:
      "Built Movement Age — the company's flagship assessment — end-to-end in Kotlin, raising average session engagement 40% in the 10 weeks after launch.",
    highlights: [
      {
        title: 'Rebuilt assessment engine',
        detail:
          'directional joint trackers, phase state machines, calibration checks, and signal-quality flags across 12+ assessments, improving capture reliability and bringing Android scores in line with iOS.',
      },
      {
        title: 'UI overhaul across 25+ screens',
        detail:
          'tab bar, role-based dashboards, progress, library, and assessment creation, with localization, paging, and caching throughout. MAU grew 2× to a 16.8K peak over the same period.',
      },
      {
        title: 'Clearer results experience',
        detail:
          'score breakdowns that lead with the takeaway, expandable component cards that collapse a long scroll into a scannable overview, and a lighter visual system that keeps attention on the analysis.',
      },
    ],
    technologies: 'Kotlin, Android, Firebase, MediaPipe-style pose tracking',
    images: ['/projects/yogger-mobile/cover.jpg'],
    links: [
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=io.yogger.Yogger&hl=en_NZ',
      },
      {
        label: 'App Store',
        href: 'https://apps.apple.com/us/app/yogger-movement-analysis/id1576592816',
      },
    ],
  },
];
