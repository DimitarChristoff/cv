import { useState } from 'react'
import Section from './Section'
import { skills } from './data'

const Skills = () => {
  const [coreOnly, setCoreOnly] = useState(false)
  const total = skills.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <Section id="skills" index="02" title="Skills" aside={`${total} tools`}>
      <div className="skills__bar" data-reveal>
        <p className="legend">
          <span className="legend__dot" aria-hidden="true" /> Higher proficiency — experience with all of them
        </p>
        <div className="segmented no-print" role="group" aria-label="Filter skills">
          <button type="button" aria-pressed={!coreOnly} onClick={() => setCoreOnly(false)}>
            All
          </button>
          <button type="button" aria-pressed={coreOnly} onClick={() => setCoreOnly(true)}>
            Core
          </button>
        </div>
      </div>
      <div className="skills__grid">
        {skills.map((group) => {
          const items = coreOnly ? group.items.filter((s) => s.core) : group.items
          return (
            <div
              key={group.title}
              className={`skill-group card${group.items.length > 20 ? ' skill-group--wide' : ''}`}
              data-reveal>
              <h3 className="skill-group__title">
                {group.title}
                <span>{items.length}</span>
              </h3>
              <ul className="pills">
                {items.map((s) => (
                  <li key={s.name} className={s.core ? 'pill pill--core' : 'pill'}>
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

export default Skills
