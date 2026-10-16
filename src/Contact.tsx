import Section from './Section'
import { ArrowIcon, GitHubIcon, PhoneIcon, PinIcon, PrintIcon, StackIcon } from './Icons'
import { profile } from './data'

const Contact = () => (
  <footer className="contact">
    <Section id="contact" index="05" title="Contact">
      <a className="contact__email no-print" href={`mailto:${profile.email}`} data-reveal>
        {profile.email}
        <ArrowIcon />
      </a>
      <ul className="contact__grid" data-reveal>
        <li className="no-print">
          <PhoneIcon />
          <a href={`tel:${profile.phone}`}>{profile.phone}</a>
        </li>
        <li>
          <PinIcon />
          <span>
            {profile.address[0]}
            <br />
            {profile.address[1]}
          </span>
        </li>
        <li>
          <GitHubIcon />
          <a href={profile.github.url}>github.com/{profile.github.handle}</a>
        </li>
        <li>
          <StackIcon />
          <a href={profile.stackoverflow}>Stack Overflow</a>
        </li>
      </ul>
    </Section>
    <div className="colophon">
      <span>Built with React, three.js and Vite. Served from Cloudflare Workers.</span>
      <button type="button" className="chip no-print" onClick={() => window.print()}>
        <PrintIcon />
        Print / save as PDF
      </button>
    </div>
  </footer>
)

export default Contact
