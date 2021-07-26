import React, {useState} from 'react'
import {apply} from './api-post'

import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Icon from '@material-ui/core/Icon'


const useStyles = makeStyles(theme => ({
    tileText: {
      textAlign: 'center',
      
    },
    applyButton: {
      width: '100%',
      height: '100%',
      borderRadius: '10px',
      borderWidth: '2px',
      borderColor: 'rgba(0,0,0,0.25)',
      backgroundColor: 'inherit',
      cursor: 'pointer',
      borderStyle: 'dashed',
      '&:hover': {
        borderColor: 'rgba(0,0,0,0.5)',
      }
    },
    error: {
      verticalAlign: 'middle',
      margin: '5px auto'
    },
  }))

//Helper function for success alert
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * SignUpButton (parent: EnsemblePositions)
 * @param {Object} props -  post       : post object
 *                          instrument : instrument of position
 *                          userJwt    : user credentials
 * 
 * @returns {Object} - Apply button with window to provide description of application
 */
export default function SignUpButton(props) {
  const classes=useStyles()

  const setDefault = {
      description: '',
      open: false,
      error: ''
      }

  const [application, setApplication] = useState(setDefault)

  const [alert, setAlert] = useState(false);
    

  //handle change in input in application
  const handleChange = event => {
    setApplication({ ...application, description: event.target.value })
  }
  

  //handle closing success alert
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlert(false);
  };
    

  //submit application to be posted in api-post
  const handleApply = () => {
      apply({
        postId: props.post._id,
      }, {
        t: props.userJwt.token
      }, {instrument: props.instrument, description: application.description || undefined}).then((data) => {
        if (data.error) {
          setApplication({...application, error: data.error})
        } else {
          setApplication(setDefault)
          setAlert(true)
          
        }
      })
    
  }


  //open application window
  const signUp = () => {
      if(!props.userJwt.user.musician)
        return
      setApplication({...application, open: true})
    }


  //close application window
  const handleClose = () => {
    setApplication({...application, open: false})
  }

return (
  <span>

      <button className={classes.applyButton} onClick={signUp}  disabled={!props.instrument.includes(props.userJwt.user.instrument)}>
        
        <Typography component="p" className={classes.tileText}>
          {'Sign up for ' + props.instrument}
        </Typography>

      </button>
      <Dialog open={application.open} onClose={handleClose} aria-labelledby="form-dialog-title">

        <DialogTitle id='form-dialog-title' >Apply</DialogTitle>
              
          <DialogContent>

            <DialogContentText>
              Please provide more information about you to be considered for this position.
            </DialogContentText>

            <TextField
            autoFocus
            margin='dense'
            multiline
            rows={4}
            onChange={handleChange}
            fullWidth/>
            <br/> {
        application.error && (<Typography component="p" color="error">
          <Icon color="error" className={classes.error}>error</Icon>
          {application.error}</Typography>)

            }   
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>

            <Button onClick={handleApply} color="primary">
              Apply
            </Button>

          </DialogContent>

      </Dialog>

      <Snackbar open={alert} autoHideDuration={3000} onClose={handleCloseAlert}>

      <Alert onClose={handleClose} severity="success">
        Application submitted!
      </Alert>

    </Snackbar>

  </span>)

}