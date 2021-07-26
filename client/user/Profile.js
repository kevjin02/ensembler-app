import React, { useState, useEffect } from 'react'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import {read} from './api-user.js'
import {Redirect, Link} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Divider from '@material-ui/core/Divider'
import Reviews from './Reviews'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  },
  title: {
    marginTop: theme.spacing(1),
    color: theme.palette.protectedTitle
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  },
}))

/**
 * Profile (parent: MainRouter)
 * @param {Object} {match} -  item    : post object
 *                          onRemove : parent function to remove a post
 * 
 * @returns {Object} - Profile page
 */
export default function Profile({ match }) {
  
  const classes = useStyles()

  const [values, setValues] = useState({
    user: {},
    redirectToLogin: false,
  })

  const jwt = auth.isAuthenticated()


  //Update user when review is submitted
  const updateUser = (data) => {
        setValues({...values, user: {...values.user, reviews: data, pastCustomers: ''}})

    }

  //Read user information on mount
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, redirectToLogin: true})
      } else {
        setValues({...values, user: data})
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])
      
  
  //Redirect to login if error
  if (values.redirectToLogIn) {
    return <Redirect to='/login'/>
  }



  return (
    <div>
    <Paper className={classes.root} elevation={1}>

      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>

      <List dense>

        <ListItem>
          <ListItemAvatar>

            <Avatar src={values.user._id
              ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
              : '/api/users/defaultphoto'} className={classes.bigAvatar}/>
              
          </ListItemAvatar>

          <ListItemText primary={values.user.name + ' ('+(values.user.musician ? values.user.instrument : 'Client')+')'} 
                        secondary={values.user.location}/> {
            auth.isAuthenticated().user && auth.isAuthenticated().user._id == values.user._id &&
            (<ListItemSecondaryAction>

              <Link to={"/user/edit/" + values.user._id}>

                <IconButton aria-label="Edit" color="primary">

                  <Edit/>

                </IconButton>

              </Link>

              <DeleteUser userId={values.user._id}/>

            </ListItemSecondaryAction>)
          }

        </ListItem>

        <Divider/>

        <ListItem>

          <ListItemText primary={values.user.about} secondary={"Joined: " + (
            new Date(values.user.created)).toDateString()}/>

        </ListItem>

      </List>

    </Paper>

    {values.user.musician && <Reviews profileId = {match.params.userId} user = {values.user} updateUser = {updateUser}/>}

    </div>
  )
  }