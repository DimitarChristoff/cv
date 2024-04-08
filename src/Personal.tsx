import React, { FC } from 'react'
import { List, ListItem, ListItemText, ListItemIcon, Link } from '@mui/material'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import DownhillSkiingIcon from '@mui/icons-material/DownhillSkiing'
import CodeIcon from '@mui/icons-material/Code'
import SosIcon from '@mui/icons-material/Sos'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const PERSONAL_LIST = [
  {
    icon: SportsTennisIcon,
    description: 'Avid tennis player, member of a West Middlesex Tennis club team',
  },
  {
    icon: EmojiPeopleIcon,
    description: 'Dancing Salsa and Bachata',
  },
  {
    icon: DownhillSkiingIcon,
    description: 'Fanatical about skiing',
  },
  {
    icon: SosIcon,
    description: (
      <>
        Help / contribute on various JavaScript support sites like{' '}
        <Link href={'http://stackoverflow.com/users/126998/dimitar-christoff'}>stackoverflow.com</Link>, top 2%
      </>
    ),
  },
  {
    icon: CodeIcon,
    description: 'Created MVC framework Epitome for MooTools, featured on todomvc.com as alternative to BackboneJS',
  },
  {
    icon: GitHubIcon,
    description:
      'Contributor to various open source JavaScript libraries, including MooTools, RequireJS, angular/ng-grid, twitter/recess, fixed-data-table, react, etc',
  },
  {
    icon: EmojiEventsIcon,
    description: `Walk Magazine readers' award Best Online Retailer - 2009, webtogs.co.uk`,
  },
  {
    icon: EmojiEventsIcon,
    description: `UK Webmaster World – Best Website Award for August '08 for webtogs.co.uk`,
  },
  {
    icon: EmojiEventsIcon,
    description: `CNET Best of the web & Golden Web awards for frugalsworld.com, 2003`,
  },
  {
    icon: EmojiEventsIcon,
    description: 'PC World - Bulgaria – Winner of National Programming Competition, 1994 (Pascal + ASM)',
  },
]

export const Personal: FC = () => {
  return (
    <List sx={{ marginTop: 0, margin: 0, padding: 0 }}>
      {PERSONAL_LIST.map(({ icon: Icon, description }, index) => (
        <ListItem key={index} sx={{ paddingLeft: 0 }}>
          <ListItemIcon>
            <Icon color={'secondary'} />
          </ListItemIcon>
          <ListItemText primary={description} />
        </ListItem>
      ))}
    </List>
  )
}
