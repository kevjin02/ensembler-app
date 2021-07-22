import React, {useState} from 'react'
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
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import {create} from './api-user.js'
import {Link, useLocation} from 'react-router-dom'

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
    // marginTop: '30px',
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    // borderWidth: '3px',
    width: '180px;',
    '&$selected': {
      color: 'white',
      '&:hover': {
        color: theme.palette.primary.main,
      },
  },
}}))

export default function Register() {
  let location = useLocation();
  const classes = useStyles()
  
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: '',
    musician: (location.state == null ? false : location.state),
      location: '',
      instrument: ''
  })
  console.log(''+values.musician)
 

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      musician: values.musician,
      location: values.location || undefined,
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

  const changeUser = name => event => {
    console.log(name);
    setValues({...values, musician: name !== 'User'})
  }

  const changeUser1 = (event, nextView) => {
    console.log(nextView)
    setValues({...values, musician: nextView === 'true'});
    console.log(values.musician)
  };

    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Register
          </Typography>
          <ToggleButtonGroup value={''+values.musician} color="primary" exclusive onChange={changeUser1} aria-label="large outlined primary button group">
            <ToggleButton className={classes.registerType} value='false' >General User</ToggleButton>
            <ToggleButton className={classes.registerType} value= 'true' >Musician</ToggleButton>
            </ToggleButtonGroup>
            <div>
            <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          <TextField id="location" type="location" label="City" className={classes.textField} value={values.location} onChange={handleChange('location')} margin="normal"/>    
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
          }}
        >
          <option aria-label="None" value="" />
          <option value={"Violin"}>Violin</option>
          <option value={"Viola"}>Viola</option>
          <option value={"Cello"}>Cello</option>
          {/* <option value={"Quartet"}>Full Quartet</option> */}
        </Select>
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
            New account successfully created.
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