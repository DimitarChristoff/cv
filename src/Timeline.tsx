import React, { FC } from 'react'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'
import { Typography } from '@mui/material'
import { JobType } from './types'

type TimelineJobsProps = {
  jobs: JobType[]
}

export const TimelineJobs: FC<TimelineJobsProps> = ({ jobs }) => {
  return (
    <Timeline position="alternate">
      {jobs.map((job) => (
        <TimelineItem key={job.role}>
          <TimelineOppositeContent color="text.secondary">
            <Typography variant={'subtitle1'}>
              {job.from} - {job.until}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant={'h5'}>{job.role}</Typography>
            <Typography variant={'subtitle1'}>{job.client}</Typography>
            {job.jobs
              ? job.jobs.map((sub) =>
                  sub.client ? (
                    <Typography color={'info.main'} variant={'subtitle2'} title={'Consulting client'}>
                      {sub.client}
                    </Typography>
                  ) : null,
                )
              : null}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
