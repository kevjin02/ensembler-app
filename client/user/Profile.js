import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Divider from '@material-ui/core/Divider'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import {read, addReview} from './api-user.js'
import {Redirect, Link} from 'react-router-dom'
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  cardRoot: {
    marginBottom: '10px'
  },
  title: {
    marginTop: theme.spacing(1),
    color: theme.palette.protectedTitle
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  },
  totalRatings: {
    marginTop: '35px',
    marginLeft: '-10px'
  },
  reviewSummary: {
    position: 'relative',
    float: 'right',
    right: '20px',
    marginTop: '-0px',
    fontSize: '50px'
  },
  totalReviews: {
    position: 'relative',
    // float: 'right',
    top: '10px',
    right: '-337px'
  },
  reviewButton: {
    marginTop: '-43px',
    float: 'right',
    marginRight: '0px',
    // position: 'absolute
  },
  reviewRating: {
    margin: '-40px 0 20px 20px'
  },
  description: {
    margin: '0 20px'
  },
}))

export default function Profile({ match }) {
  const classes = useStyles()
  const [values, setValues] = useState({
    user: {},
    reviews: [],
    redirectToLogin: false,
    following: false,
    open: false,
    error: '',
    reviewWriting: '',
    reviewStar: ''
  })
  const jwt = auth.isAuthenticated()

  const findavg = () => {
    if(values.user.reviews.length === 0){
      return null
    }
    var findav = 0
    values.user.reviews.forEach((val) => {
      console.log(val)
      findav += val.rating
    })
    return  Math.round((findav / values.user.reviews.length) * 10) / 10

  }
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, redirectToLogin: true})
      } else {
        setValues({...values, user: data})
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])
  console.log(values.user)
      
  
    if (values.redirectToLogIn) {
      return <Redirect to='/login'/>
    }
  const openReviewWindow = () => {
    setValues({...values, open: true})
  }

  const closeReviewWindow = () => {
    setValues({...values, open: false})
  }

  const handleSubmitReview = () => {
    console.log(values.reviewWriting, values.reviewStar)
    addReview({
      userId: match.params.userId
    }, {t:jwt.token}, {poster: jwt.user._id, rating: values.reviewStar,  description: values.reviewWriting}).then((data) => {
      if(data.error) {
        console.log(data.error)
        setValues({...values, error: data.error})
      } else {
        setValues({...values, reviews: data, open: false})
      }
    })
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const setRating = (event, newValue) => {
    setValues({...values, reviewStar: newValue})
  }

  


    return (
      <div>
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h6" className={classes.title}>
          Profile
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
            <Avatar src={values.user._id
    ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
    : '/api/users/defaultphoto'} className={classes.bigAvatar}/>
            </ListItemAvatar>
            <ListItemText primary={values.user.name} secondary={values.user.musician ? values.user.instrument : 'Client'}/> {
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == values.user._id &&
              (<ListItemSecondaryAction>
                <Link to={"/user/edit/" + values.user._id}>
                  <IconButton aria-label="Edit" color="primary">
                    <Edit/>
                  </IconButton>
                </Link>
                <DeleteUser userId={values.user._id}/>
              </ListItemSecondaryAction>)
            }
          </ListItem>
          <Divider/>
          <ListItem>
            <ListItemText primary={values.user.about} secondary={"Joined: " + (
              new Date(values.user.created)).toDateString()}/>
          </ListItem>
        </List>
      </Paper>
      {values.user.musician && <Paper className={classes.root} elevation={1}>
        <Typography variant="h6" className={classes.title}>
          Customer Reviews
        </Typography>
        
        <Box component="fieldset" mb={3} borderColor="transparent">
        <Rating name="read-only" precision={0.1} value={findavg()} size={'large'} readOnly className={classes.totalRatings} />
        {values.user.pastCustomers.includes(jwt.user._id) && <Button variant="contained" className={classes.reviewButton} onClick={openReviewWindow}>
          Write A Review
        </Button>}
        
          <Typography variant="h2" className={classes.reviewSummary}>
            {values.user.reviews.length === 0 ? '--' : findavg()}/5
          </Typography>
          <Typography variant="p" className={classes.totalReviews}>
            {values.user.reviews.length} Review{values.user.reviews.length===1 ? '' : 's'}
          </Typography>

        </Box>
          {values.user.reviews.map((item, i) => {
            console.log(item.description)
            return <div><Card className={classes.cardRoot} elevation={0}>
            <CardHeader 
              avatar={
                    <Avatar src={item.poster._id
                            ? `/api/users/photo/${item.poster._id}?${new Date().getTime()}`
                          : '/api/users/defaultphoto'} className={classes.bigAvatar}/>
              }
              title={<bold className={classes.reviewerName}>{item.poster.name}</bold>}
           
            subheader={(new Date(item.created)).toDateString()}
            
            />
            <CardContent>
            <Rating name="read-only" className={classes.reviewRating} value={item.rating} size={'medium'} readOnly/>
            <div className={classes.description}>
              <Typography variant="body2">
                {item.description}
              </Typography>
            </div>
              
            </CardContent>
              
          </Card>
          <Divider variant="middle" /></div>
          }
        
        

        )}
      </Paper>}

      <Dialog open={values.open} fullWidth onClose={closeReviewWindow} aria-labelledby="form-dialog-title">
              <DialogTitle  id='form-dialog-title' >Leave a review</DialogTitle>
              
              <DialogContent className={classes.reviewSize}>
                <Rating
                  name="hover-feedback"
                  value={values.reviewStar}
                  precision={0.5}
                  onChange={setRating}
                />
                <DialogContentText className={classes.reviewSize}>
                  Write about your experience here:
                </DialogContentText>
                <TextField
                autoFocus
                margin='dense'
                multiline
                rows={4}
                onChange={handleChange('reviewWriting')}
                fullWidth/>
                <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}</Typography>)

          }
                <Button onClick={closeReviewWindow} color="primary">
                   Cancel
                </Button>
                <Button onClick={handleSubmitReview} color="primary">
                   Submit
                </Button>
              </DialogContent>
      </Dialog>


      </div>
    )
  }