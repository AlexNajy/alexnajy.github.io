import type { Pin, PinKind } from '../data/types'

// World units are arbitrary; the camera fits itself to whatever these are.
export const BOARD = { width: 10, height: 6.2 }

/** Cards float a little in front of the cork so their shadows have somewhere to land. */
export const CARD_Z = 0.035
export const PIN_HEAD_Z = 0.075

export const CARD_SIZE: Record<PinKind, readonly [width: number, height: number]> = {
  subject: [1.95, 2.45],
  project: [1.55, 1.15],
  experience: [1.35, 0.85],
  skill: [0.95, 0.42],
  contact: [0.95, 0.95],
}

export function boardToWorld(pin: Pin): [number, number] {
  return [(pin.x * BOARD.width) / 2, (pin.y * BOARD.height) / 2]
}

/**
 * Where the pushpins sit on a card, in the card's own (untilted) space.
 * The subject card gets a second pin at the bottom so strings to cards
 * below it don't have to run across its face.
 */
export function pinOffsets(kind: PinKind): [number, number][] {
  const [w, h] = CARD_SIZE[kind]
  if (kind === 'skill') return [[-w / 2 + 0.12, 0]]
  if (kind === 'subject') return [[0, h / 2 - 0.1], [0, -h / 2 + 0.1]]
  return [[0, h / 2 - 0.1]]
}

// A small hash so every card gets the same "random" tilt on every visit.
export function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(hash ^ value.charCodeAt(i), 16777619)
  }
  return hash >>> 0
}

export function seededRandom(seed: string): () => number {
  let state = hashString(seed)
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function tiltRadians(pin: Pin): number {
  const degrees = pin.tilt ?? (seededRandom(pin.id)() - 0.5) * 7
  return (degrees * Math.PI) / 180
}

type Vec3 = [number, number, number]

/** World-space positions of a card's pushpin heads, which is where strings tie on. */
function pinAnchors(pin: Pin): Vec3[] {
  const [cx, cy] = boardToWorld(pin)
  const angle = tiltRadians(pin)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return pinOffsets(pin.kind).map(([ox, oy]) => [cx + ox * cos - oy * sin, cy + ox * sin + oy * cos, CARD_Z + PIN_HEAD_Z])
}

/** The pair of pins, one on each card, that are closest together. */
export function stringEnds(a: Pin, b: Pin): [Vec3, Vec3] {
  let best: [Vec3, Vec3] = [pinAnchors(a)[0], pinAnchors(b)[0]]
  let bestDistance = Infinity
  for (const from of pinAnchors(a)) {
    for (const to of pinAnchors(b)) {
      const distance = Math.hypot(from[0] - to[0], from[1] - to[1])
      if (distance < bestDistance) {
        bestDistance = distance
        best = [from, to]
      }
    }
  }
  return best
}
