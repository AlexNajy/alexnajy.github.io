import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useRef } from 'react'
import { DoubleSide, Vector3, type Group, type MeshStandardMaterial } from 'three'
import type { Pin } from '../data/types'
import type { CardOrigin } from '../lib/cardOrigin'
import { CARD_SIZE, CARD_Z, PIN_HEAD_Z, boardToWorld, hashString, pinOffsets, tiltRadians } from './boardSpace'
import { Pushpin } from './Pushpin'
import { useCardTexture } from './useCardTexture'

export type Emphasis = 'lit' | 'dim' | 'normal'

interface PinnedItemProps {
  pin: Pin
  emphasis: Emphasis
  lifted: boolean
  /** The card is open as a page, so it's off the board and only its pin remains. */
  pickedUp: boolean
  onHover: (id: string | null) => void
  onOpen: (id: string, origin: CardOrigin) => void
}

const DIM = 0.32
const LIFT = 0.06

export function PinnedItem({ pin, emphasis, lifted, pickedUp, onHover, onOpen }: PinnedItemProps) {
  const texture = useCardTexture(pin)
  const liftRef = useRef<Group>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  const [width, height] = CARD_SIZE[pin.kind]
  const [x, y] = boardToWorld(pin)

  // Animate towards the target each frame instead of re-rendering React.
  // 1 - exp(-dt * speed) gives the same easing at 30fps and 144fps.
  useFrame((_, delta) => {
    const ease = 1 - Math.exp(-delta * 10)
    const material = materialRef.current
    if (material) {
      const target = emphasis === 'dim' ? DIM : 1
      material.color.setScalar(material.color.r + (target - material.color.r) * ease)
    }
    const group = liftRef.current
    if (group) {
      group.position.z += ((lifted ? LIFT : 0) - group.position.z) * ease
    }
  })

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    // Only the front-most card under the cursor should react.
    event.stopPropagation()
    onHover(pin.id)
    document.body.style.cursor = 'pointer'
  }

  const handleOut = () => {
    onHover(null)
    document.body.style.cursor = ''
  }

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    // Project the card's centre and its right edge onto the screen to find
    // where it is and how wide it looks, so the page can grow out of it.
    const card = event.object
    const toScreen = (local: Vector3) => {
      const ndc = card.localToWorld(local).project(event.camera)
      return { x: ((ndc.x + 1) / 2) * window.innerWidth, y: ((1 - ndc.y) / 2) * window.innerHeight }
    }
    const centre = toScreen(new Vector3(0, 0, 0))
    const edge = toScreen(new Vector3(width / 2, 0, 0))
    onOpen(pin.id, {
      id: pin.id,
      x: centre.x,
      y: centre.y,
      width: Math.hypot(edge.x - centre.x, edge.y - centre.y) * 2,
      rotate: (-tiltRadians(pin) * 180) / Math.PI,
    })
  }

  return (
    <group position={[x, y, CARD_Z]} rotation-z={tiltRadians(pin)}>
      <group ref={liftRef}>
        <mesh
          visible={!pickedUp}
          castShadow
          receiveShadow
          onPointerOver={handleOver}
          onPointerOut={handleOut}
          onClick={handleClick}
        >
          <planeGeometry args={[width, height]} />
          {/* A plane only renders its front face into the shadow map by
              default, which faces away from the light. DoubleSide fixes it.
              alphaTest cuts the folder tab shape out of its rectangle, and
              three carries it over to the shadow so the shadow has a tab too. */}
          <meshStandardMaterial
            ref={materialRef}
            map={texture}
            roughness={0.88}
            alphaTest={0.5}
            shadowSide={DoubleSide}
          />
        </mesh>
        {pinOffsets(pin.kind).map(([pinX, pinY]) => (
          <Pushpin
            key={`${pinX},${pinY}`}
            position={[pinX, pinY, PIN_HEAD_Z]}
            color={pin.kind === 'subject' ? '#b3261e' : pinColor(pin.id)}
            dim={emphasis === 'dim'}
          />
        ))}
      </group>
    </group>
  )
}

const PIN_COLORS = ['#b3261e', '#c2872a', '#2f5d8a', '#3d7a4a']

function pinColor(id: string) {
  return PIN_COLORS[hashString(id) % PIN_COLORS.length]
}
