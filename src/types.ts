import { ReactNode } from 'react'

export type SubJob = {
  client?: string
  from?: string | Date
  until?: string
  description: ReactNode
}

export type JobType = {
  client: string
  role: string
  location: string
  from: string | Date
  until?: string
  description?: ReactNode
  jobs?: SubJob[]
}
