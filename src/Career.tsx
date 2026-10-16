import { useEffect, useRef } from 'react'
import Section from './Section'
import { jobs } from './data'
import { formatDuration, formatPeriod, monthsBetween } from './dates'
import { subscribeScroll } from './scroll'
import { JobType, SubJob } from './types'

const Engagement = ({ client, from, until, description }: SubJob) => (
  <li className="sub">
    {client || from ? (
      <div className="sub__head">
        {client ? <span className="sub__client">{client}</span> : null}
        {from && until ? (
          <span className="sub__period">
            {formatPeriod(from, until)} · {formatDuration(monthsBetween(from, until))}
          </span>
        ) : null}
      </div>
    ) : null}
    <p>{description}</p>
  </li>
)

const Stop = ({ client, role, location, from, until, description, jobs: engagements }: JobType) => (
  <li className="stop" data-reveal>
    <div className="stop__when">
      <span className="stop__period">{formatPeriod(from, until)}</span>
      <span className="stop__duration">{formatDuration(monthsBetween(from, until))}</span>
    </div>
    <span className="stop__dot" aria-hidden="true" />
    <article className="stop__card card">
      <h3 className="stop__client">{client}</h3>
      <p className="stop__role">
        <strong>{role}</strong> · {location}
      </p>
      {description ? <p className="stop__desc">{description}</p> : null}
      {engagements?.length ? (
        <ul className="subs">
          {engagements.map((sub, index) => (
            <Engagement key={index} {...sub} />
          ))}
        </ul>
      ) : null}
    </article>
  </li>
)

const Career = () => {
  const routeRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)

  // the amber rail fills as you travel down the route, lighting each stop as it passes the middle of the screen
  useEffect(
    () =>
      subscribeScroll(() => {
        const route = routeRef.current
        if (!route || !fillRef.current) return
        const line = window.innerHeight * 0.5
        const rect = route.getBoundingClientRect()
        const progress = Math.min(Math.max((line - rect.top) / rect.height, 0), 1)
        fillRef.current.style.transform = `scaleY(${progress})`
        route.querySelectorAll<HTMLElement>('.stop__dot').forEach((dot) => {
          dot.classList.toggle('is-passed', dot.getBoundingClientRect().top < line)
        })
      }),
    [],
  )

  return (
    <Section id="career" index="01" title="Career" aside={`${jobs.length} stops`}>
      <div className="route" ref={routeRef}>
        <span className="route__rail" aria-hidden="true">
          <span className="route__fill" ref={fillRef} />
        </span>
        <ol className="route__stops">
          {jobs.map((job) => (
            <Stop key={`${job.client}-${job.from}`} {...job} />
          ))}
        </ol>
      </div>
    </Section>
  )
}

export default Career
