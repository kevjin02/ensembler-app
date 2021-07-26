import React, {useState} from 'react'
import auth from './auth-helper'
import {Redirect} from 'react-router-dom'
import {login} from './api-auth.js'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'


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
    marginTop: theme.spacing(2),
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
  }
}))

/**
 * Login page that redirects to home page when successful
 * @param  {Object} props - From MainRouter.js
 *                          location : location information from router
 * 
 * @returns {Object} - Login page
 * 
 */
export default function Login(props) {
  
  const classes = useStyles()
  const [values, setValues] = useState({
      email: '',
      password: '',
      error: '',
      musician: false,
      location: '',
      instrument: '',
      redirectToReferrer: false
  })


  /**
   * Prepares object for API Login request. Displays error when unsuccessful and redirects to homepage if successful
   * @param  {Object} event - Information about click occurance
   * 
   */
  const clickSubmit = (event) => {
    event.preventDefault()
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    }


    login(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '',redirectToReferrer: true})
        })
      }
    })
  }


   /**
   * Update state to display input changes in login form
   * @param  {String} name - Name of text and state to be changed
   * 
   */
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

 /**
   * Determines destination of redirect upon login attempt
   */
  const {from} = props.location.state || {
      from: {
        pathname: '/'
      }
  }

  const {redirectToReferrer} = values


  /**
   * Redirect to homepage on successful login only
   */
  if (redirectToReferrer) {
      return (<Redirect to={from}/>)
  }

  
  return (
      <Card className={classes.card}>

        <form onSubmit={clickSubmit}>
          <CardContent>
          
          <Typography variant="h6" className={classes.title}>
            Log In
          </Typography>

          <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          

          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}
            </Typography>)
          }

         </CardContent>
          <CardActions>
            <Button type="submit" color="primary" variant="contained" className={classes.submit}>Submit</Button>
          </CardActions>
        </form>
      </Card>
    )
}
