import React, { useEffect, useState, MouseEventHandler } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { SwipeableDrawer, List, ListItem, ListItemButton } from '@mui/material'

import LinearProgress from '@mui/material/LinearProgress'
import dimi from './assets/img.png'

const pages = [
  { label: 'Contact', id: 'contact' },
  { label: 'Career History', id: 'career' },
  { label: 'Key Skills', id: 'skills' },
  { label: 'Education', id: 'education' },
  { label: 'Personal', id: 'personal' },
]

interface Props {
  scrolled: number
}

const Header = ({ scrolled }: Props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const { hash } = new URL(window.location.href)
    if (hash) {
      const el = document.querySelector(hash)
      el?.scrollIntoView({
        behavior: 'auto',
        block: 'start',
      })
    }
  }, [])

  const handleOpenNavMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const handleNavigateClick: MouseEventHandler<HTMLElement> = (event) => {
    event?.preventDefault()
    console.log(event.currentTarget.dataset)
    const target = `#${event.currentTarget.dataset.id}`
    if (!target) {
      return
    }
    const el = document.querySelector(target)
    window.history.replaceState(null, '', target)
    el?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    setTimeout(() => {
      setMobileMenuOpen(false)
    }, 500)
  }

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <List>
        {pages.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={handleNavigateClick} data-id={item.id}>
              {item.label}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <AppBar component="nav" position={'fixed'} elevation={2} className={'no-print see-through'} color={'transparent'}>
      <Container maxWidth="xl" data-id={'start'}>
        <Toolbar disableGutters>
          <Typography
            variant={'h5'}
            noWrap
            component="a"
            href="#"
            data-id={'start'}
            onClick={handleNavigateClick}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              fontFamily: 'Lucida Sans',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            Dimitar Christoff
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit">
              <MenuIcon />
            </IconButton>
            {mobileMenuOpen ? (
              <SwipeableDrawer
                anchor={'top'}
                open={mobileMenuOpen}
                onOpen={() => setMobileMenuOpen(true)}
                onClose={() => {
                  // do nothing
                }}
                sx={{
                  display: { xs: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%', top: '60px' },
                }}>
                {drawer}
              </SwipeableDrawer>
            ) : null}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'Lucida Sans',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>
              Dimitar Christoff
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={handleNavigateClick}
                sx={{ my: 2, color: 'white', display: 'block' }}
                data-id={page.id}>
                {page.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Avatar alt="Dimi" src={dimi} />
          </Box>
        </Toolbar>
      </Container>
      <LinearProgress variant="determinate" color={'warning'} value={scrolled} />
    </AppBar>
  )
}

export default Header
