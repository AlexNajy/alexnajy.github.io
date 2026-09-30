import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, PerspectiveCamera, Vector3 } from 'three'
import type { Pin } from '../data/types'
import { BOARD, CARD_SIZE, boardToWorld } from './boardSpace'

interface CameraRigProps {
  focus: Pin | null
  reducedMotion: boolean
}

const HOME_MARGIN = 1.04
const FOCUS_MARGIN = 1.5
/** Small cards still get this much board around them, so the pins don't fill the screen. */
const FOCUS_MIN = { width: 3, height: 2 }
/** With the cursor at the edge of the screen, the view slides this fraction of the way toward it. */
const PAN_FRACTION = 0.08

const desired = new Vector3()

/**
 * Moves the camera every frame instead of animating it with React state.
 * It frames the whole board at home, or zooms onto one card when it's
 * opened, and pans a little toward the cursor.
 */
export function CameraRig({ focus, reducedMotion }: CameraRigProps) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)

  useFrame((state, delta) => {
    if (!(camera instanceof PerspectiveCamera)) return
    const aspect = size.width / size.height
    const halfFov = MathUtils.degToRad(camera.fov / 2)
    // Distance at which a rectangle of this size exactly fills the view.
    const fitDistance = (width: number, height: number) =>
      Math.max(height / 2, width / 2 / aspect) / Math.tan(halfFov)

    let x = 0
    let y = 0
    let z = fitDistance(BOARD.width * HOME_MARGIN, BOARD.height * HOME_MARGIN)

    if (focus) {
      const [cardW, cardH] = CARD_SIZE[focus.kind]
      ;[x, y] = boardToWorld(focus)
      z = fitDistance(Math.max(cardW * FOCUS_MARGIN, FOCUS_MIN.width), Math.max(cardH * FOCUS_MARGIN, FOCUS_MIN.height))
    } else if (!reducedMotion) {
      // Slide the whole view, like leaning to one side while facing the
      // board. The camera always faces straight ahead, so the board never tilts.
      const halfHeight = z * Math.tan(halfFov)
      x += state.pointer.x * halfHeight * aspect * PAN_FRACTION
      y += state.pointer.y * halfHeight * PAN_FRACTION
    }

    // Frame-rate independent easing. Reduced motion snaps straight there.
    const ease = reducedMotion ? 1 : 1 - Math.exp(-delta * 3)
    camera.position.lerp(desired.set(x, y, z), ease)
  })

  return null
}
