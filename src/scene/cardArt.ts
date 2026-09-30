import { subject } from '../data/case'
import type { Pin } from '../data/types'
import { seededRandom } from './boardSpace'

// Card faces are drawn with the 2D canvas API and uploaded as textures.
// It keeps the scene free of image assets and lets the cards use the same
// web fonts as the HTML.

type Ctx = CanvasRenderingContext2D
type Rand = () => number

const TYPEWRITER = '"Special Elite", "Courier New", monospace'
const MONO = '"Courier Prime", "Courier New", monospace'
const INK = '#2b2219'
const FADED_INK = '#6b5a45'
const RED = '#a3261c'

export const fontsReady: Promise<unknown> =
  typeof document === 'undefined'
    ? Promise.resolve()
    : Promise.all([
        document.fonts.load(`40px ${TYPEWRITER}`),
        document.fonts.load(`40px ${MONO}`),
        document.fonts.load(`bold 40px ${MONO}`),
      ]).catch(() => undefined)

let photo: HTMLImageElement | null = null
export const photoReady: Promise<unknown> = subject.photo
  ? new Promise((resolve) => {
      const image = new Image()
      image.onload = () => {
        photo = image
        resolve(image)
      }
      image.onerror = resolve
      image.src = `${import.meta.env.BASE_URL}${subject.photo}`
    })
  : Promise.resolve()

export function drawCard(ctx: Ctx, width: number, height: number, pin: Pin) {
  ctx.clearRect(0, 0, width, height)
  const rand = seededRandom(pin.id)
  const u = width / 100
  switch (pin.kind) {
    case 'subject':
      return drawSubject(ctx, width, height, u, rand)
    case 'project':
      return drawFolder(ctx, width, height, u, pin, rand)
    case 'experience':
      return drawIndexCard(ctx, width, height, u, pin, rand)
    case 'skill':
      return drawTag(ctx, width, height, u, pin, rand)
    case 'contact':
      return drawSticky(ctx, width, height, u, pin, rand)
  }
}

function drawSubject(ctx: Ctx, w: number, h: number, u: number, rand: Rand) {
  paper(ctx, 0, 0, w, h, '#efe6d0', rand)

  ctx.fillStyle = INK
  ctx.font = `${4.6 * u}px ${TYPEWRITER}`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('SUBJECT PROFILE', 6 * u, 9 * u)
  rule(ctx, 6 * u, 12 * u, w - 12 * u, u * 0.5)

  const photoBox = { x: 6 * u, y: 17 * u, w: 40 * u, h: 50 * u }
  drawPhoto(ctx, photoBox.x, photoBox.y, photoBox.w, photoBox.h, u)

  let y = 21 * u
  const colX = 51 * u
  const colW = 44 * u
  field(ctx, 'NAME', colX, y, u)
  ctx.font = `${7.6 * u}px ${TYPEWRITER}`
  ctx.fillStyle = INK
  y = wrapText(ctx, subject.name, colX, y + 7 * u, colW, 8.2 * u, 3) + 4 * u
  field(ctx, 'STATUS', colX, y, u)
  ctx.font = `bold ${4.3 * u}px ${MONO}`
  ctx.fillStyle = INK
  wrapText(ctx, subject.title, colX, y + 5 * u, colW, 5.2 * u, 4)

  y = 76 * u
  field(ctx, 'LOCATION', 6 * u, y, u)
  ctx.font = `bold ${4.3 * u}px ${MONO}`
  ctx.fillStyle = INK
  y = wrapText(ctx, subject.location, 6 * u, y + 5 * u, 88 * u, 5.2 * u, 2) + 4 * u
  field(ctx, 'EDUCATION', 6 * u, y, u)
  ctx.font = `bold ${4.3 * u}px ${MONO}`
  ctx.fillStyle = INK
  wrapText(ctx, subject.education, 6 * u, y + 5 * u, 88 * u, 5.2 * u, 3)

  stamp(ctx, 'SUBJECT', w * 0.5, h - 20 * u, 7 * u, -0.1)
}

