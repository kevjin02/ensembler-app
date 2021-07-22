import React from 'react'
import Typography from '@material-ui/core/Typography'
import {withRouter} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  footer: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));  

const Footer = withRouter(function () {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
    <Typography variant="subtitle1" align="center" color="secondary" component="h5">
    This is a test application. All data and users are for demonstration only.
    </Typography>
    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
    &copy; Kevin Jin 2021
    </Typography>
  </footer>
      
   
    
  )
} )

export default Footer
