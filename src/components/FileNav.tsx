import { kindLabels, kindOrder, pinsByKind } from '../lib/graph'
import { FileLink } from './FileLink'

interface FileNavProps {
  onHover: (id: string | null) => void
}

// A plain list of every file. It stays invisible until it gets keyboard
// focus, so keyboard and screen reader users can reach everything without
// a visible menu over the board.
export function FileNav({ onHover }: FileNavProps) {
  return (
    <nav aria-label="All files" className="file-nav">
      {kindOrder.map((kind) => (
        <section key={kind}>
          <h2 className="file-nav__heading">{kindLabels[kind]}</h2>
          <ul>
            {pinsByKind(kind).map((pin) => (
              <li key={pin.id}>
                <FileLink id={pin.id} onHover={onHover} className="file-nav__link">
                  {pin.kind === 'subject' ? 'About me' : pin.title}
                </FileLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  )
}
