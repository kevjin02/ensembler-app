import React, {useState} from 'react'
import {usePlacesWidget} from "react-google-autocomplete";
import {create} from './api-user.js'
import {Link, useLocation} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Icon from '@material-ui/core/Icon'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  registerType: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    width: '180px;',
    '&$selected': {
      color: 'white',
      '&:hover': {
        color: theme.palette.primary.main,
      },
  },
  ytLink: {
  }
}}))

export default function Register() {
  let loc = useLocation();
  const classes = useStyles()
  
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: '',
    musician: (loc.state == null ? false : loc.state),
      lat:'',
      long:'',
      instrument: '',
      ytlink: ''
  })
  const [location, setLocation] = useState({
    address: '',
    lat: '',
    long: ''
  })
 

  const handleChange = name => event => {

    if(name === 'location')
      setLocation({...location, address: event.target.value})
    else 
      setValues({ ...values, [name]: event.target.value })
  }


  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      musician: values.musician,
      location: location.address || undefined,
      lat: location.lat || undefined,
      long: location.long || undefined,
      instrument: values.instrument || undefined,
    }

    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        setValues({ ...values, error: '', open: true})
      }
    })
  }


  const changeUser = (event, nextView) => {
    setValues({...values, musician: nextView === 'true'});
  }


  const changeLoc = place => {
    let loc = place.geometry.location.toString()
      loc = loc.substring(1,loc.length - 1).split(', ')
    setLocation({...location, address: place.formatted_address, lat : loc[0], long: loc[1]})
  }


  const {ref} = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API,
    onPlaceSelected: changeLoc,
  })

  return (
    <div>
      <Card className={classes.card}>

        <CardContent>

          <Typography variant="h6" className={classes.title}>
            Register
          </Typography>

          <ToggleButtonGroup value={''+values.musician} color="primary" exclusive onChange={changeUser} aria-label="large outlined primary button group">
            
            <ToggleButton className={classes.registerType} value='false' >General User</ToggleButton>
            <ToggleButton className={classes.registerType} value= 'true' >Musician</ToggleButton>

          </ToggleButtonGroup>

          <div>

            <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
            <TextField inputRef={ref} id="city" label="City" placeholder="" className={classes.textField} value={location.address} onChange={handleChange('location')} margin="normal"/><br/>
            <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
            <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          
          </div>

          {values.musician && (
            <FormControl className={classes.textField}>
              <InputLabel htmlFor="instrument-native-simple">Instrument</InputLabel>
              <Select
                native
                value={values.instrument}
                onChange={handleChange('instrument')}
                inputProps={{
                  name: 'instrument',
                  id: 'instrument-native-simple'
                }}>

                <option aria-label="None" value="" />
                <option value={"Violin"}>Violin</option>
                <option value={"Viola"}>Viola</option>
                <option value={"Cello"}>Cello</option>
                {/* <option value={"Quartet"}>Full Quartet</option> */}

              </Select>

              <br/>

              <Card>

                <CardContent>
                  <Typography variant='body2' component='p'>Please provide a Youtube link to a video of you playing one major scale, one minor scale, and a five-minute excerpt of a solo piece of your choosing.</Typography>
                  <TextField id="Youtube Link" label="Youtube Link" className={classes.ytLink} value={values.ytlink} onChange={handleChange('ytlink')} margin="normal"/>
                </CardContent>

              </Card>

            </FormControl>
            
          )}

          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}</Typography>)

          }
        </CardContent>

        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>

      </Card>

      <Dialog open={values.open} disableBackdropClick={true}>

        <DialogTitle>New Account</DialogTitle>

        <DialogContent>

          <DialogContentText>
            {values.musician ? 'Application sent and approved.':'New account successfully created.'}
          </DialogContentText>

        </DialogContent>

        <DialogActions>

          <Link to="/login">
            <Button color="primary" autoFocus="autoFocus" variant="contained">
              Log In
            </Button>
          </Link>

        </DialogActions>

      </Dialog>

  </div>
  )
}