import { contact } from '../data/case'

const resumeHref = `${import.meta.env.BASE_URL}${contact.resume}`

export function ContactLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`contact-links ${className}`} aria-label="Contact">
      <li>
        <a className="contact-link contact-link--primary" href={resumeHref} target="_blank" rel="noreferrer">
          Resume
        </a>
      </li>
      <li>
        <a className="contact-link" href={`mailto:${contact.email}`}>
          Email
        </a>
      </li>
      <li>
        <a className="contact-link" href={contact.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </li>
      <li>
        <a className="contact-link" href={contact.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </li>
    </ul>
  )
}
