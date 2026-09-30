import { useEffect, useState } from 'react'
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'
import { BOARD, seededRandom } from './boardSpace'

const FRAME = 0.22
const FRAME_DEPTH = 0.14

type Vec3 = [number, number, number]

// Procedural cork: a warm base covered in thousands of tiny granules.
// Generated once at runtime, so there's no texture file to download or license.
function createCorkTexture(): CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const rand = seededRandom('cork')

  ctx.fillStyle = '#a87b4c'
  ctx.fillRect(0, 0, size, size)

  const tones = ['#7a5230', '#c49463', '#8f6339', '#d4a877', '#5f3e22', '#b88656']
  for (let i = 0; i < 26000; i++) {
    ctx.fillStyle = tones[Math.floor(rand() * tones.length)]
    ctx.globalAlpha = 0.35 + rand() * 0.5
    const r = 0.5 + rand() * rand() * 3.2
    ctx.beginPath()
    ctx.ellipse(rand() * size, rand() * size, r, r * (0.6 + rand() * 0.6), rand() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.repeat.set(5, 3.1)
  texture.anisotropy = 8
  return texture
}

const frameWidth = BOARD.width + FRAME * 2
const frameBars: { position: Vec3; size: Vec3 }[] = [
  { position: [0, BOARD.height / 2 + FRAME / 2, 0], size: [frameWidth, FRAME, FRAME_DEPTH] },
  { position: [0, -BOARD.height / 2 - FRAME / 2, 0], size: [frameWidth, FRAME, FRAME_DEPTH] },
  { position: [-BOARD.width / 2 - FRAME / 2, 0, 0], size: [FRAME, BOARD.height, FRAME_DEPTH] },
  { position: [BOARD.width / 2 + FRAME / 2, 0, 0], size: [FRAME, BOARD.height, FRAME_DEPTH] },
]

export function Corkboard() {
  const [cork] = useState(createCorkTexture)
  useEffect(() => () => cork.dispose(), [cork])

  const { width, height } = BOARD

  return (
    <group>
      {/* The wall. It only exists to catch the spotlight's falloff. */}
      <mesh position={[0, 0, -0.08]} receiveShadow>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#2a211b" roughness={1} />
      </mesh>

      <mesh receiveShadow>
        <planeGeometry args={[width, height]} />
        {/* The colour map doubles as a bump map: darker granules read as
            dents, which gives the cork its grain under a raking light. */}
        <meshStandardMaterial map={cork} bumpMap={cork} bumpScale={1.2} roughness={0.95} />
      </mesh>

      {frameBars.map(({ position, size }, i) => (
        <mesh key={i} position={position} castShadow receiveShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color="#4a2f1c" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}
