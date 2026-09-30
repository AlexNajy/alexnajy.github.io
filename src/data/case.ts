import type { Connection, Contact, Pin, Subject } from './types'

// Everything on the board lives here. To add a project: add a Pin with
// kind 'project', give it a free spot on the board, and connect it below.
//
// Anything marked PLACEHOLDER (or draft: true) is filler until Alex writes
// the real thing. Project descriptions are taken from each repo's README.

export const subject: Subject = {
  name: 'Alexander Najy',
  title: 'Computer Science Student, 4th year',
  location: 'PLACEHOLDER: City, Country',
  education: 'PLACEHOLDER: University, B.Sc. Computer Science (expected 20XX)',
  photo: undefined,
}

export const contact: Contact = {
  email: 'PLACEHOLDER@example.com',
  github: 'https://github.com/AlexNajy',
  linkedin: 'https://www.linkedin.com/in/PLACEHOLDER',
  resume: 'resume.pdf',
}

export const pins: Pin[] = [
  {
    id: 'subject',
    kind: 'subject',
    title: subject.name,
    x: 0,
    y: 0.02,
    tilt: -1,
    file: {
      headline: subject.title,
      summary: [
        'PLACEHOLDER: two or three sentences on who you are, what you like building, and what kind of role you are looking for.',
        'Works mostly in TypeScript, Python and Java.',
      ],
      role: subject.title,
      draft: true,
    },
  },

  // Projects
  {
    id: 'dataset-explorer',
    kind: 'project',
    title: 'DSCI 320 Dataset Explorer',
    label: 'Searchable dataset catalog with semantic search',
    x: -0.44,
    y: 0.5,
    file: {
      headline: 'A searchable, filterable catalog of datasets for DSCI 320.',
      summary: [
        'A tool that lets students filter datasets by column type, search by topic using semantic embeddings, and see ML-generated suitability tags instead of browsing datasets by hand.',
        'A Python pipeline classifies every column, checks the guesses against hand-verified answer keys, tags each dataset with likely ML tasks, and writes the data the site loads at runtime. Search runs an embedding model in the browser.',
      ],
      role: 'PLACEHOLDER: your role (solo project? team? what did you own?)',
      stack: ['Python', 'pandas', 'sentence-transformers', 'React', 'GitHub Pages'],
      results: [
        'Column-type classifier tracked against verified answer keys',
        'In-browser semantic search with all-MiniLM-L6-v2 embeddings',
        'Upload modal classifies new CSVs client-side using a JS port of the classifier',
        'PLACEHOLDER: a measurable result (accuracy, users, time saved)',
      ],
      links: [
        { label: 'Live demo', href: 'https://alexnajy.github.io/dsci320-dataset-explorer/' },
        { label: 'GitHub', href: 'https://github.com/AlexNajy/dsci320-dataset-explorer' },
      ],
    },
  },
  {
    id: 'teamlytics',
    kind: 'project',
    title: 'Teamlytics',
    label: '"The CEO you never had."',
    x: 0.44,
    y: 0.52,
    file: {
      headline: 'A full-stack workspace management tool with an AI operations assistant.',
      summary: [
        'Teamlytics tracks tasks and team members, with task assignment, team member management, and an AI assistant interface that is still in progress.',
      ],
      role: 'PLACEHOLDER: your role',
      stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'TanStack Query', 'Radix UI', 'FastAPI', 'SQLAlchemy', 'Alembic', 'PostgreSQL', 'Docker'],
      results: ['PLACEHOLDER: what you shipped, learned, or measured'],
      links: [{ label: 'GitHub', href: 'https://github.com/AlexNajy/Teamlytics' }],
    },
  },
  {
    id: 'along',
    kind: 'project',
    title: 'Along',
    label: 'Find walking buddies nearby',
    x: -0.47,
    y: -0.08,
    file: {
      headline: 'A mobile app for finding and joining group walks near you.',
      summary: [
        'Open the map to see upcoming walks nearby, tap one to view the route and who is going, and send a join request to the organizer. Once accepted, you get turn-by-turn walking directions to the meeting point.',
        'You can also create your own walk: set a start and end point, choose a walk type, and let others come to you.',
      ],
      role: 'PLACEHOLDER: your role',
      stack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PostgreSQL', 'Mapbox', 'NativeWind', 'Google OAuth'],
      results: ['PLACEHOLDER: what you shipped, learned, or measured'],
      links: [{ label: 'GitHub', href: 'https://github.com/AlexNajy/Along' }],
    },
  },
  {
    id: 'a-share',
    kind: 'project',
    title: 'A-Share',
    label: 'Peer-to-peer rental marketplace',
    x: 0.47,
    y: -0.06,
    file: {
      headline: 'A marketplace for renting everyday items from people in your community.',
      summary: [
        'Users browse items with real-time availability, list their own items in "My Store", message renters and owners, and track active rentals and rental history. Login is cookie-based with protected routes.',
      ],
      role: 'PLACEHOLDER: your role',
      stack: ['Next.js 15', 'React 18', 'TypeScript', 'Fluent UI', 'Tailwind CSS', 'FastAPI', 'PostgreSQL'],
      results: ['PLACEHOLDER: what you shipped, learned, or measured'],
      links: [{ label: 'GitHub', href: 'https://github.com/AlexNajy/A-Share' }],
    },
  },
  {
    id: 'blackjack',
    kind: 'project',
    title: 'BlackJack',
    label: 'Blackjack without the real money',
    x: -0.36,
    y: -0.66,
    file: {
      headline: 'A playable blackjack game in Java, with no real money or ads.',
      summary: [
        'Hit, stand and bet against the house. Aces count as 1 or 11 automatically, and blackjacks and busts are resolved for you.',
        'Your bankroll and the deck are saved between sessions, so you can keep your count when you come back.',
      ],
      role: 'PLACEHOLDER: your role',
      stack: ['Java'],
      results: ['PLACEHOLDER: what you shipped, learned, or measured'],
      links: [{ label: 'GitHub', href: 'https://github.com/AlexNajy/BlackJack' }],
    },
  },
  {
    id: 'dungeon-driver',
    kind: 'project',
    title: 'DungeonDriver',
    label: 'Escape the dungeon in an RC car',
    x: 0.37,
    y: -0.66,
    file: {
      headline: 'Escape the dungeon in an RC car.',
      summary: [
        'A 3D game built in Godot 4. Levels are generated procedurally from prefab rooms using the SimpleDungeons addon (CC0).',
      ],
      role: 'PLACEHOLDER: your role',
      stack: ['Godot 4', 'GDScript'],
      results: ['PLACEHOLDER: what you shipped, learned, or measured'],
      links: [{ label: 'GitHub', href: 'https://github.com/AlexNajy/DungeonDriver' }],
    },
  },

  // Experience
  {
    id: 'experience-1',
    kind: 'experience',
    title: 'PLACEHOLDER Role',
    label: 'Company · 20XX to 20XX',
    x: 0,
    y: 0.7,
    file: {
      headline: 'PLACEHOLDER: role title at company.',
      summary: ['PLACEHOLDER: one or two sentences on the team and what you worked on.'],
      role: 'PLACEHOLDER: Role title',
      period: '20XX to 20XX',
      stack: ['PLACEHOLDER'],
      results: ['PLACEHOLDER: an outcome, ideally with a number'],
      draft: true,
    },
  },
  {
    id: 'experience-2',
    kind: 'experience',
    title: 'PLACEHOLDER Role',
    label: 'Company · 20XX to 20XX',
    x: 0.02,
    y: -0.7,
    file: {
      headline: 'PLACEHOLDER: role title at company.',
      summary: ['PLACEHOLDER: one or two sentences on the team and what you worked on.'],
      role: 'PLACEHOLDER: Role title',
      period: '20XX to 20XX',
      stack: ['PLACEHOLDER'],
      results: ['PLACEHOLDER: an outcome, ideally with a number'],
      draft: true,
    },
  },

  // Skills
  skill('python', 'Python', -0.83, 0.64),
  skill('ml', 'ML / Embeddings', -0.84, 0.3),
  skill('react-native', 'React Native', -0.82, -0.05),
  skill('java', 'Java', -0.84, -0.4),
  skill('typescript', 'TypeScript', 0.83, 0.66),
  skill('react', 'React', 0.84, 0.32),
  skill('fastapi', 'FastAPI', 0.82, -0.02),
  skill('postgresql', 'PostgreSQL', 0.84, -0.37),
  skill('godot', 'Godot', 0.8, -0.74),

  {
    id: 'contact',
    kind: 'contact',
    title: 'Contact',
    label: 'Leads',
    x: -0.8,
    y: -0.77,
    tilt: 4,
    file: {
      headline: 'How to reach the subject.',
      summary: ['Open to internships and new-grad roles. The fastest route is email.'],
      links: [
        { label: 'Email', href: `mailto:${contact.email}` },
        { label: 'GitHub', href: contact.github },
        { label: 'LinkedIn', href: contact.linkedin },
        { label: 'Resume (PDF)', href: `${import.meta.env.BASE_URL}${contact.resume}` },
      ],
    },
  },
]

