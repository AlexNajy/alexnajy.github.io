import { subject } from '../data/case'
import { ContactLinks } from './ContactLinks'

// The recruiter path: name, title and every contact link, always on screen
// as plain HTML, so nobody has to explore the board to find them.
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__who">
        <h1 className="site-header__name">{subject.name}</h1>
        <p className="site-header__title">{subject.title}</p>
      </div>
      <ContactLinks />
    </header>
  )
}
