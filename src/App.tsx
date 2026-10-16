import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box,
  Container,
  Link,
  Tab,
  Tabs,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Grid,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import GitHubIcon from '@mui/icons-material/GitHub'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Header from './Header'
import { TimelineJobs } from './Timeline'
import { Job } from './Job'
import { jobs } from './data'
import { Education } from './Education'
import { Skills } from './Skills'
import { Personal } from './Personal'

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role={'tabpanel'}
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}>
    {value === index && (
      <Box>
        <Typography component={'div'}>{children}</Typography>
      </Box>
    )}
  </div>
)

function App() {
  const [value, setValue] = useState(0)
  const [scrolled, setScrolled] = useState(0)
  const container = useRef<HTMLDivElement | null>(null)
  const handleChange = useCallback((_v, a) => {
    setValue(a)
  }, [])

  // FILTER to find jobs that match a particular string

  useEffect(() => {
    const el = container?.current
    if (el) {
      handleScroll()
    }
  }, [container])

  const handleScroll = () => {
    const el = container?.current
    const { scrollHeight, scrollTop, clientHeight } = el
    // done is scrollTop / (scrollHeight * 0.1 (1%))
    const one = scrollHeight * 0.01
    setScrolled(scrollTop ? (scrollTop + clientHeight) / one : 0)
  }

  return (
    <div className={'scroll'} ref={container} onScroll={handleScroll}>
      <Header scrolled={scrolled} />

      <Container maxWidth="lg" sx={{ marginTop: 10 }} className={'main'}>
        <Box sx={{ marginTop: '10px' }} className={'print-only'}>
          <Typography variant={'h2'} textAlign={'center'}>
            Dimitar Christoff
          </Typography>
        </Box>
        <Box style={{ transform: 'translateY(-20px)' }} id={'start'}>
          <Grid container columnSpacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ marginTop: 2 }}>
                <Typography variant={'h3'} id={'contact'}>
                  Contact
                </Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sizes="(max-width: 600px) 10px">
                        <HomeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={'Flat 4, 85 Cleveland Road'} secondary={'London W13 0HF'} />
                  </ListItem>
                  <ListItem className={'no-print'}>
                    <ListItemAvatar>
                      <Avatar>
                        <AlternateEmailIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Link href={'mailto:christoff@gmail.com'}>christoff@gmail.com</Link>}
                      secondary={'07810072094'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <GitHubIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={'dimitarchristoff'}
                      secondary={
                        <Link href={'https://github.com/DimitarChristoff?tab=repositories'} className={'no-print'}>
                          View repos
                        </Link>
                      }
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} justifyContent={'center'} alignItems={'center'} display={'flex'} flexGrow={0}>
              <Box marginTop={3}>
                <Typography
                  variant={'subtitle2'}
                  color={'primary.light'}
                  textAlign={'center'}
                  sx={{
                    marginBottom: 2,
                    fontSize: {
                      xs: '16px',
                    },
                  }}>
                  Passionate about JavaScript / Front-end. I look for the long term balance between the adoption of
                  cutting edge technology and practical maintainability within enterprise environments.
                  <br />
                  Performance savant. OSS contributor, <FavoriteIcon fontSize={'small'} htmlColor={'red'} /> React.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant={'h3'} id={'career'}>
            Career history
          </Typography>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className={'no-print'}>
            <Tab label={'As cards'} />
            <Tab label={'As timeline'} />
          </Tabs>
          <TabPanel value={value} index={0}>
            {jobs.map((job, index) => (
              <Job
                key={job.description}
                client={job.client}
                role={job.role}
                location={job.location}
                from={job.from}
                until={job.until}
                jobs={job.jobs}
                description={job.description}
                noSnap={true || index === 0}
              />
            ))}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TimelineJobs jobs={jobs} />
          </TabPanel>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant={'h3'} id={'skills'}>
            Key skills
          </Typography>

          <Skills />
          <Typography fontSize={'11px'} textAlign={'right'} marginLeft={'auto'} right={0}>
            * Knowledge / experience in all these, but green pills indicate higher proficiency
          </Typography>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant={'h3'} id={'education'}>
            Education
          </Typography>
          <Education />
        </Box>
        <div className={'personal'}>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant={'h3'} id={'personal'}>
              Personal hobbies and interests
            </Typography>
            <Personal />
          </Box>
        </div>
      </Container>
    </div>
  )
}

export default App
