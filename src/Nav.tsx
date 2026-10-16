import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { subscribeScroll } from './scroll'
import { THEMES, ThemeId } from './useTheme'
import { profile } from './data'

export const SECTIONS = [
  { id: 'career', label: 'Career' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'personal', label: 'Personal' },
  { id: 'contact', label: 'Contact' },
]

type ThemeSwitchProps = {
  theme: ThemeId
  onChange: (theme: ThemeId) => void
}

const ThemeSwitch = ({ theme, onChange }: ThemeSwitchProps) => {
  const groupRef = useRef<HTMLDivElement>(null)

  // radio group keyboard support: arrows move and select
  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const index = THEMES.findIndex((t) => t.id === theme)
    const next = THEMES[(index + step + THEMES.length) % THEMES.length]
    onChange(next.id)
    groupRef.current?.querySelector<HTMLButtonElement>(`[data-theme="${next.id}"]`)?.focus()
  }

  return (
    <div className="themes" role="radiogroup" aria-label="Colour theme" ref={groupRef}>
      {THEMES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={id === theme}
          aria-label={label}
          title={label}
          tabIndex={id === theme ? 0 : -1}
          data-theme={id}
          className="themes__swatch"
          onClick={() => onChange(id)}
          onKeyDown={onKeyDown}
        />
      ))}
    </div>
  )
}

type Props = ThemeSwitchProps

const Nav = ({ theme, onChange }: Props) => {
  const navRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(
    () =>
      subscribeScroll(() => {
        const { scrollY, innerHeight } = window
        const max = document.documentElement.scrollHeight - innerHeight
        navRef.current?.classList.toggle('is-scrolled', scrollY > 24)
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`
      }),
    [],
  )

  // scrollspy: the section crossing the middle band of the viewport is the current one
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    const hero = document.getElementById('top')
    if (hero) observer.observe(hero)
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // the phone menu closes on Escape (returning focus to its button) and on any tap outside the bar
  useEffect(() => {
    if (!open) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const links = (onClick?: () => void) =>
    SECTIONS.map(({ id, label }) => (
      <li key={id}>
        <a href={`#${id}`} className="nav__link" aria-current={active === id ? 'true' : undefined} onClick={onClick}>
          {label}
        </a>
      </li>
    ))

  return (
    <header className={open ? 'nav is-open' : 'nav'} ref={navRef}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand">
          <span className="nav__mark" aria-hidden="true">
            <span>DC</span>
          </span>
          <span className="nav__name">
            {profile.first} {profile.last}
          </span>
        </a>
        <nav aria-label="Sections" className="nav__sections">
          <ul className="nav__links">{links()}</ul>
        </nav>
        <div className="nav__themes">
          <ThemeSwitch theme={theme} onChange={onChange} />
        </div>
        <button
          type="button"
          className="nav__menu"
          ref={menuButtonRef}
          aria-expanded={open}
          aria-controls="nav-panel"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}>
          <span className="nav__burger" aria-hidden="true" />
        </button>
      </div>
      <div id="nav-panel" className="nav__panel" hidden={!open}>
        <nav aria-label="Sections">
          <ul className="nav__panel-links">{links(() => setOpen(false))}</ul>
        </nav>
        <ThemeSwitch theme={theme} onChange={onChange} />
      </div>
      <div className="nav__progress" ref={progressRef} />
    </header>
  )
}

export default Nav
