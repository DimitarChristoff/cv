import { ReactNode } from 'react'

export type SubJob = {
  client?: string
  // shorter name for the departure board, defaults to client
  short?: string
  from?: string
  until?: string
  description: ReactNode
}

export type JobType = {
  client: string
  short?: string
  role: string
  location: string
  from: string
  until: string
  description?: ReactNode
  jobs?: SubJob[]
}

export type Skill = {
  name: string
  core?: boolean
}

export type SkillGroup = {
  title: string
  items: Skill[]
}

export type EducationType = {
  title: string
  school: string
  location: string
  from: string
  until: string
  note?: string
}

export type Award = {
  year: string
  text: string
}
