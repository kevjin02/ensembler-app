import React from 'react'
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AccountCircle from '@material-ui/icons/AccountCircle';

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


/**
 * Change color of menu item when selected
 * @param  {Object} history - history from router
 * @param  {Object} path - intended path for link
 * 
 * @returns {Object} - Object containing color to set menu item
 * 
 */
const isActive = (history, path) => {

  if (history.location.pathname == path)
    return {color: '#ff4081'}
  else
    return {color: '#ffffff'}
}


/**
 * Menu that varies based on user type and whether they are logged in
 */
const Menu = withRouter(function ({history}) {
  const classes = useStyles()
  
  return (
      <AppBar position="static">

        <Toolbar className={classes.customizeToolbar}>

          <Link className={classes.title} to="/">

            <Typography  aria-label="Home" variant="h6" style={{color: 'white'}}>
            Ensembler
          </Typography>
              
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
})

export default Menu
