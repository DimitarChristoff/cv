import { useEffect, useRef } from 'react'
import Board, { BoardRow } from './Board'
import { ArrowIcon, GitHubIcon, MailIcon, PhoneIcon, PinIcon } from './Icons'
import { jobs, profile, skills } from './data'
import { yearOf } from './dates'
import { prefersReducedMotion, subscribeScroll } from './scroll'
import portrait from './assets/portrait.jpg'

// every engagement with a named client is a stop; jobs without named sub-clients count as one stop
const stops: BoardRow[] = jobs.flatMap((job) => {
  const clients = (job.jobs ?? []).filter((sub) => sub.client && sub.from)
  return clients.length
    ? clients.map((sub) => ({ name: sub.short ?? sub.client ?? '', time: String(yearOf(sub.from ?? '')) }))
    : [{ name: job.short ?? job.client, time: String(yearOf(job.from)) }]
})

const coreSkills = skills.flatMap((group) => group.items.filter((s) => s.core).map((s) => s.name))

const Ticker = () => (
  <div className="ticker" aria-hidden="true">
    <div className="ticker__track">
      {/* two copies so the loop is seamless */}
      {[0, 1].map((copy) => (
        <span key={copy} className="ticker__set">
          {coreSkills.map((name) => (
            <span key={name} className="ticker__item">
              {name}
            </span>
          ))}
        </span>
      ))}
    </div>
  </div>
)

const Hero = () => {
  const innerRef = useRef<HTMLDivElement>(null)

  // the masthead drifts up and fades as the page scrolls away from it
  useEffect(() => {
    if (prefersReducedMotion()) return
    return subscribeScroll(() => {
      const el = innerRef.current
      if (!el) return
      const progress = Math.min(window.scrollY / window.innerHeight, 1)
      el.style.transform = `translate3d(0, ${progress * -60}px, 0)`
      el.style.opacity = String(1 - progress * 0.85)
    })
  }, [])

  return (
    <section id="top" className="hero">
      <div className="hero__inner" ref={innerRef}>
        {/* like "St" over "Germain": the first name leads a hairline across to the oval portrait */}
        <h1 className="masthead">
          <span className="masthead__first">
            <span>{profile.first}</span> <span className="masthead__rule" aria-hidden="true" />
            <span className="masthead__badge">
              <img src={portrait} alt="" width="200" height="200" />
            </span>
          </span>
          <span className="masthead__last">{profile.last}</span>
        </h1>
        <p className="hero__role">{profile.title}</p>

        <div className="hero__grid">
          <div>
            <p className="hero__summary">
              Passionate about JavaScript / Front-end. I look for the long term balance between the adoption of cutting
              edge technology and practical maintainability within enterprise environments.{' '}
              <span className="hero__em">
                Performance savant. OSS contributor,{' '}
                <span className="hero__heart" role="img" aria-label="loves">
                  ♥
                </span>{' '}
                React.
              </span>
            </p>
            <ul className="contacts">
              <li className="no-print">
                <a className="chip" href={`mailto:${profile.email}`}>
                  <MailIcon />
                  {profile.email}
                </a>
              </li>
              <li className="no-print">
                <a className="chip" href={`tel:${profile.phone}`}>
                  <PhoneIcon />
                  {profile.phone}
                </a>
              </li>
              <li>
                <a className="chip" href={profile.github.url}>
                  <GitHubIcon />
                  {profile.github.handle}
                  <ArrowIcon />
                </a>
              </li>
              <li>
                <span className="chip chip--plain">
                  <PinIcon />
                  {profile.location}
                </span>
              </li>
            </ul>
          </div>
          <Board rows={stops.slice(0, 9)} />
        </div>
      </div>
      <a className="hero__cue no-print" href="#career">
        Scroll
      </a>
      <Ticker />
    </section>
  )
}

export default Hero
