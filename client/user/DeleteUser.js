import React, {useState} from 'react'
import auth from './../auth/auth-helper'
import {remove} from './api-user.js'
import {Redirect} from 'react-router-dom'

import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'


/**
 * DeleteUser (parent: Profile)
 * @param {Object} props -  userId : id of user to be deleted
 * 
 * @returns {Object} - Button and confirm window to delete own user
 */
export default function DeleteUser(props) {

  const [open, setOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const jwt = auth.isAuthenticated()

  
  //open confirm window
  const clickButton = () => {
    setOpen(true)
  }

  //call api-post remove function to delete account
  const deleteAccount = () => { 
    remove({
      userId: props.userId
    }, {t: jwt.token}).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        auth.clearJWT(() => console.log('deleted'))
        setRedirect(true)
      }
    })
  }


  //close confirm window
  const handleRequestClose = () => {
    setOpen(false)
  }


  //redirect to homepage
  if (redirect) {
    return <Redirect to='/'/>
  }

  return (<span>
  
    <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
      <DeleteIcon/>
    </IconButton>

    <Dialog open={open} onClose={handleRequestClose}>

      <DialogTitle>{"Delete Account"}</DialogTitle>
      
      <DialogContent>

        <DialogContentText>
          Confirm to delete your account.
        </DialogContentText>
        
      </DialogContent>

      <DialogActions>

        <Button onClick={handleRequestClose} color="primary">
          Cancel
        </Button>

        <Button onClick={deleteAccount} color="secondary" autoFocus="autoFocus">
          Confirm
        </Button>
        
      </DialogActions>
    </Dialog>
  </span>)

}

