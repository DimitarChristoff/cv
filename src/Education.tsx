import React, { FC } from 'react'
import { Card, CardHeader, CardContent, Typography } from '@mui/material'
import { getJobDuration } from './Job'

export const Education: FC = () => {
  const from = 'Sep 1993'
  const until = 'Jul 1995'
  const from2 = 'Sep 1989'
  const until2 = 'Jul 1993'

  return (
    <>
      <Card sx={{ marginBottom: 2, padding: 0 }}>
        <CardHeader
          title={'BA International Economic Relations *'}
          subheader={
            <>
              <strong>National University of Economics</strong>, {from} - {until} ({getJobDuration(from, until)} months)
              Sofia, Bulgaria
            </>
          }
        />
        <CardContent sx={{ margin: 0, paddingTop: 0 }}>
          <Typography fontSize={'11px'} textAlign={'right'}>
            * dropped out final year due to move to UK
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ marginBottom: 2, padding: 0 }}>
        <CardHeader
          title={'A Level equivalences (x4)'}
          subheader={
            <>
              <strong>7th Secondary School (SOU)</strong>, {from2} - {until2} ({getJobDuration(from2, until2)} months)
              Sofia, Bulgaria
            </>
          }
        />
      </Card>
    </>
  )
}
