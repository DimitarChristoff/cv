import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './scroll'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

// settles the text left to right while the rest flickers through random glyphs, like a dot matrix board updating
const scramble = (el: HTMLElement, delay: number, duration: number) => {
  const text = el.dataset.text ?? ''
  const start = performance.now() + delay
  let frame = 0
  const tick = (now: number) => {
    const progress = Math.min(Math.max((now - start) / duration, 0), 1)
    const settled = Math.floor(progress * text.length)
    let out = text.slice(0, settled)
    for (let i = settled; i < text.length; i++) {
      out += text[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    }
    el.textContent = out
    if (progress < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
  return () => {
    cancelAnimationFrame(frame)
    el.textContent = text
  }
}

export type BoardRow = {
  name: string
  time: string
}

type Props = {
  rows: BoardRow[]
}

const Board = ({ rows }: Props) => {
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const board = boardRef.current
    if (!board || prefersReducedMotion()) return
    let cleanups: (() => void)[] = []
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        cleanups = Array.from(board.querySelectorAll<HTMLElement>('[data-text]')).map((el, index) =>
          scramble(el, 250 + Math.floor(index / 2) * 90, 700),
        )
      },
      { threshold: 0.3 },
    )
    observer.observe(board)
    return () => {
      observer.disconnect()
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <div className="board" ref={boardRef}>
      {/* the animated board is decorative, this list is what assistive tech reads */}
      <ul className="sr-only">
        {rows.map((row) => (
          <li key={row.name}>
            {row.name}, since {row.time}
          </li>
        ))}
      </ul>
      <div aria-hidden="true">
        <div className="board__head">
          <span>Calling at</span>
          <span>From</span>
        </div>
        <ol className="board__rows">
          {rows.map((row) => (
            <li key={row.name} className="board__row">
              <span className="board__station" data-text={row.name.toUpperCase()}>
                {row.name.toUpperCase()}
              </span>
              <span className="board__leader" />
              <span className="board__time" data-text={row.time}>
                {row.time}
              </span>
            </li>
          ))}
        </ol>
        <p className="board__more">…continued……</p>
        <p className="board__service">Platform Engineering · React Service</p>
      </div>
    </div>
  )
}

export default Board
