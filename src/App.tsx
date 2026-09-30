import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Suspense, lazy, useEffect, useState } from 'react'
import { Dossier } from './components/Dossier'
import { MobileStack } from './components/MobileStack'
import { SceneBoundary } from './components/SceneBoundary'
import { FileNav } from './components/FileNav'
import { subject } from './data/case'
import type { CardOrigin } from './lib/cardOrigin'
import { pinById } from './lib/graph'
import { detectQuality, useIsMobile, usePrefersReducedMotion } from './lib/media'
import { closeFile, openFile, useOpenFileId } from './lib/router'

// The 3D board is its own chunk. The shell, index and dossiers render
// straight away, and phones never download three.js at all.
const BoardScene = lazy(() => import('./scene/BoardScene'))

const quality = detectQuality()

export default function App() {
  const isMobile = useIsMobile()
  const reducedMotion = usePrefersReducedMotion()
  const openId = useOpenFileId()
  const openPin = openId ? pinById.get(openId) : undefined
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [origin, setOrigin] = useState<CardOrigin | null>(null)

  const openFromBoard = (id: string, from: CardOrigin) => {
    setOrigin(from)
    openFile(id)
  }

  useEffect(() => {
    document.title = openPin && openPin.kind !== 'subject'
      ? `${openPin.title} · Case file · ${subject.name}`
      : `${subject.name} · Portfolio`
  }, [openPin])

  return (
    <MotionConfig reducedMotion="user">
      {isMobile ? (
        <MobileStack />
      ) : (
        <>
          <FileNav onHover={setHoveredId} />
          <main className="stage" aria-label="Board">
            <SceneBoundary fallback={<StageMessage text="The board couldn't load on this device. Press Tab to browse the files." />}>
              <Suspense fallback={<StageMessage text="Developing photographs…" />}>
                <BoardScene
                  hoveredId={hoveredId}
                  openId={openPin?.id ?? null}
                  onHover={setHoveredId}
                  onOpen={openFromBoard}
                  reducedMotion={reducedMotion}
                  quality={quality}
                />
              </Suspense>
            </SceneBoundary>
          </main>
        </>
      )}

      <AnimatePresence>
        {openPin && (
          <Dossier
            key={openPin.id}
            pin={openPin}
            // Links in the page and the file list open files without a card
            // to fly from, so only use the origin if it belongs to this file.
            origin={origin?.id === openPin.id ? origin : null}
            onClose={closeFile}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}

function StageMessage({ text }: { text: string }) {
  return (
    <div className="stage__message">
      <p>{text}</p>
    </div>
  )
}
