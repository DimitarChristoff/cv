import { useEffect } from 'react'

// one passive scroll/resize listener, throttled to animation frames, shared by every subscriber
const subscribers = new Set<() => void>()
let queued = false

const flush = () => {
  queued = false
  subscribers.forEach((fn) => fn())
}

const schedule = () => {
  if (!queued) {
    queued = true
    requestAnimationFrame(flush)
  }
}

export const subscribeScroll = (fn: () => void) => {
  if (!subscribers.size) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  }
  subscribers.add(fn)
  fn()
  return () => {
    subscribers.delete(fn)
    if (!subscribers.size) {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// fades [data-reveal] elements in the first time they scroll into view
export const useReveal = () => {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('in'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
