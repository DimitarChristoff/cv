// CRT signal loss for the nav and a quieter signal tear for the hero. Loaded lazily by useGlitch, only where SVG
// filters work and the visitor has not asked for reduced motion.
//
// Each glitched element gets an SVG filter while a burst plays (and none at rest, so text stays crisp and idle cost
// is zero): stepped noise bands shift sideways, and amber / slate ghosts split off either side, taken from the theme's
// --streak and --ink. A sibling overlay adds scanlines, snow, a rolling hum bar and amber tear lines.

const SVG_NS = 'http://www.w3.org/2000/svg'
// bursts advance in steps, like a flap board, rather than every frame
const STEP_MS = 1000 / 12

type Kind = {
  roll: boolean
  snow: boolean
}

type Burst = {
  duration: number
  gain: number
  kind?: Partial<Kind>
}

type ChannelOptions = {
  id: string
  // the element the filter is applied to
  target: HTMLElement
  // a positioned element the overlay is added to
  host: HTMLElement
  // vertical frequency of the noise, which sets the height of the torn bands
  frequency: number
  // at full gain: px of sideways tear, px of ghost split, px of vertical hold slip
  shift: number
  split: number
  hold: number
  tears: number
}

const svgElement = (name: string, attrs: Record<string, string>) => {
  const node = document.createElementNS(SVG_NS, name)
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value))
  return node
}

const toRgb = (hex: string) => {
  const n = parseInt(hex.trim().replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => (v / 255).toFixed(3))
}

// paints every opaque pixel in one colour, at the given opacity
const tint = ([r, g, b]: string[], alpha: number) =>
  `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 ${alpha.toFixed(2)} 0`

