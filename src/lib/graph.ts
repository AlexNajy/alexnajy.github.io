import { connections, pins } from '../data/case'
import type { Pin, PinKind } from '../data/types'

export const pinById = new Map(pins.map((pin) => [pin.id, pin]))

const neighbours = new Map<string, Set<string>>()
for (const [a, b] of connections) {
  if (!neighbours.has(a)) neighbours.set(a, new Set())
  if (!neighbours.has(b)) neighbours.set(b, new Set())
  neighbours.get(a)!.add(b)
  neighbours.get(b)!.add(a)
}

export function connectedPins(id: string): Pin[] {
  return [...(neighbours.get(id) ?? [])].map((other) => pinById.get(other)).filter((pin) => pin !== undefined)
}

/** The pin itself plus everything one string away from it. */
export function highlightSet(id: string | null): Set<string> | null {
  if (!id) return null
  return new Set([id, ...(neighbours.get(id) ?? [])])
}

export const kindLabels: Record<PinKind, string> = {
  subject: 'Subject',
  project: 'Projects',
  experience: 'Experience',
  skill: 'Skills',
  contact: 'Contact',
}

export const kindOrder: PinKind[] = ['subject', 'project', 'experience', 'skill', 'contact']

export function pinsByKind(kind: PinKind) {
  return pins.filter((pin) => pin.kind === kind)
}
