import type { MouseEvent, ReactNode } from 'react'
import { fileHref, openFile } from '../lib/router'

interface FileLinkProps {
  id: string
  className?: string
  children: ReactNode
  onHover?: (id: string | null) => void
}

// A real link (so it can be opened in a new tab, copied, or read by a screen
// reader) that routes in-app on a plain click.
export function FileLink({ id, className, children, onHover }: FileLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    openFile(id)
  }

  return (
    <a
      href={fileHref(id)}
      className={className}
      onClick={handleClick}
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(id)}
      onBlur={() => onHover?.(null)}
    >
      {children}
    </a>
  )
}
