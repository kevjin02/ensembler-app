import React, {useState} from 'react'
import {removeMusician} from './api-post'

import {makeStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
  removeMusician: {
    float: 'right',
    position: 'absolute',
    marginLeft: '33px',
    height: '5px',
    width: '5px'
  },
  deleteIcon: {
    height: '20px',
    width: '20px'
  }
}))


/**
 * DelMusicianbutton (parent: EnsemblePositions)
 * @param {Object} props -  userJwt     : Login credentials
 *                          postId      : Id of post to remove musician from
 *                          member      : Object containing musician and instrument
 *                          setEnsemble : parent function to set ensemble
 * 
 * @returns {Object} - Button to delete a musician
 */
export default function DelMusicianButton(props) {

  const classes = useStyles()

  const [open, setOpen] = useState(false)

  //open confirm window
  const openConfirm = () => {
    setOpen(true)
  }

  //close confirm window
  const closeConfirm = () => {
    setOpen(false)
  }
  
  //delete musician from api-post
  const delMusician = () => { 
    
    removeMusician({
      postId: props.postId
    }, {
      t: props.userJwt.token
    }, props.member._id).then((data) => {
      if(data.error) {
        console.log(data.error)
      } else {
        props.setEnsemble(data)
      }
    })
  }

  return (<span>
    <IconButton className={classes.removeMusician} onClick={openConfirm}>
      <DeleteIcon className={classes.deleteIcon} />
    </IconButton>
    <Dialog open={open} disableBackdropClick={true} onClose={closeConfirm}>

        <DialogTitle>Delete Musician?</DialogTitle>

        <DialogContent>

          <DialogContentText>
            You could be billed depending on the circumstances.
          </DialogContentText>

        </DialogContent>

        <DialogActions>

        <Button autoFocus="autoFocus"  onClick={closeConfirm} color="primary">
          Cancel
        </Button>

        <Button onClick={delMusician} color="secondary">
          Confirm
        </Button>

        </DialogActions>

      </Dialog>
    </span>)
}