import Section from './Section'
import { education } from './data'
import { formatDuration, formatPeriod, monthsBetween } from './dates'

const Education = () => (
  <Section id="education" index="03" title="Education">
    <div className="edu">
      {education.map(({ title, school, location, from, until, note }) => (
        <article key={title} className="edu__item card" data-reveal>
          <p className="edu__period">
            {formatPeriod(from, until)} · {formatDuration(monthsBetween(from, until))}
          </p>
          <h3 className="edu__title">{title}</h3>
          <p className="edu__school">
            <strong>{school}</strong> · {location}
          </p>
          {note ? <p className="edu__note">{note}</p> : null}
        </article>
      ))}
    </div>
  </Section>
)

export default Education
