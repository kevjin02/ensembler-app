import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {apply} from './api-post'
import Icon from '@material-ui/core/Icon'

const useStyles = makeStyles(theme => ({
    card: {
      maxWidth:700,
      margin: 'auto',
      marginBottom: theme.spacing(3),
      backgroundColor: 'rgba(0, 0, 0, 0.06)'
    },
    cardContent: {
      backgroundColor: 'white',
      padding: `${theme.spacing(2)}px 0px`
    },
    cardHeader: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },
    text: {
      margin: theme.spacing(2)
    },
    followButton: {
      marginTop: theme.spacing(1)
    },
    subtext: {
      margin: theme.spacing(2),
      color:'#666666',
      fontSize: '80%'
    },
    photo: {
      textAlign: 'center',
      backgroundColor: '#f2f5f4',
      padding:theme.spacing(1)
    },
    media: {
      height: 200
    },
    button: {
     margin: theme.spacing(1),
    },
    root: {
      paddingTop: theme.spacing(2),
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
    },
    bigAvatar: {
      width: 60,
      height: 60,
      margin: 'auto'
    },
    gridList: {
      width: 650,
      height: 120,
    },
    tileText: {
      textAlign: 'center',
      
    },
    gridListTile: {
      margin: '.7% auto',
      textAlign: 'center',
      
      
    },
    gridListTileLong: {
        margin: '.7% auto',
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
      verticalAlign: 'middle'
    },
  }))


  export default function SignUpButton(props) {
      const classes=useStyles()

    const setDefault = {
        description: '',
        open: false,
        error: ''
        }
  
      const [application, setApplication] = useState(setDefault)
      
  
        const handleChange = event => {
          setApplication({ ...application, description: event.target.value })
        }
  
      
  
        const handleApply = () => {
            apply({
              userId: props.userJwt.user._id,
            }, {
              t: props.userJwt.token
            }, props.post._id, {instrument: props.instrument, description: application.description || undefined}).then((data) => {
              console.log(data)
              if (data.error) {
                console.log('epic')
                setApplication({...application, error: data.error})
              } else {
                console.log('kaitlyn sucks')
                setApplication(setDefault)
              }
            })
          
        }

    const signUp = () => {
        if(!props.userJwt.user.musician)
          return
        setApplication({...application, open: true})
      }
      const handleClose = () => {
        setApplication({...application, open: false})
      }

return (<span><button className={classes.applyButton} onClick={signUp}  disabled={!props.instrument.includes(props.userJwt.user.instrument)}><Typography component="p" className={classes.tileText}>
        {'Sign up for ' + props.instrument}
      </Typography></button>
      <Dialog open={application.open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id='form-dialog-title' >Apply</DialogTitle>
              
              <DialogContent>
              {
            application.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {application.error}</Typography>)

          }
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
              {values.error}</Typography>)

          }
                <Button onClick={handleClose} color="primary">
                   Cancel
                </Button>
                <Button onClick={handleApply} color="primary">
                   Apply
                </Button>
              </DialogContent>
      </Dialog></span>)

  }