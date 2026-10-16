import { useEffect, useRef } from 'react'
import Board, { BoardRow } from './Board'
import { GitHubIcon, MailIcon, PhoneIcon, PinIcon } from './Icons'
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

// the sleeve's Blue Note mark, recast as a boxed label over an oval
const Mark = () => (
  <span className="mark" aria-hidden="true">
    <span className="mark__box">{profile.location}</span>
    <span className="mark__oval">
      <span>CV</span>
    </span>
  </span>
)

const Hero = () => {
  const innerRef = useRef<HTMLDivElement>(null)

  // the hero drifts up a little faster than the page, so it parts from the river behind it. No fade: the
  // hero is taller than the screen and the board sits at its foot
  useEffect(() => {
    if (prefersReducedMotion()) return
    return subscribeScroll(() => {
      const el = innerRef.current
      if (!el) return
      const progress = Math.min(window.scrollY / window.innerHeight, 1.5)
      el.style.transform = `translate3d(0, ${progress * -40}px, 0)`
    })
  }, [])

  return (
    <section id="top" className="hero">
      <div className="hero__inner" ref={innerRef}>
        {/* like "St" over "Germain": the first name leads a rule across to the mark */}
        <h1 className="lockup">
          <span className="lockup__first">
            <span>{profile.first}</span> <span className="lockup__rule" aria-hidden="true" />
            <Mark />
          </span>
          <span className="lockup__last">{profile.last}</span>
        </h1>
        <p className="hero__role">{profile.title}</p>

        <div className="hero__intro">
          <div className="hero__text">
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
            <ul className="contacts" aria-label="Contact">
              <li className="no-print">
                <a className="contact-link" href={`mailto:${profile.email}`}>
                  <MailIcon />
                  {profile.email}
                </a>
              </li>
              <li className="no-print">
                <a className="contact-link" href={`tel:${profile.phone}`}>
                  <PhoneIcon />
                  {profile.phone}
                </a>
              </li>
              <li>
                <a className="contact-link" href={profile.github.url}>
                  <GitHubIcon />
                  {profile.github.handle}
                </a>
              </li>
              <li>
                <span className="contact-link contact-link--plain">
                  <PinIcon />
                  {profile.location}
                </span>
              </li>
            </ul>
          </div>

          {/* the departure board laid over the lower half of the photo, like the sleeve */}
          <div className="hero__visual">
            <img
              className="hero__portrait"
              src={portrait}
              alt="Portrait of Dimitar Christoff"
              width="512"
              height="512"
            />
            <Board rows={stops.slice(0, 9)} />
          </div>
        </div>

        <div className="hero__foot">
          <a className="hero__cue no-print" href="#career">
            Scroll
          </a>
        </div>
      </div>
      <Ticker />
    </section>
  )
}

export default Hero
