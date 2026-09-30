import { useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Pin } from '../data/types'
import { CARD_SIZE } from './boardSpace'
import { drawCard, fontsReady, photoReady } from './cardArt'

const PIXELS_PER_UNIT = 440

export function useCardTexture(pin: Pin): CanvasTexture {
  const gl = useThree((state) => state.gl)

  const [texture] = useState(() => {
    const [w, h] = CARD_SIZE[pin.kind]
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(w * PIXELS_PER_UNIT)
    canvas.height = Math.round(h * PIXELS_PER_UNIT)
    const tex = new CanvasTexture(canvas)
    // Canvas pixels are sRGB; without this three would treat them as linear
    // and the colours would come out washed out.
    tex.colorSpace = SRGBColorSpace
    // Cards are seen at an angle when the camera drifts; anisotropic
    // filtering keeps the typed text sharp instead of smearing it.
    tex.anisotropy = gl.capabilities.getMaxAnisotropy()
    return tex
  })

  useEffect(() => {
    let cancelled = false
    // Draw right away with fallback fonts, then again once the web fonts
    // (and the photo, for the subject card) have arrived.
    const paint = () => {
      if (!cancelled) paintCard(texture, pin)
    }
    paint()
    Promise.all([fontsReady, pin.kind === 'subject' ? photoReady : null]).then(paint)

    return () => {
      cancelled = true
    }
  }, [pin, texture])

  useEffect(() => () => texture.dispose(), [texture])

  return texture
}

function paintCard(texture: CanvasTexture, pin: Pin) {
  const canvas = texture.image as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  drawCard(ctx, canvas.width, canvas.height, pin)
  // Tells three to re-upload the canvas to the GPU on the next render.
  texture.needsUpdate = true
}
