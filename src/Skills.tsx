import React, { FC } from 'react'
import { Card, CardHeader, CardContent, Chip } from '@mui/material'

export const Skills: FC = () => {
  return (
    <>
      <Card sx={{ marginBottom: 2, padding: 0 }}>
        <CardHeader title={'Programming'} />
        <CardContent sx={{ margin: 0, paddingTop: 0 }}>
          <Chip color={'success'} size={'small'} label={'JavaScript'} />
          <Chip color={'success'} size={'small'} label={'TypeScript'} />
          <Chip color={'success'} size={'small'} label={'ES2015 - ES2022'} />
          <Chip color={'success'} size={'small'} label={'CSS3'} />
          <Chip color={'success'} size={'small'} label={'HTML5'} />
          <Chip color={'success'} size={'small'} label={'JSX / TSX'} />
        </CardContent>
      </Card>
      <Card sx={{ marginBottom: 2, padding: 0 }}>
        <CardHeader title={'Toolkits / Frameworks'} />
        <CardContent sx={{ margin: 0, paddingTop: 0 }}>
          <Chip color={'success'} size={'small'} label={'React'} />
          <Chip size={'small'} label={'node.js'} />
          <Chip color={'success'} size={'small'} label={'Webpack'} />
          <Chip size={'small'} label={'Vite'} />
          <Chip color={'success'} size={'small'} label={'Redux'} />
          <Chip color={'success'} size={'small'} label={'MobX'} />
          <Chip size={'small'} label={'rx.js'} />
          <Chip size={'small'} label={'GraphQL'} />
          <Chip size={'small'} label={'Apollo'} />
          <Chip color={'success'} size={'small'} label={'Jest'} />
          <Chip color={'success'} size={'small'} label={'React Testing Library'} />
          <Chip color={'success'} size={'small'} label={'React Router'} />
          <Chip size={'small'} label={'Lerna'} />
          <Chip color={'success'} size={'small'} label={'Cypress'} />
          <Chip color={'success'} size={'small'} label={'Backstop.js'} />
          <Chip size={'small'} label={'Enzyme'} />
          <Chip size={'small'} label={'Nightwatch'} />
          <Chip color={'success'} size={'small'} label={'MUI'} />
          <Chip color={'success'} size={'small'} label={'Blueprint.js'} />
          <Chip color={'success'} size={'small'} label={'Stencil'} />
          <Chip size={'small'} label={'AngularJS 1/2'} />
          <Chip size={'small'} label={'Backbone'} />
          <Chip size={'small'} label={'Carbon UI'} />
          <Chip color={'success'} size={'small'} label={'Bulma'} />
          <Chip color={'success'} size={'small'} label={'LESS'} />
          <Chip color={'success'} size={'small'} label={'SASS/SCSS'} />
          <Chip color={'success'} size={'small'} label={'CSSNext/PostCSS'} />
          <Chip color={'success'} size={'small'} label={'MooTools'} />
          <Chip color={'success'} size={'small'} label={'jQuery'} />
          <Chip size={'small'} label={'Highcharts'} />
          <Chip size={'small'} label={'ChartJS'} />
          <Chip color={'success'} size={'small'} label={'AG Grid'} />
          <Chip color={'success'} size={'small'} label={'SlickGrid'} />
          <Chip color={'success'} size={'small'} label={'socket.io'} />
        </CardContent>
      </Card>{' '}
      <Card sx={{ marginBottom: 2, padding: 0 }}>
        <CardHeader title={'Platforms / Software tools'} />
        <CardContent sx={{ margin: 0, paddingTop: 0 }}>
          <Chip color={'success'} size={'small'} label={'git'} />
          <Chip color={'success'} size={'small'} label={'WebStorm / IntelliJ Idea'} />
          <Chip size={'small'} label={'GCP'} />
          <Chip size={'small'} label={'docker'} />
          <Chip color={'success'} size={'small'} label={'GitLab CI'} />
          <Chip size={'small'} label={'bash/sh'} />
          <Chip size={'small'} label={'OSX'} />
          <Chip size={'small'} label={'CentOS / RedHat'} />
        </CardContent>
      </Card>
      <Card sx={{ marginBottom: 2, padding: 0 }}>
        <CardHeader title={'Design / Visual'} />
        <CardContent sx={{ margin: 0, paddingTop: 0 }}>
          <Chip color={'success'} size={'small'} label={'DaVinci Resolve'} />
          <Chip color={'success'} size={'small'} label={'Corel Draw'} />
          <Chip color={'success'} size={'small'} label={'Corel Photopaint'} />
          <Chip size={'small'} label={'Fireworks'} />
          <Chip size={'small'} label={'PhotoShop'} />
        </CardContent>
      </Card>
    </>
  )
}
