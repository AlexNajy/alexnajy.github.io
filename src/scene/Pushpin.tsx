import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { MeshStandardMaterial } from 'three'
import { PIN_HEAD_Z } from './boardSpace'

interface PushpinProps {
  position: [number, number, number]
  color: string
  dim: boolean
}

// position is the centre of the head; the needle runs back into the board.
export function Pushpin({ position, color, dim }: PushpinProps) {
  const headRef = useRef<MeshStandardMaterial>(null)

  useFrame((_, delta) => {
    const material = headRef.current
    if (!material) return
    const target = dim ? 0.35 : 1
    material.opacity += (target - material.opacity) * (1 - Math.exp(-delta * 10))
  })

  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.042, 20, 14]} />
        <meshStandardMaterial ref={headRef} color={color} roughness={0.28} metalness={0.05} transparent />
      </mesh>
      <mesh castShadow position={[0, 0, -PIN_HEAD_Z / 2]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.006, 0.006, PIN_HEAD_Z, 6]} />
        <meshStandardMaterial color="#b9bcc0" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  )
}
