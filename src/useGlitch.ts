import { useEffect, useRef } from 'react'
import type { Glitch } from './glitch'

// the glitch module is only fetched where SVG filters work and motion is welcome; turning reduced motion on later
// unmounts it again
export const useGlitch = () => {
  const glitch = useRef<Glitch | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let cancelled = false

    const mount = () => {
      if (glitch.current || reduce.matches || !('SVGFEDisplacementMapElement' in window)) return
      import('./glitch').then(({ mountGlitch }) => {
        const nav = document.querySelector<HTMLElement>('.nav')
        const navTarget = document.querySelector<HTMLElement>('.nav__inner')
        const hero = document.querySelector<HTMLElement>('.hero')
        const heroTarget = document.querySelector<HTMLElement>('.hero__inner')
        if (cancelled || reduce.matches || glitch.current || !nav || !navTarget || !hero || !heroTarget) return
        glitch.current = mountGlitch({ nav, navTarget, hero, heroTarget, lockup: document.querySelector('.lockup') })
        // warm the set up once the fonts are in and the page has settled (the background compiles its shaders on
        // load), so the arrival burst is actually seen
        const whenIdle = (fn: () => void) =>
          'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 600)
        document.fonts.ready.then(() => whenIdle(() => glitch.current?.arrival()))
      })
    }

    const onPreferenceChange = () => {
      if (reduce.matches) {
        glitch.current?.destroy()
        glitch.current = null
      } else {
        mount()
      }
    }

    mount()
    reduce.addEventListener('change', onPreferenceChange)
    return () => {
      cancelled = true
      reduce.removeEventListener('change', onPreferenceChange)
      glitch.current?.destroy()
      glitch.current = null
    }
  }, [])

  return glitch
}
