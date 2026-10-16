import Section from './Section'
import { awards, community, interests } from './data'

const Personal = () => (
  <Section id="personal" index="04" title="Personal">
    <div className="personal">
      <div className="personal__block card" data-reveal>
        <h3 className="personal__title">Off the clock</h3>
        <ul className="personal__list">
          {interests.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
      <div className="personal__block card" data-reveal>
        <h3 className="personal__title">Community</h3>
        <ul className="personal__list">
          {community.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      </div>
      <div className="personal__block personal__block--wide card" data-reveal>
        <h3 className="personal__title">Awards</h3>
        <ol className="awards">
          {awards.map(({ year, text }) => (
            <li key={text} className="awards__row">
              <span className="awards__year">{year}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </Section>
)

export default Personal