function drawPhoto(ctx: Ctx, x: number, y: number, w: number, h: number, u: number) {
  ctx.save()
  ctx.shadowColor = 'rgba(40, 25, 10, 0.35)'
  ctx.shadowBlur = 2 * u
  ctx.shadowOffsetY = 0.6 * u
  ctx.fillStyle = '#faf6ec'
  ctx.fillRect(x - 1.5 * u, y - 1.5 * u, w + 3 * u, h + 3 * u)
  ctx.restore()

  if (photo) {
    // Cover-fit the photo into the frame.
    const scale = Math.max(w / photo.width, h / photo.height)
    const sw = w / scale
    const sh = h / scale
    ctx.drawImage(photo, (photo.width - sw) / 2, (photo.height - sh) / 2, sw, sh, x, y, w, h)
  } else {
    ctx.fillStyle = '#cfc6b4'
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = '#9d927f'
    ctx.beginPath()
    ctx.arc(x + w / 2, y + h * 0.38, w * 0.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(x + w / 2, y + h, w * 0.4, h * 0.36, 0, Math.PI, 0)
    ctx.fill()
    ctx.fillStyle = '#5a5042'
    ctx.font = `${3.2 * u}px ${MONO}`
    ctx.textAlign = 'center'
    ctx.fillText('PHOTO PENDING', x + w / 2, y + h - 3 * u)
    ctx.textAlign = 'left'
  }

  // Paper clip over the top edge
  ctx.strokeStyle = '#8a8d91'
  ctx.lineWidth = 0.9 * u
  ctx.beginPath()
  ctx.roundRect(x + w * 0.62, y - 5 * u, 6 * u, 16 * u, 3 * u)
  ctx.stroke()
  ctx.beginPath()
  ctx.roundRect(x + w * 0.62 + 1.6 * u, y - 3 * u, 2.8 * u, 11 * u, 1.4 * u)
  ctx.stroke()
}

function drawFolder(ctx: Ctx, w: number, h: number, u: number, pin: Pin, rand: Rand) {
  const back = '#c49a45'
  const front = '#dcb567'
  const tabW = 32 * u
  const tabH = 8 * u

  // Back of the folder with its tab
  ctx.fillStyle = back
  ctx.beginPath()
  ctx.roundRect(4 * u, 0, tabW, tabH + 2 * u, [1.5 * u, 1.5 * u, 0, 0])
  ctx.fill()
  ctx.fillRect(0, tabH, w, h - tabH)

  // A sheet of paper sticking out
  ctx.save()
  ctx.translate(w * 0.55, 10 * u)
  ctx.rotate((rand() - 0.5) * 0.06)
  paper(ctx, -40 * u, -6 * u, 80 * u, 20 * u, '#f3ecdc', rand)
  ctx.fillStyle = 'rgba(43, 34, 25, 0.5)'
  for (let i = 0; i < 3; i++) ctx.fillRect(-34 * u, -2 * u + i * 3 * u, (40 + rand() * 25) * u, 0.7 * u)
  ctx.restore()

  paper(ctx, 0, 12 * u, w, h - 12 * u, front, rand)
  ctx.fillStyle = 'rgba(120, 80, 20, 0.25)'
  ctx.fillRect(0, 12 * u, w, 0.6 * u)

  // White label with the project name
  const label = { x: 9 * u, y: 22 * u, w: 82 * u, h: 32 * u }
  paper(ctx, label.x, label.y, label.w, label.h, '#f6f0e1', rand)
  ctx.strokeStyle = 'rgba(43, 34, 25, 0.35)'
  ctx.lineWidth = 0.4 * u
  ctx.strokeRect(label.x + 1.5 * u, label.y + 1.5 * u, label.w - 3 * u, label.h - 3 * u)
  ctx.fillStyle = INK
  const titleSize = fitFont(ctx, pin.title, label.w - 8 * u, 8 * u, TYPEWRITER)
  ctx.fillText(pin.title, label.x + 4 * u, label.y + 5 * u + titleSize)
  if (pin.label) {
    ctx.fillStyle = FADED_INK
    ctx.font = `bold ${4 * u}px ${MONO}`
    wrapText(ctx, pin.label, label.x + 4 * u, label.y + 11 * u + titleSize, label.w - 8 * u, 4.6 * u, 2)
  }

  stamp(ctx, 'PROJECT', w - 22 * u, h - 8 * u, 4.4 * u, -0.1)
}

function drawIndexCard(ctx: Ctx, w: number, h: number, u: number, pin: Pin, rand: Rand) {
  paper(ctx, 0, 0, w, h, '#f7f2e6', rand)
  ctx.fillStyle = 'rgba(70, 110, 170, 0.35)'
  for (let y = 22 * u; y < h - 2 * u; y += 7 * u) ctx.fillRect(0, y, w, 0.35 * u)
  ctx.fillStyle = 'rgba(190, 50, 50, 0.55)'
  ctx.fillRect(0, 15 * u, w, 0.5 * u)

  ctx.fillStyle = RED
  ctx.font = `bold ${3.6 * u}px ${MONO}`
  ctx.fillText('EMPLOYMENT RECORD', 6 * u, 7 * u)

  ctx.fillStyle = INK
  fitFont(ctx, pin.title, w - 12 * u, 7 * u, TYPEWRITER)
  ctx.fillText(pin.title, 6 * u, 13.5 * u)
  if (pin.label) {
    ctx.font = `bold ${4.6 * u}px ${MONO}`
    ctx.fillStyle = '#3c3024'
    wrapText(ctx, pin.label, 6 * u, 27.5 * u, w - 12 * u, 7 * u, 2)
  }
  ctx.font = `${4 * u}px ${MONO}`
  ctx.fillStyle = FADED_INK
  wrapText(ctx, pin.file.headline, 6 * u, 41.5 * u, w - 12 * u, 7 * u, 2)
}

function drawTag(ctx: Ctx, w: number, h: number, u: number, pin: Pin, rand: Rand) {
  paper(ctx, 0, 0, w, h, '#eadcb9', rand)
  ctx.strokeStyle = 'rgba(43, 34, 25, 0.45)'
  ctx.lineWidth = 0.6 * u
  ctx.setLineDash([2 * u, 1.4 * u])
  ctx.strokeRect(3 * u, 3 * u, w - 6 * u, h - 6 * u)
  ctx.setLineDash([])

  ctx.fillStyle = INK
  const size = fitFont(ctx, pin.title, w - 30 * u, 12 * u, TYPEWRITER)
  ctx.fillText(pin.title, 22 * u, h / 2 + size * 0.55)
}

function drawSticky(ctx: Ctx, w: number, h: number, u: number, pin: Pin, rand: Rand) {
  paper(ctx, 0, 0, w, h, '#f1d668', rand)
  ctx.fillStyle = 'rgba(160, 120, 20, 0.18)'
  ctx.fillRect(0, 0, w, 14 * u)

  ctx.fillStyle = INK
  ctx.font = `${11 * u}px ${TYPEWRITER}`
  ctx.fillText((pin.label ?? pin.title).toUpperCase(), 9 * u, 30 * u)
  rule(ctx, 9 * u, 34 * u, 60 * u, 0.7 * u)

  ctx.font = `bold ${7.4 * u}px ${MONO}`
  const lines = ['Resume', 'Email', 'GitHub', 'LinkedIn']
  lines.forEach((line, i) => ctx.fillText(`» ${line}`, 9 * u, 48 * u + i * 11 * u))

}

function paper(ctx: Ctx, x: number, y: number, w: number, h: number, base: string, rand: Rand) {
  ctx.fillStyle = base
  ctx.fillRect(x, y, w, h)

  const specks = Math.floor((w * h) / 180)
  for (let i = 0; i < specks; i++) {
    const shade = rand() > 0.5 ? '255, 255, 255' : '90, 60, 30'
    ctx.fillStyle = `rgba(${shade}, ${0.03 + rand() * 0.06})`
    ctx.fillRect(x + rand() * w, y + rand() * h, 1 + rand() * 2, 1 + rand() * 2)
  }

  // Aged edges
  const edge = ctx.createRadialGradient(x + w / 2, y + h / 2, Math.min(w, h) * 0.35, x + w / 2, y + h / 2, Math.max(w, h) * 0.75)
  edge.addColorStop(0, 'rgba(120, 80, 30, 0)')
  edge.addColorStop(1, 'rgba(120, 80, 30, 0.22)')
  ctx.fillStyle = edge
  ctx.fillRect(x, y, w, h)
}

function rule(ctx: Ctx, x: number, y: number, width: number, thickness: number) {
  ctx.fillStyle = INK
  ctx.fillRect(x, y, width, thickness)
}

function field(ctx: Ctx, label: string, x: number, y: number, u: number) {
  ctx.fillStyle = FADED_INK
  ctx.font = `bold ${3.2 * u}px ${MONO}`
  ctx.fillText(label, x, y)
}

function stamp(ctx: Ctx, text: string, cx: number, cy: number, size: number, angle: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(angle)
  ctx.font = `${size}px ${TYPEWRITER}`
  const width = ctx.measureText(text).width
  ctx.globalAlpha = 0.78
  ctx.strokeStyle = RED
  ctx.lineWidth = size * 0.12
  ctx.strokeRect(-width / 2 - size * 0.4, -size * 0.85, width + size * 0.8, size * 1.35)
  ctx.fillStyle = RED
  ctx.textAlign = 'center'
  ctx.fillText(text, 0, size * 0.28)
  ctx.restore()
}

/** Sets the largest font (up to maxSize) that fits the text in maxWidth, and returns that size. */
function fitFont(ctx: Ctx, text: string, maxWidth: number, maxSize: number, family: string): number {
  let size = maxSize
  ctx.font = `${size}px ${family}`
  while (size > 8 && ctx.measureText(text).width > maxWidth) {
    size -= 1
    ctx.font = `${size}px ${family}`
  }
  return size
}

/** Draws word-wrapped text and returns the baseline of the last line. */
function wrapText(ctx: Ctx, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number): number {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)

  if (lines.length > maxLines) {
    lines.length = maxLines
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\s+\S*$/, '')}…`
  }
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight))
  return y + (lines.length - 1) * lineHeight
}
