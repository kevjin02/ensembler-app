import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import {usePlacesWidget} from "react-google-autocomplete";
import {create} from './api-post.js'
import {Redirect} from 'react-router-dom'

import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth:600,
    margin: 'auto',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  cardContent: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8
  },
  textField: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    
    width: '90%'
  },
  ensembleField: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    
    width: '90%'
    
  },

  dateField: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: '90%'
    

  },
  submit: {
    margin: theme.spacing(2),
    margin: 'auto'
  },

  error: {
    verticalAlign: 'middle'
  }
}))

/**
 * NewPost (parent: MainRouter)
 * 
 * @returns {Object} - Page to create new post
 */
export default function NewPost (){

  const classes = useStyles()

  const jwt = auth.isAuthenticated()

  const [values, setValues] = useState({
    title: '',
    description: '',
    eventStart: '',
    eventEnd: '',
    ensemble: 'Quartet',
    error: '',
    redirectToReferrer: false
  })

  const [open, setOpen] = useState(false)

  const [location, setLocation] = useState({
    address: '',
    lat: '',
    long: ''
  })

  //open confirm window
  const openConfirm = () => {
    setOpen(true)
  }

  //close confirm window
  const closeConfirm = () => {
    setOpen(false)
  }
  
  //submit post to api-post to create
  const clickPost = () => {
    const postData = {
      title: values.title || undefined,
      description: values.description || undefined,
      eventTime: {
        start: values.eventStart || undefined,
        end: values.eventEnd || undefined,
      },
      address: location.address || undefined,
      lat: location.lat || undefined,
      long: location.long || undefined
    }
    switch (values.ensemble) {
      case "Quartet":
        postData['ensemble'] = [{instrument: 'Violin 1'},{instrument: 'Violin 2'},{instrument: 'Viola'},{instrument: 'Cello'}]
    }
    
    create({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, postData).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({ ...values, error: '',redirectToReferrer: true})
      }
    })
  }


  //use google maps places api to display establishments
  const {ref} = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API,
    onPlaceSelected: (place)=> {
      let loc = place.geometry.location.toString()
      loc = loc.substring(1,loc.length - 1).split(', ')
      setLocation({...location, address: place.formatted_address, lat : loc[0], long: loc[1]})

    },
    options: {
      types: ["establishment"]
    }
  })

  //handle change in input
  const handleChange = name => event => {
    if(name === 'location')
      setLocation({...location, address: event.target.value})
    else
      setValues({...values, [name]: event.target.value })
  }

    
  const {redirectToReferrer} = values
  
  //redirect to home with values
  if (redirectToReferrer) {
      return (<Redirect to={{pathname: '/'}}/>)
  }

  
  return (<span>
    <Card className={classes.card}>
    <CardHeader
          className={classes.cardHeader}
        />
    <CardContent className={classes.cardContent}>
    
    <TextField
          placeholder="Title..."
          multiline
          rows="1"
          value={values.title}
          onChange={handleChange('title')}
          className={classes.textField}
          margin="normal" 
      />
      <TextField
      inputRef={ref}
          placeholder="Address..."
          multiline
          rows="1"
          value={location.address}
          onChange={handleChange('location')}
          className={classes.textField}
          margin="normal"
      />
      <Grid container className={classes.dateField}>
      <Grid item xs>
      <TextField
      margin="normal"
      id="datetime-local"
      label="Event Start Time"
      type="datetime-local"
      value={values.eventStart}
        onChange={handleChange('eventStart')}
      InputLabelProps={{
        shrink: true,
      }}
    />
      </Grid>
      
      <Grid item xs>
      <TextField
      margin="normal"
      id="datetime-local"
      label="Event End Time"
      type="datetime-local"
      value={values.eventEnd}
        onChange={handleChange('eventEnd')}
      InputLabelProps={{
        shrink: true,
      }}
    />
      </Grid>
      </Grid>
      <TextField
          placeholder="Description..."
          multiline
          rows="8"
          value={values.description}
          onChange={handleChange('description')}
          className={classes.textField}
          margin="normal"
      />
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={values.ensemble}
        className={classes.ensembleField} 
        onChange={handleChange('ensemble')}
      >
        <MenuItem value={'Quartet'}>Quartet (default)</MenuItem>
      </Select>
      
      
      
      
      { values.error && (<Typography component="p" color="error">
          <Icon color="error" className={classes.error}>error</Icon>
            {values.error}
          </Typography>)
      }
    </CardContent>
    <CardActions>
      <Button color="primary" variant="contained" disabled={values.text === ''} onClick={openConfirm} className={classes.submit}>POST</Button>
    </CardActions>
  </Card>
  <Dialog open={open} disableBackdropClick={true} onClose={closeConfirm}>

        <DialogTitle>Make Posting?</DialogTitle>

        <DialogContent>

          <DialogContentText>
            You will not be able make any changes.
          </DialogContentText>

        </DialogContent>

        <DialogActions>

        <Button autoFocus="autoFocus"  onClick={closeConfirm} color="primary">
          Cancel
        </Button>

        <Button onClick={clickPost} color="secondary">
          Confirm Payment
        </Button>

        </DialogActions>

      </Dialog>
  </span>)

}

