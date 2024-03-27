import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import { Menu } from '@mui/icons-material'
import './App.css'
import { Excel } from './pages/excel/excel'
import { ProvideToken } from './pages/login/provideToken'

function App() {


  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <Menu />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Last Position VSS Vitogaz & LPSA
          </Typography>
        </Toolbar>
      </AppBar>
      <Excel />
    </>
  )
}

export default App
