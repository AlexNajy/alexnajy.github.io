import { Canvas } from '@react-three/fiber'
import { EffectComposer, Noise, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { connections, pins } from '../data/case'
import { highlightSet, pinById } from '../lib/graph'
import type { CardOrigin } from '../lib/cardOrigin'
import type { Quality } from '../lib/media'
import { stringEnds } from './boardSpace'
import { CameraRig } from './CameraRig'
import { Corkboard } from './Corkboard'
import { PinnedItem, type Emphasis } from './PinnedItem'
import { RedString } from './RedString'

export interface BoardSceneProps {
  hoveredId: string | null
  openId: string | null
  onHover: (id: string | null) => void
  onOpen: (id: string, origin: CardOrigin) => void
  reducedMotion: boolean
  quality: Quality
}

// Anchors are static, so compute them once. Stable arrays also mean each
// string builds its tube geometry exactly once.
const strings = connections.map(([a, b]) => {
  const [from, to] = stringEnds(pinById.get(a)!, pinById.get(b)!)
  return { a, b, from, to }
})

export default function BoardScene({ hoveredId, openId, onHover, onOpen, reducedMotion, quality }: BoardSceneProps) {
  const focusId = hoveredId ?? openId
  const lit = highlightSet(focusId)
  const high = quality === 'high'

  const emphasisFor = (id: string): Emphasis => (!lit ? 'normal' : lit.has(id) ? 'lit' : 'dim')

  return (
    <Canvas
      // 'percentage' is PCF filtering; shadow.radius below softens it.
      shadows="percentage"
      dpr={high ? [1, 2] : [1, 1.25]}
      camera={{ fov: 35, near: 0.1, far: 80, position: [0, 0, 14] }}
      gl={{ antialias: !high, powerPreference: 'high-performance' }}
      onPointerMissed={() => onHover(null)}
    >
      <color attach="background" args={['#101114']} />

      {/* A cool, dim fill. It keeps the corners readable and tints the
          shadows blue-grey, which is what stops the scene reading as one
          flat brown: warm light, cool shadow. */}
      <ambientLight intensity={0.55} color="#c9d6ea" />
      {/* The desk lamp. penumbra 1 fades the cone smoothly from its centre,
          so the board is brightest around the profile and falls off toward
          the edges. decay 0 keeps intensity independent of distance, which
          is easier to tune than physical falloff for one stylised light. */}
      <spotLight
        position={[-1.6, 2.6, 9.5]}
        angle={0.78}
        penumbra={1}
        intensity={3.1}
        decay={0}
        color="#fff0d9"
        castShadow
        shadow-mapSize={high ? [2048, 2048] : [1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={high ? 6 : 3}
        shadow-camera-near={4}
        shadow-camera-far={16}
      />

      <Corkboard />

      {pins.map((pin) => (
        <PinnedItem
          key={pin.id}
          pin={pin}
          emphasis={emphasisFor(pin.id)}
          lifted={pin.id === hoveredId}
          pickedUp={pin.id === openId}
          onHover={onHover}
          onOpen={onOpen}
        />
      ))}

      {strings.map(({ a, b, from, to }) => (
        <RedString
          key={`${a}-${b}`}
          id={`${a}-${b}`}
          from={from}
          to={to}
          shown={a === focusId || b === focusId}
        />
      ))}

      <CameraRig focus={openId ? (pinById.get(openId) ?? null) : null} reducedMotion={reducedMotion} />

      {high && (
        // The composer renders to its own target, so MSAA happens here
        // (multisampling) rather than on the canvas.
        <EffectComposer multisampling={4}>
          {/* Same curve the renderer uses on the low-quality path, so both
              paths have the same contrast. */}
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Noise opacity={0.03} premultiply />
        </EffectComposer>
      )}
    </Canvas>
  )
}
