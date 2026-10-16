import { ReactNode } from 'react'

type Props = {
  id: string
  index: string
  title: string
  aside?: ReactNode
  children: ReactNode
}

// a numbered section: Doto index, title and a board-style aside, ruled off underneath
const Section = ({ id, index, title, aside, children }: Props) => (
  <section id={id} className="section" aria-labelledby={`${id}-title`}>
    <header className="section__head" data-reveal>
      <span className="section__index" aria-hidden="true">
        {index}
      </span>
      <h2 className="section__title" id={`${id}-title`}>
        {title}
      </h2>
      {aside ? <span className="section__aside">{aside}</span> : null}
    </header>
    {children}
  </section>
)

export default Section
