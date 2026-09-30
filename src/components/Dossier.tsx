import { motion, type TargetAndTransition } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { subject } from '../data/case'
import type { Pin } from '../data/types'
import type { CardOrigin } from '../lib/cardOrigin'
import { connectedPins } from '../lib/graph'
import { ContactLinks } from './ContactLinks'
import { FileLink } from './FileLink'
import { SubjectPhoto } from './SubjectPhoto'

interface DossierProps {
  pin: Pin
  /** Present when the file was opened by clicking its card on the board. */
  origin: CardOrigin | null
  onClose: () => void
}

/** Keep in sync with .paper max-width in index.css. */
const PAPER_MAX_WIDTH = 760

// The page flies in from wherever its card sat on the board, at the card's
// size and tilt, then settles in front of you. Closing plays it in reverse,
// so it looks like the page goes back onto the board.
function liftedFrom(origin: CardOrigin | null): TargetAndTransition {
  if (!origin) return { opacity: 0, y: 40, scale: 0.92, rotate: 2 }
  const paperWidth = Math.min(PAPER_MAX_WIDTH, window.innerWidth - 32)
  return {
    opacity: 0.4,
    x: origin.x - window.innerWidth / 2,
    y: origin.y - window.innerHeight / 2,
    scale: origin.width / paperWidth,
    rotate: origin.rotate,
  }
}

export function Dossier({ pin, origin, onClose }: DossierProps) {
  const paperRef = useRef<HTMLElement>(null)
  const from = liftedFrom(origin)

  // Move focus onto the page so keyboard and screen reader users land on it,
  // then hand focus back to whatever opened it.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    paperRef.current?.focus()
    return () => {
      if (opener?.isConnected) opener.focus()
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="paper-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.article
        ref={paperRef}
        className={`paper paper--${pin.kind}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="paper-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        initial={from}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: -0.6 }}
        exit={from}
        transition={{ type: 'spring', stiffness: 170, damping: 24 }}
      >
        <button type="button" className="paper__close" onClick={onClose} aria-label="Put it back">
          ✕
        </button>
        <PaperContent pin={pin} />
      </motion.article>
    </motion.div>
  )
}

function PaperContent({ pin }: { pin: Pin }) {
  switch (pin.kind) {
    case 'subject':
      return <SubjectPage pin={pin} />
    case 'project':
      return (
        <>
          <span className="paper__folder-tab">Project</span>
          <div className="paper__sheet">
            <Title pin={pin} />
            <Sections pin={pin} />
          </div>
        </>
      )
    case 'experience':
      return (
        <>
          <p className="paper__kicker paper__kicker--red">Employment record</p>
          <Title pin={pin} />
          <Sections pin={pin} />
        </>
      )
    case 'skill':
      return (
        <>
          <p className="paper__kicker">Skill</p>
          <Title pin={pin} />
          <Sections pin={pin} />
        </>
      )
    case 'contact':
      return (
        <>
          <h2 id="paper-title" className="paper__title">
            {pin.label ?? pin.title}
          </h2>
          <p className="paper__headline">{pin.file.headline}</p>
          <Sections pin={pin} />
        </>
      )
  }
}

function SubjectPage({ pin }: { pin: Pin }) {
  return (
    <>
      <p className="paper__kicker paper__kicker--rule">Subject profile</p>
      <div className="paper__subject">
        <SubjectPhoto />
        <div>
          <p className="paper__field">Name</p>
          <h2 id="paper-title" className="paper__title">
            {subject.name}
          </h2>
          <p className="paper__field">Status</p>
          <p className="paper__value">{subject.title}</p>
          <p className="paper__field">Location</p>
          <p className="paper__value">{subject.location}</p>
          <p className="paper__field">Education</p>
          <p className="paper__value">{subject.education}</p>
        </div>
      </div>
      {pin.file.draft && <DraftNote />}
      <Sections pin={pin} />
      <section className="paper__section">
        <h3>Contact</h3>
        <ContactLinks className="contact-links--paper" />
      </section>
      <div className="paper__stamp" aria-hidden="true">
        Subject
      </div>
    </>
  )
}

function Title({ pin }: { pin: Pin }) {
  return (
    <>
      <h2 id="paper-title" className="paper__title">
        {pin.title}
      </h2>
      <p className="paper__headline">{pin.file.headline}</p>
      {pin.file.draft && <DraftNote />}
      {(pin.file.role || pin.file.period) && (
        <dl className="paper__meta">
          {pin.file.role && (
            <>
              <dt>Role</dt>
              <dd>{pin.file.role}</dd>
            </>
          )}
          {pin.file.period && (
            <>
              <dt>Period</dt>
              <dd>{pin.file.period}</dd>
            </>
          )}
        </dl>
      )}
    </>
  )
}

function DraftNote() {
  return <p className="paper__draft">Placeholder content. Real details coming soon.</p>
}

function Sections({ pin }: { pin: Pin }) {
  const { file } = pin
  const related = connectedPins(pin.id)

  return (
    <>
      <section className="paper__section">
        {file.summary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {file.stack && (
        <section className="paper__section">
          <h3>Stack</h3>
          <ul className="paper__stack">
            {file.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {file.results && (
        <section className="paper__section">
          <h3>Results</h3>
          <ul className="paper__results">
            {file.results.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>
        </section>
      )}

      {file.links && (
        <section className="paper__section">
          <h3>Links</h3>
          <ul className="paper__links">
            {file.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="paper__section">
          <h3>{pin.kind === 'skill' ? 'Used in' : 'Connected'}</h3>
          <ul className="paper__related">
            {related.map((other) => (
              <li key={other.id}>
                <FileLink id={other.id}>{other.kind === 'subject' ? 'About me' : other.title}</FileLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
