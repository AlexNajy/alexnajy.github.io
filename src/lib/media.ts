import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )
}

export const useIsMobile = () => useMediaQuery('(max-width: 820px)')
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

export type Quality = 'high' | 'low'

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number
}

// A rough guess from hardware hints. Low quality means smaller shadow maps,
// a lower pixel ratio and no postprocessing.
export function detectQuality(): Quality {
  const nav = navigator as NavigatorWithMemory
  const cores = nav.hardwareConcurrency ?? 8
  const memory = nav.deviceMemory ?? 8
  return cores <= 4 || memory <= 4 ? 'low' : 'high'
}
