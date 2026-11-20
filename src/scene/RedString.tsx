import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { QuadraticBezierCurve3, TubeGeometry, Vector3, type Mesh, type MeshStandardMaterial } from 'three'
import { seededRandom } from './boardSpace'

interface RedStringProps {
  id: string
  from: [number, number, number]
  to: [number, number, number]
  /** Strings stay off the board until one of their two cards is in focus. */
  shown: boolean
}

const RADIUS = 0.011

export function RedString({ id, from, to, shown }: RedStringProps) {
  const meshRef = useRef<Mesh>(null)
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
    const mesh = meshRef.current
    const material = materialRef.current
    if (!mesh || !material) return
    material.opacity += ((shown ? 1 : 0) - material.opacity) * (1 - Math.exp(-delta * 10))
    // A transparent mesh still writes to the shadow map, so a faded-out
    // string has to be hidden outright or its shadow stays on the cork.
    mesh.visible = material.opacity > 0.02
  })

  return (
    <mesh ref={meshRef} geometry={geometry} visible={false} castShadow raycast={() => null}>
      <meshStandardMaterial
        ref={materialRef}
        color="#c9241a"
        emissive="#e3140a"
        emissiveIntensity={0.55}
        roughness={0.7}
        transparent
        opacity={0}
      />
    </mesh>
  )
}
