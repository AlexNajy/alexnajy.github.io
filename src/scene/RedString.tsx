import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { QuadraticBezierCurve3, TubeGeometry, Vector3, type MeshStandardMaterial } from 'three'
import { seededRandom } from './boardSpace'
import type { Emphasis } from './PinnedItem'

interface RedStringProps {
  id: string
  from: [number, number, number]
  to: [number, number, number]
  emphasis: Emphasis
}

const RADIUS = 0.0075
const OPACITY: Record<Emphasis, number> = { lit: 1, normal: 0.9, dim: 0.14 }

export function RedString({ id, from, to, emphasis }: RedStringProps) {
  const materialRef = useRef<MeshStandardMaterial>(null)

  // A quadratic bezier with its control point pulled down gives the sag of
  // a string hanging between two pins. The tube is built along that curve.
  const geometry = useMemo(() => {
    const start = new Vector3(...from)
    const end = new Vector3(...to)
    const sag = start.distanceTo(end) * (0.05 + seededRandom(id)() * 0.05)
    const control = start.clone().lerp(end, 0.5)
    control.y -= sag * 2
    control.z += 0.01
    return new TubeGeometry(new QuadraticBezierCurve3(start, control, end), 64, RADIUS, 6, false)
  }, [id, from, to])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    const material = materialRef.current
    if (!material) return
    const ease = 1 - Math.exp(-delta * 10)
    material.opacity += (OPACITY[emphasis] - material.opacity) * ease
    const glow = emphasis === 'lit' ? 0.7 : 0
    material.emissiveIntensity += (glow - material.emissiveIntensity) * ease
  })

  return (
    <mesh geometry={geometry} castShadow raycast={() => null}>
      <meshStandardMaterial
        ref={materialRef}
        color="#b01c16"
        emissive="#e3140a"
        emissiveIntensity={0}
        roughness={0.7}
        transparent
        opacity={OPACITY.normal}
      />
    </mesh>
  )
}
