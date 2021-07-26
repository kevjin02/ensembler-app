import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import ApplicationItem from './ApplicationItem'
import auth from './../auth/auth-helper'
import {approve, decline} from './api-post'

import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon'


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        textAlign: 'center',
        margin: '40px 0'
    },
    appButton: {
        width: '280px',
    },
    closeButton: {
        float: 'right'
    },
    error: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(1)
    },
    errorItem: {
      textAlign: 'center',
    }
  }))


  export default function ViewApplications(props) {
    const classes = useStyles()
    const jwt = auth.isAuthenticated()

    const [appView, setAppView] = useState({
        apps: props.apps,
        viewApps: false,
        error: ''
    })


    const viewApps = () => {
        setAppView({...appView, open: true})
    }


    const handleClose = () => {
      setAppView({...appView, open: false, error: ''})
    }


    const approveApp = (index, musicianId) => {
      approve({
          postId: props.id,
        }, {
          t: jwt.token
        },  {instrument: appView.apps[index].instrument, musicianId: musicianId}).then((data) => {
          if (data.error) {
            setAppView({...appView, error: data.error})
          } else {
            setAppView({...appView, apps: data.applications, error: ''})
            props.updateEnsemble(data.ensemble)
          }
        })
    }

    const declineApp = (index) => {
      decline({
          postId: props.id,
        }, {
          t: jwt.token
        },  {appId: appView.apps[index]._id}).then((data) => {
          if (data.error) {
            setAppView({...appView, error: data.error})
          } else {
            setAppView({...appView, apps: data, error: ''})
          }
        })
    }


    return (
      <div className={classes.root}>

        <Button className={classes.appButton} onClick={viewApps} variant="contained" color="primary">
            View Applications ({appView.apps.length})
        </Button>

        <Dialog fullWidth={true} className={classes.appReview} open={appView.open} onClose={handleClose} aria-labelledby="form-dialog-title">
            
          <DialogTitle id='form-dialog-title' >Approve applications

            <Button className={classes.closeButton} onClick={handleClose} color="primary">
              Close
            </Button>

          </DialogTitle>
          
          <DialogContent>

            

            <DialogContentText>
            {appView.error && (<div className={classes.errorItem}><Typography className={classes.error} component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
            {appView.error}</Typography></div>
            )}
              {appView.apps.map((appItem, i) => {
                  return (<ApplicationItem decline={declineApp} approve={approveApp} key={i} index={i} app={appItem}/>)
              })}

              
            </DialogContentText>
           
          </DialogContent>
        </Dialog>
      </div>);
}

  