const createChannel = (svg: SVGSVGElement, o: ChannelOptions) => {
  const filter = svgElement('filter', {
    id: o.id,
    x: '-4%',
    y: '-30%',
    width: '108%',
    height: '160%',
    'color-interpolation-filters': 'sRGB',
  })
  // noise that only varies vertically, quantised so most bands sit still and a few tear
  const turbulence = svgElement('feTurbulence', {
    type: 'fractalNoise',
    baseFrequency: `0 ${o.frequency}`,
    numOctaves: '1',
    seed: '1',
    result: 'noise',
  })
  const bands = svgElement('feComponentTransfer', { in: 'noise', result: 'bands' })
  const bandsX = svgElement('feFuncR', { type: 'discrete', tableValues: '0.5' })
  bands.append(
    bandsX,
    svgElement('feFuncG', { type: 'discrete', tableValues: '0.5' }),
    svgElement('feFuncA', { type: 'discrete', tableValues: '1' }),
  )
  const displace = svgElement('feDisplacementMap', {
    in: 'SourceGraphic',
    in2: 'bands',
    scale: '0',
    xChannelSelector: 'R',
    yChannelSelector: 'G',
    result: 'torn',
  })
  const warm = svgElement('feColorMatrix', { in: 'torn', type: 'matrix', values: '', result: 'warm' })
  const warmShift = svgElement('feOffset', { in: 'warm', dx: '0', dy: '0', result: 'warmShift' })
  const cool = svgElement('feColorMatrix', { in: 'torn', type: 'matrix', values: '', result: 'cool' })
  const coolShift = svgElement('feOffset', { in: 'cool', dx: '0', dy: '0', result: 'coolShift' })
  const merge = svgElement('feMerge', {})
  ;['coolShift', 'warmShift', 'torn'].forEach((name) => merge.append(svgElement('feMergeNode', { in: name })))
  filter.append(turbulence, bands, displace, warm, warmShift, cool, coolShift, merge)
  svg.append(filter)

  const overlay = document.createElement('div')
  overlay.className = 'crt'
  overlay.setAttribute('aria-hidden', 'true')
  overlay.innerHTML = '<div class="crt__scan"></div><div class="crt__snow"></div><div class="crt__bar"></div>'
  const tears = Array.from({ length: o.tears }, () => {
    const line = document.createElement('div')
    line.className = 'crt__tear'
    overlay.append(line)
    return line
  })
  o.host.append(overlay)

  let warmRgb = toRgb('#eda234')
  let coolRgb = toRgb('#2e3c4b')
  let frame = 0
  let lastFrame = 0
  let start = 0
  let duration = 0
  let gain = 0
  let lastStep = -1
  let amount = 0
  let jitter = 0
  let hold = 0
  let kind: Kind = { roll: false, snow: false }
  let calming = false
  let calmFrom = 0
  let calmStart = 0
  let peak: (() => void) | null = null

  const readColours = () => {
    const styles = getComputedStyle(document.documentElement)
    warmRgb = toRgb(styles.getPropertyValue('--streak'))
    coolRgb = toRgb(styles.getPropertyValue('--ink'))
  }

  const reset = () => {
    amount = 0
    o.target.style.filter = ''
    if (o.hold) o.target.style.transform = ''
    overlay.style.setProperty('--crt', '0')
    overlay.style.setProperty('--snow', '0')
    overlay.style.setProperty('--bar', '0')
    tears.forEach((line) => line.style.setProperty('--o', '0'))
  }

  // reroll the torn bands, tear lines and snow; only on a new step
  const reroll = () => {
    // roughly a third of the bands tear, each by its own amount
    const table = Array.from({ length: 10 }, () =>
      Math.random() < 0.32 ? (0.12 + Math.random() * 0.76).toFixed(2) : '0.5',
    ).join(' ')
    bandsX.setAttribute('tableValues', table)
    turbulence.setAttribute('seed', String(1 + Math.floor(Math.random() * 999)))
    jitter = Math.random()
    hold = kind.roll ? (Math.random() - 0.5) * 2 * o.hold : 0
    tears.forEach((line) => {
      line.style.setProperty('--y', `${(Math.random() * 100).toFixed(1)}%`)
      line.style.setProperty('--x', `${(Math.random() * 60 - 10).toFixed(1)}%`)
      line.style.setProperty('--w', `${(20 + Math.random() * 50).toFixed(1)}%`)
      line.style.setProperty('--o', Math.random() < 0.55 ? '1' : '0')
    })
    overlay.style.setProperty('--snow-x', `${Math.floor(Math.random() * 160)}px`)
    overlay.style.setProperty('--snow-y', `${Math.floor(Math.random() * 160)}px`)
  }

  const paint = (a: number, step: boolean, progress: number) => {
    if (a <= 0.002) {
      reset()
      return
    }
    amount = a
    o.target.style.filter = `url(#${o.id})`
    if (step) reroll()
    displace.setAttribute('scale', (o.shift * a).toFixed(1))
    warmShift.setAttribute('dx', (o.split * a * (0.7 + jitter * 0.6)).toFixed(1))
    coolShift.setAttribute('dx', (-o.split * a * (0.5 + jitter * 0.5)).toFixed(1))
    warm.setAttribute('values', tint(warmRgb, 0.85 * a))
    cool.setAttribute('values', tint(coolRgb, 0.55 * a))
    if (o.hold) o.target.style.transform = hold ? `translateY(${(hold * a).toFixed(1)}px)` : ''
    overlay.style.setProperty('--crt', a.toFixed(3))
    overlay.style.setProperty('--snow', kind.snow ? a.toFixed(3) : '0')
    overlay.style.setProperty('--bar', kind.roll ? a.toFixed(3) : '0')
    overlay.style.setProperty('--bar-y', `${(-30 + progress * 160).toFixed(1)}%`)
  }

  const finish = () => {
    cancelAnimationFrame(frame)
    frame = 0
    lastFrame = 0
    calming = false
    // a theme swap waiting on an interrupted burst still happens
    peak?.()
    peak = null
    reset()
  }

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    // a long stall (the page busy elsewhere) pauses the burst rather than letting it lapse unseen
    if (lastFrame && now - lastFrame > STEP_MS * 2) start += now - lastFrame - STEP_MS
    lastFrame = now
    // tuning in: fade smoothly out of whatever the burst was doing
    if (calming) {
      const a = calmFrom * (1 - (now - calmStart) / 220)
      if (a <= 0) finish()
      else paint(a, false, 1)
      return
    }
    const elapsed = now - start
    if (peak && elapsed >= Math.min(90, duration * 0.4)) {
      peak()
      peak = null
      readColours()
    }
    const p = elapsed / duration
    if (p >= 1) {
      finish()
      return
    }
    const step = Math.floor(elapsed / STEP_MS)
    if (step === lastStep) return
    lastStep = step
    // attack over the first 10%, hold to 40%, then a linear decay
    const envelope = p < 0.1 ? p / 0.1 : p < 0.4 ? 1 : 1 - (p - 0.4) / 0.6
    paint(envelope * gain, true, p)
  }

  return {
    fire: ({ duration: length, gain: strength, kind: type }: Burst, onPeak?: () => void) => {
      peak?.()
      readColours()
      kind = { roll: false, snow: false, ...type }
      start = performance.now()
      duration = length
      gain = strength
      lastStep = -1
      calming = false
      peak = onPeak ?? null
      if (!frame) {
        lastFrame = start
        frame = requestAnimationFrame(tick)
      }
    },
    calm: () => {
      if (!frame || calming) return
      calming = true
      calmFrom = amount
      calmStart = performance.now()
    },
    destroy: () => {
      finish()
      overlay.remove()
      filter.remove()
    },
  }
}

type Elements = {
  nav: HTMLElement
  navTarget: HTMLElement
  hero: HTMLElement
  heroTarget: HTMLElement
  lockup: HTMLElement | null
}

