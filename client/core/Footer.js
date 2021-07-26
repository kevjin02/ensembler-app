import React from 'react'
import {withRouter} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(6),
  },
}));  


/**
 * Footer for every page.
 */
const Footer = withRouter(function () {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>

      <Typography variant="subtitle1" align="center" color="secondary" component="h5">
        This application is for demonstration only.
      </Typography>

      <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        &copy; Kevin Jin 2021
      </Typography>

  </footer>
      
   
    
  )
})

export default Footer
