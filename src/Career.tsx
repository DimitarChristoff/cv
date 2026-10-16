import { useEffect, useId, useRef, useState } from 'react'
import Section from './Section'
import { PlusIcon } from './Icons'
import { jobs } from './data'
import { formatDuration, formatPeriod, formatPeriodShort, isPresent, monthsBetween, yearOf } from './dates'
import { subscribeScroll } from './scroll'
import { JobType, SubJob } from './types'

// the most recent stops are told in full along the route; RBS onwards collapse into the board
const FULL_STOPS = 4

const Tech = ({ items }: { items?: string[] }) => (items?.length ? <p className="tech">{items.join(' · ')}</p> : null)

// named clients are interchanges off the main line, unnamed engagements are plain duties
const Engagements = ({ items }: { items?: SubJob[] }) => {
  if (!items?.length) return null
  if (!items.some((sub) => sub.client)) {
    return (
      <ul className="duties">
        {items.map((sub, index) => (
          <li key={index}>
            <span>
              {sub.description}
              <Tech items={sub.tech} />
            </span>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <>
      <p className="change-label">Change here for</p>
      <ul className="changes">
        {items.map(({ client, from, until, description, tech }, index) => (
          <li key={index} className="change">
            {client || from ? (
              <div className="change__head">
                {client ? <h4 className="change__client">{client}</h4> : null}
                {from && until ? (
                  <span className="change__period">
                    {formatPeriod(from, until)} · {formatDuration(monthsBetween(from, until))}
                  </span>
                ) : null}
              </div>
            ) : null}
            <p className="change__desc">{description}</p>
            <Tech items={tech} />
          </li>
        ))}
      </ul>
    </>
  )
}

const Stop = ({ job }: { job: JobType }) => {
  const current = isPresent(job.until)
  return (
    <li className="stop" data-reveal>
      <div className="stop__when">
        <span className="stop__period">{formatPeriod(job.from, job.until)}</span>
        <span className="stop__duration">{formatDuration(monthsBetween(job.from, job.until))}</span>
      </div>
      <span className={current ? 'stop__node stop__node--current' : 'stop__node'} aria-hidden="true" />
      <div className="stop__body">
        <h3 className="stop__client">{job.client}</h3>
        <p className="stop__role">
          {job.role} <span>· {job.location}</span>
        </p>
        {job.description ? <p className="stop__desc">{job.description}</p> : null}
        <Tech items={job.tech} />
        <Engagements items={job.jobs} />
      </div>
    </li>
  )
}

const EarlierStop = ({ job }: { job: JobType }) => {
  const [open, setOpen] = useState(false)
  const detailsId = useId()
  const name = job.short ?? job.client

  return (
    <li className={open ? 'earlier__row is-open' : 'earlier__row'}>
      <div className="earlier__line">
        <span className="earlier__year">{yearOf(job.from)}</span>
        <h3 className="earlier__name">{name}</h3>
        <span className="earlier__role">{job.role}</span>
        <span className="earlier__dates">{formatPeriodShort(job.from, job.until)}</span>
        <button
          type="button"
          className="earlier__toggle"
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={`${name} details`}
          onClick={() => setOpen((value) => !value)}>
          <PlusIcon />
        </button>
      </div>
      {/* collapsed with grid rows so it can animate; visibility keeps closed details out of tab order and AT */}
      <div className="earlier__details" id={detailsId}>
        <div>
          <div className="earlier__body">
            <p className="earlier__meta">
              {job.client} · {job.location} · {formatDuration(monthsBetween(job.from, job.until))}
            </p>
            {job.description ? <p className="stop__desc">{job.description}</p> : null}
            <Tech items={job.tech} />
            <Engagements items={job.jobs} />
          </div>
        </div>
      </div>
    </li>
  )
}

const Career = () => {
  const routeRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const full = jobs.slice(0, FULL_STOPS)
  const earlier = jobs.slice(FULL_STOPS)
  const first = jobs[jobs.length - 1]

  // the amber rail fills as you travel down the route, ringing each stop in amber as it passes mid-screen
  useEffect(
    () =>
      subscribeScroll(() => {
        const route = routeRef.current
        if (!route || !fillRef.current) return
        const line = window.innerHeight * 0.5
        const rect = route.getBoundingClientRect()
        const progress = Math.min(Math.max((line - rect.top) / rect.height, 0), 1)
        fillRef.current.style.transform = `scaleY(${progress})`
        route.querySelectorAll<HTMLElement>('.stop__node').forEach((node) => {
          node.classList.toggle('is-passed', node.getBoundingClientRect().top < line)
        })
      }),
    [],
  )

  return (
    <Section id="career" index="01" title="Career" aside={`${jobs.length} stops · ${first.from.trim()} — now`}>
      <div className="route" ref={routeRef}>
        <span className="route__rail" aria-hidden="true">
          <span className="route__fill" ref={fillRef} />
        </span>
        <ol className="route__stops">
          {full.map((job) => (
            <Stop key={`${job.client}-${job.from}`} job={job} />
          ))}
        </ol>
      </div>
      <div className="earlier" data-reveal>
        <div className="earlier__head">
          <span className="earlier__more">…continued……</span>
          <span>Earlier stops · from</span>
        </div>
        <ul className="earlier__rows">
          {earlier.map((job) => (
            <EarlierStop key={`${job.client}-${job.from}`} job={job} />
          ))}
        </ul>
      </div>
    </Section>
  )
}

export default Career
