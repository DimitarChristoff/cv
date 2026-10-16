import { lazy, Suspense } from 'react'
import Nav from './Nav'
import Hero from './Hero'
import Career from './Career'
import Skills from './Skills'
import Education from './Education'
import Personal from './Personal'
import Contact from './Contact'
import { useReveal } from './scroll'
import { useTheme } from './useTheme'

// three.js is the heaviest dependency, so the background loads after the content has painted
const Background = lazy(() => import('./Background'))

const App = () => {
  const [theme, setTheme] = useTheme()
  useReveal()

  return (
    <>
      <Suspense fallback={null}>
        <Background theme={theme} />
      </Suspense>
      <a className="skip" href="#career">
        Skip to career
      </a>
      <Nav theme={theme} onChange={setTheme} />
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
