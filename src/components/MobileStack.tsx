import { subject } from '../data/case'
import { kindLabels, kindOrder, pinsByKind } from '../lib/graph'
import { ContactLinks } from './ContactLinks'
import { FileLink } from './FileLink'
import { SubjectPhoto } from './SubjectPhoto'

// Small screens skip WebGL entirely and get the same data as a stack of
// case files. The 3D chunk is never downloaded here.
export function MobileStack() {
  return (
    <main className="mobile-stack">
      <header className="mobile-subject">
        <p className="eyebrow">Case file · Subject</p>
        <div className="mobile-subject__card">
          <SubjectPhoto className="mobile-subject__photo" />
          <div>
            <h1 className="mobile-subject__name">{subject.name}</h1>
            <p>{subject.title}</p>
            <p className="mobile-subject__detail">{subject.location}</p>
            <p className="mobile-subject__detail">{subject.education}</p>
          </div>
        </div>
        <ContactLinks />
        <FileLink id="subject" className="mobile-subject__more">
          Open full profile →
        </FileLink>
      </header>

      <nav id="case-index" aria-label="Case index">
        {kindOrder
          .filter((kind) => kind !== 'subject')
          .map((kind) => (
            <section key={kind} className="mobile-group">
              <h2 className="mobile-group__heading">{kindLabels[kind]}</h2>
              <ul className={`mobile-group__list mobile-group__list--${kind}`}>
                {pinsByKind(kind).map((pin) => (
                  <li key={pin.id}>
                    <FileLink id={pin.id} className={`mobile-file mobile-file--${pin.kind}`}>
                      <span className="mobile-file__title">{pin.title}</span>
                      {pin.kind !== 'skill' && <span className="mobile-file__headline">{pin.file.headline}</span>}
                    </FileLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </nav>
    </main>
  )
}
