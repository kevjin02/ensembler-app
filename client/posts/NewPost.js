import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import {create} from './api-post.js'
import {Redirect} from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


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
  photoButton: {
    height: 30,
    marginBottom: 5
  },
  input: {
    display: 'none',
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
}))

export default function NewPost (props){
  const classes = useStyles()
  const [values, setValues] = useState({
    title: '',
    description: '',
    eventStart: null,
        eventEnd: null,
    
    address: '',
    ensemble: 'Quartet',
    error: '',
    user: true,
    redirectToReferrer: false
  })
  const jwt = auth.isAuthenticated()
  useEffect(() => {
    setValues({...values, user: auth.isAuthenticated().user})
  }, [])
  const clickPost = () => {
    const postData = {
      title: values.title || undefined,
      description: values.description || undefined,
      eventTime: {
        start: values.eventStart || undefined,
        end: values.eventEnd || undefined,
      },
      address: values.address || undefined
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
  const handleChange = name => event => {
    const value = event.target.value
    setValues({...values, [name]: value })
  }

  
const {redirectToReferrer} = values
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
        placeholder="Address..."
        multiline
        rows="1"
        value={values.address}
        onChange={handleChange('address')}
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
    <Button color="primary" variant="contained" disabled={values.text === ''} onClick={clickPost} className={classes.submit}>POST</Button>
  </CardActions>
</Card>
</span>)

}

