/**
 * Where a card was on screen when it was clicked, so the paper view can
 * start from exactly that spot and look like it was lifted off the board.
 */
export interface CardOrigin {
  id: string
  /** Centre of the card in viewport pixels. */
  x: number
  y: number
  /** Width of the card on screen, in pixels. */
  width: number
  /** The card's tilt on the board, in degrees. */
  rotate: number
}
