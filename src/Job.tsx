import React, { FC } from 'react'
import { Card, CardHeader, CardContent, Divider, List, ListItem, ListItemText, Typography } from '@mui/material'
import { SubJob } from './types'
import moment from 'moment'

type SubJobsProps = {
  jobs: SubJob[]
}

const MOBILE_FONT_SIZE = '16px'

export const getJobDuration = (from, until) => {
  const fromD = moment(from, 'MMM YYYY')
  const untilD = until === 'date' ? moment(new Date()) : moment(until, 'MMM YYYY').endOf('month')
  return untilD.diff(fromD, 'months')
}

const SubJobs: FC<SubJobsProps> = ({ jobs }) => {
  return jobs?.length ? (
    <List sx={{ marginTop: 0, margin: 0, padding: 0 }}>
      {jobs.map(({ from, until, client, description }, index) => {
        const isLast = index < jobs.length - 1
        const tailEnd = from && until ? `, ${from} - ${until} (${getJobDuration(from, until)} months)` : ''
        const listItemProps = {
          secondary: description,
          primary: client ? (
            <Typography color={'primary.light'}>
              {client}
              {tailEnd}
            </Typography>
          ) : undefined,
        }
        return (
          <>
            <ListItem disableGutters sx={{ paddingBottom: isLast ? 0 : 'initial', display: 'block' }}>
              <ListItemText
                {...listItemProps}
                secondary={
                  <Typography
                    sx={{
                      fontSize: {
                        xs: MOBILE_FONT_SIZE,
                      },
                      marginTop: {
                        xs: 1,
                      },
                    }}>
                    {description}
                  </Typography>
                }
              />
              {isLast ? <Divider /> : null}
            </ListItem>
          </>
        )
      })}
    </List>
  ) : null
}

type JobProps = {
  client: string
  from: string | Date
  until: string | Date
  role: string
  location: string
  description?: React.ReactNode
  jobs?: SubJob[]
  noSnap: boolean
}

export const Job: FC<JobProps> = ({ client, from, until, role, location, description, jobs, noSnap }) => {
  return (
    <Card sx={{ marginBottom: 2, padding: 0, scrollSnapAlign: noSnap ? 'initial' : 'start' }}>
      <CardHeader
        title={client}
        subheader={
          <>
            <strong>{role}</strong>, {from} - {until} ({getJobDuration(from, until)} months),{' '}
            <Typography color={'primary.light'} component={'span'}>
              {location}
            </Typography>
          </>
        }
      />
      <CardContent sx={{ margin: 0, paddingTop: 0 }}>
        {description ? (
          <Typography
            variant={'body2'}
            sx={{
              fontSize: {
                xs: MOBILE_FONT_SIZE,
              },
            }}>
            {description}
          </Typography>
        ) : null}
        <SubJobs jobs={jobs} />
      </CardContent>
    </Card>
  )
}
