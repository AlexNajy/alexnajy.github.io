import { useSyncExternalStore } from 'react'

// Hash routing, because GitHub Pages can't rewrite paths to index.html.
// A file lives at #/file/<id>. Everything else counts as the home screen.

const FILE_ROUTE = /^#\/file\/([\w-]+)$/
const ROUTE_EVENT = 'routechange'

interface RouteState {
  inApp?: boolean
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  window.addEventListener('popstate', onChange)
  window.addEventListener(ROUTE_EVENT, onChange)
  return () => {
    window.removeEventListener('hashchange', onChange)
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(ROUTE_EVENT, onChange)
  }
}

const getHash = () => window.location.hash

export function useOpenFileId(): string | null {
  const hash = useSyncExternalStore(subscribe, getHash)
  return FILE_ROUTE.exec(hash)?.[1] ?? null
}

export function fileHref(id: string) {
  return `#/file/${id}`
}

// pushState doesn't fire hashchange, so we announce the change ourselves.
function notify() {
  window.dispatchEvent(new Event(ROUTE_EVENT))
}

function currentState(): RouteState | null {
  return history.state as RouteState | null
}

export function openFile(id: string) {
  if (window.location.hash === fileHref(id)) return
  // Switching between files replaces the entry, so one Back press always
  // returns home instead of stepping through every file you looked at.
  const alreadyInFile = FILE_ROUTE.test(window.location.hash) && currentState()?.inApp
  const method = alreadyInFile ? 'replaceState' : 'pushState'
  history[method]({ inApp: true } satisfies RouteState, '', fileHref(id))
  notify()
}

export function closeFile() {
  if (currentState()?.inApp) {
    history.back()
    return
  }
  // Arrived from a shared link: there's nothing of ours to go back to.
  history.replaceState(null, '', window.location.pathname + window.location.search)
  notify()
}
