import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import AccountCircle from '@material-ui/icons/AccountCircle';
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    spacing: 4
  },
  menu: {
    margin: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  customizeToolbar: {
    minHeight: 100
  }
}));

const isActive = (history, path) => {

  if (history.location.pathname == path)
    return {color: '#ff4081'}
  else
    return {color: '#ffffff'}
}
const Menu = withRouter(function ({history}) {
  const classes = useStyles()
  // auth.clearJWT(() => history.push('/'))
  return (
      <AppBar position="static">
          <Toolbar className={classes.customizeToolbar}>
            {/* <Typography variant="h6" color="inherit">
              Ensembler
            </Typography> */}
            <Link className={classes.title} to="/">
              {/* <IconButton aria-label="Home" style={isActive(history, "/")}> */}
              <Typography  aria-label="Home" variant="h6" style={{color: 'white'}}>
              Ensembler
            </Typography>
                
              {/* </IconButton> */}
            </Link>
            {
              !auth.isAuthenticated() && (<span>
                <Link  to="/register">
                  <Button  style={isActive(history, "/register")}>Register
                  </Button>
                </Link>
                <Link  to="/login">
                  <Button style={isActive(history, "/login")}>Login
                  </Button>
                </Link>
              </span>)
            }
            {
              auth.isAuthenticated() && (<span>
                {auth.isAuthenticated().user.musician  ? (
                  <Link to="/posts">
                    <Button style={isActive(history, "/posts")}>Postings</Button>
                  </Link>
                ): (
                  <Link to="/create-post">
                    <Button style={isActive(history, "/create-post")}>New Posting</Button>
                  </Link>
                )}
                <Link to={"/user/" + auth.isAuthenticated().user._id}>
                  <Button className={classes.menu} style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}><AccountCircle/></Button>
                  
                </Link>{}
                <Button color="inherit" onClick={() => {
                    auth.clearJWT(() => history.push('/'))
                  }}>Log Out</Button>
              </span>)
            }
          </Toolbar>
        </AppBar>
      
   
    
  )
} )

export default Menu