export const connections: Connection[] = [
  ['subject', 'dataset-explorer'],
  ['subject', 'teamlytics'],
  ['subject', 'along'],
  ['subject', 'a-share'],
  ['subject', 'blackjack'],
  ['subject', 'dungeon-driver'],
  ['subject', 'experience-1'],
  ['subject', 'experience-2'],

  ['dataset-explorer', 'python'],
  ['dataset-explorer', 'ml'],
  ['dataset-explorer', 'react'],
  ['teamlytics', 'typescript'],
  ['teamlytics', 'react'],
  ['teamlytics', 'python'],
  ['teamlytics', 'fastapi'],
  ['teamlytics', 'postgresql'],
  ['along', 'typescript'],
  ['along', 'react-native'],
  ['along', 'postgresql'],
  ['a-share', 'typescript'],
  ['a-share', 'react'],
  ['a-share', 'fastapi'],
  ['a-share', 'postgresql'],
  ['blackjack', 'java'],
  ['dungeon-driver', 'godot'],
]

// Skills share one shape, so they get a helper. Their dossier lists the
// connected projects automatically, so there is little to write by hand.
function skill(id: string, title: string, x: number, y: number): Pin {
  return {
    id,
    kind: 'skill',
    title,
    x,
    y,
    file: {
      headline: `Projects built with ${title}.`,
      summary: [`Projects on this board that used ${title} are linked below.`],
    },
  }
}
