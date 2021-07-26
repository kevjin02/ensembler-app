import React from 'react'
import violinImg from './../assets/images/violin.jpg'
import {Link} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMoneyBillWave, faHandshake, faEnvelope } from "@fortawesome/free-solid-svg-icons";


const useStyles = makeStyles(theme => ({
    title: {
      padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
      color: '#111111'
    },
    heroContent: {
      backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      
      backgroundImage: `url(${violinImg})`,
      padding: theme.spacing(18, 0, 12),
    },
    heroButtons: {
      marginTop: theme.spacing(4),
    },
    cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
      textAlign: 'center',
      color: '#3f4771'
    },
    titleImage: {
      color: 'white'
    },
    featuresTitle: {
      margin: theme.spacing(2,0)
    },
    contactMe: {
      backgroundColor: '#3f4771',
      padding: theme.spacing(18, 0, 12),
      textAlign: 'center',
      color: 'white',
      lineHeight: '75px'
    },
    email: {
      paddingLeft: '10px'
    },
    contactMeButton: {
      '&:hover': {
        backgroundColor: '#fff',
        color: '#3f4771',
    },
    },
    findWorkButton: {
        color: 'white',
        borderColor: 'white'
    },
  }))

/**
 * Default home view when not logged in
 */
export default function HomeView() {

    const classes = useStyles()

    return (
      <main>
        <div className={classes.heroContent}>

          <Container className={classes.titleImage}  maxWidth="sm">

            <Typography component="h1" variant="h2"  gutterBottom>
              <strong>Assemble Your Ensemble</strong>
            </Typography>

            <Typography variant="h5" paragraph>
              Find talented musicians in your area for your next big event.
            </Typography>

            <div className={classes.heroButtons}>

              <Grid container spacing={2}>

                <Grid item>

                  <Link to={{pathname:'/register', state:false}}>
                    <Button className={classes.findMusicButton} variant="contained" color="primary">
                        Find musicians
                    </Button>
                  </Link>
                    
                </Grid>
                <Grid item>
                  <Link to={{pathname:'/register', state:true}}>
                    <Button className={classes.findWorkButton}  variant="outlined">
                      Find work 
                    </Button>
                  </Link>

                </Grid>

              </Grid>

            </div>

          </Container>

        </div>

        <Container className={classes.cardGrid} maxWidth="md">

          <Grid container spacing={8}>

            <Grid item xs={12} sm={6} md={4} >

              <FontAwesomeIcon size='3x' icon={faMoneyBillWave} />

              <Typography className={classes.featuresTitle} variant="h4">
                  Cost effective.
              </Typography>

              <Typography component="h3">
                Find quality musicians without having to pay excessively for expensive quartets.
              </Typography>
              
            </Grid>

            <Grid item  xs={12} sm={6} md={4}>

              <FontAwesomeIcon size='3x' icon={faClock} />
              
              <Typography className={classes.featuresTitle} variant="h4">
                Easy to use.
              </Typography>

              <Typography  component="h3">
                Post your event, review applications, and organize your ensemble all in one place.
              </Typography>

            </Grid>

            <Grid item  xs={12} sm={6} md={4}>

              <FontAwesomeIcon size='3x' icon={faHandshake} />

              <Typography className={classes.featuresTitle} variant="h4">
                Reliable.
              </Typography>

              <Typography component="h3">
                All musicians must submit an application that is reviewed by our moderators.
              </Typography>

            </Grid>

          </Grid>

        </Container>

        <Container className={classes.contactMe} maxWidth='lg'>

          <Typography component="h1" variant="h2" gutterBottom>
              <strong>Have any additional questions?</strong>
          </Typography>

          <Typography variant="h5" paragraph>
            Let our team know!
          </Typography>

          <a style={{color: 'inherit'}}>

            <Button className={classes.contactMeButton} variant="outlined" color="inherit">
              <FontAwesomeIcon icon={faEnvelope} />

              <Typography className={classes.email} component="p">
                Contact us
              </Typography>

            </Button>

          </a> 

        </Container>
        
    </main>)
}