export type PinKind = 'subject' | 'project' | 'experience' | 'skill' | 'contact'

export interface FileLink {
  label: string
  href: string
}

/** The content of a dossier. */
export interface CaseFile {
  headline: string
  summary: string[]
  role?: string
  period?: string
  stack?: string[]
  results?: string[]
  links?: FileLink[]
  /** Marks the file as placeholder content that still needs real details. */
  draft?: boolean
}

export interface Pin {
  id: string
  kind: PinKind
  title: string
  /** Short line printed on the card itself in the 3D scene. */
  label?: string
  /** Board-relative position: -1 is the left/bottom edge, 1 is the right/top edge. */
  x: number
  y: number
  /** Tilt in degrees. Omit it and the card gets a stable pseudo-random tilt. */
  tilt?: number
  file: CaseFile
}

export interface Subject {
  name: string
  title: string
  location: string
  education: string
  /** Path inside public/, e.g. 'alex.jpg'. Leave undefined to show a placeholder silhouette. */
  photo?: string
}

export interface Contact {
  email: string
  github: string
  linkedin: string
  /** Path inside public/. */
  resume: string
}

export type Connection = readonly [from: string, to: string]