export const mountGlitch = ({ nav, navTarget, hero, heroTarget, lockup }: Elements) => {
  const svg = svgElement('svg', { width: '0', height: '0', 'aria-hidden': 'true', focusable: 'false' }) as SVGSVGElement
  svg.style.position = 'absolute'
  document.body.append(svg)

  const navChannel = createChannel(svg, {
    id: 'glitch-nav',
    target: navTarget,
    host: nav,
    frequency: 0.07,
    shift: 26,
    split: 4,
    hold: 5,
    tears: 2,
  })
  // the hero tears more gently than the nav
  const heroChannel = createChannel(svg, {
    id: 'glitch-hero',
    target: heroTarget,
    host: hero,
    frequency: 0.03,
    shift: 18,
    split: 2.5,
    hold: 0,
    tears: 3,
  })

  // nav: bursts at uneven intervals, like an old set losing the signal. Sometimes it stutters straight into another,
  // sometimes it holds for a long while
  const gap = () => {
    const r = Math.random()
    if (r < 0.22) return 120 + Math.random() * 480
    if (r < 0.85) return 2200 + Math.random() * 6000
    return 9000 + Math.random() * 9000
  }
  const navBurst = (): Burst => ({
    duration: 120 + Math.random() * 420,
    gain: 0.45 + Math.random() * 0.55,
    kind: { roll: Math.random() < 0.25, snow: Math.random() < 0.14 },
  })

  let navTimer = 0
  let untuneTimer = 0
  let tuned = false
  const scheduleNav = (delay = gap()) => {
    clearTimeout(navTimer)
    if (tuned || document.hidden) return
    navTimer = window.setTimeout(() => {
      const burst = navBurst()
      navChannel.fire(burst)
      scheduleNav(burst.duration + gap())
    }, delay)
  }

  // hovering or focusing the nav tunes it in; it drifts off again a little after you leave
  const tune = () => {
    clearTimeout(untuneTimer)
    clearTimeout(navTimer)
    tuned = true
    navChannel.calm()
  }
  const detune = () => {
    clearTimeout(untuneTimer)
    untuneTimer = window.setTimeout(() => {
      tuned = false
      scheduleNav(600 + Math.random() * 2400)
    }, 1500)
  }
  const onPointerLeave = () => {
    if (!nav.contains(document.activeElement)) detune()
  }
  const onFocusOut = (event: FocusEvent) => {
    if (!nav.contains(event.relatedTarget as Node) && !nav.matches(':hover')) detune()
  }
  nav.addEventListener('pointerenter', tune)
  nav.addEventListener('pointerleave', onPointerLeave)
  nav.addEventListener('focusin', tune)
  nav.addEventListener('focusout', onFocusOut)

  // hero: a faint flicker now and then while it is on screen, and a tear when the pointer finds the name
  let heroTimer = 0
  let heroVisible = true
  let lastHover = 0
  const scheduleHero = () => {
    clearTimeout(heroTimer)
    if (!heroVisible || document.hidden) return
    heroTimer = window.setTimeout(() => {
      heroChannel.fire({ duration: 140, gain: 0.22 })
      scheduleHero()
    }, 9000 + Math.random() * 5000)
  }
  const visibility = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting
    scheduleHero()
  })
  visibility.observe(hero)
  const onLockup = () => {
    const now = performance.now()
    if (now - lastHover < 2000) return
    lastHover = now
    heroChannel.fire({ duration: 260, gain: 0.32 })
  }
  lockup?.addEventListener('pointerenter', onLockup)

  const onVisibility = () => {
    if (document.hidden) {
      clearTimeout(navTimer)
      clearTimeout(heroTimer)
    } else {
      scheduleNav()
      scheduleHero()
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

  return {
    // the set warming up as the page arrives
    arrival: () => {
      navChannel.fire({ duration: 520, gain: 0.8, kind: { snow: true } })
      heroChannel.fire({ duration: 640, gain: 0.45 })
      scheduleNav(2500 + Math.random() * 3000)
    },
    // swap the theme at the peak of a tear, so the tear hides the cut
    theme: (apply: () => void) => {
      navChannel.fire({ duration: 400, gain: 0.6 }, apply)
      if (heroVisible) heroChannel.fire({ duration: 400, gain: 0.4 })
    },
    destroy: () => {
      clearTimeout(navTimer)
      clearTimeout(untuneTimer)
      clearTimeout(heroTimer)
      nav.removeEventListener('pointerenter', tune)
      nav.removeEventListener('pointerleave', onPointerLeave)
      nav.removeEventListener('focusin', tune)
      nav.removeEventListener('focusout', onFocusOut)
      lockup?.removeEventListener('pointerenter', onLockup)
      document.removeEventListener('visibilitychange', onVisibility)
      visibility.disconnect()
      navChannel.destroy()
      heroChannel.destroy()
      svg.remove()
    },
  }
}

export type Glitch = ReturnType<typeof mountGlitch>
