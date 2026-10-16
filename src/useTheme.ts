import { useCallback, useState } from 'react'

// keep in sync with the inline script in index.html and the palettes in index.css
export const THEMES = [
  { id: 'tourist', label: 'Tourist' },
  { id: 'mist', label: 'Mist' },
  { id: 'sage', label: 'Sage' },
  { id: 'lilac', label: 'Lilac' },
  { id: 'nocturne', label: 'Nocturne' },
] as const

export type ThemeId = typeof THEMES[number]['id']

const STORAGE_KEY = 'cv-theme'

const syncMetaColour = () => {
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
}

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const current = document.documentElement.dataset.theme
    return THEMES.some((t) => t.id === current) ? (current as ThemeId) : 'tourist'
  })

  const setTheme = useCallback((next: ThemeId) => {
    // set the attribute synchronously so anything reading CSS variables in effects sees the new palette
    document.documentElement.dataset.theme = next
    syncMetaColour()
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage can be unavailable (private mode), the theme still applies for this visit
    }
    setThemeState(next)
  }, [])

  return [theme, setTheme] as const
}
