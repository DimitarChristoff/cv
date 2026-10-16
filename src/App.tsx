import { lazy, Suspense, useCallback } from 'react'
import Nav from './Nav'
import Hero from './Hero'
import Career from './Career'
import Skills from './Skills'
import Education from './Education'
import Personal from './Personal'
import Contact from './Contact'
import { useReveal } from './scroll'
import { ThemeId, useTheme } from './useTheme'
import { useGlitch } from './useGlitch'

// three.js is the heaviest dependency, so the background loads after the content has painted
const Background = lazy(() => import('./Background'))

const App = () => {
  const [theme, setTheme] = useTheme()
  const glitch = useGlitch()
  useReveal()

  // with the glitch loaded, the theme swaps at the peak of a tear so the tear hides the cut
  const changeTheme = useCallback(
    (next: ThemeId) => {
      if (glitch.current) glitch.current.theme(() => setTheme(next))
      else setTheme(next)
    },
    [glitch, setTheme],
  )

  return (
    <>
      <Suspense fallback={null}>
        <Background theme={theme} />
      </Suspense>
      <a className="skip" href="#career">
        Skip to career
      </a>
      <Nav theme={theme} onChange={changeTheme} />
      <main>
        <Hero />
        <Career />
        <Skills />
        <Education />
        <Personal />
      </main>
      <Contact />
    </>
  )
}

export default App
