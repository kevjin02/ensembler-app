import React, { useState } from 'react'
import auth from './../auth/auth-helper'
import {addReview} from './api-user.js'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
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

const useStyles = makeStyles(theme => ({
    root: {
      maxWidth: 600,
      margin: 'auto',
      padding: theme.spacing(3),
      marginTop: theme.spacing(5)
    },
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
      top: '10px',
      right: '-337px'
    },
    reviewButton: {
      marginTop: '-43px',
      float: 'right',
      marginRight: '0px',
    },
    reviewRating: {
      margin: '-40px 0 20px 20px'
    },
    description: {
      margin: '0 20px'
    },
  }))


/**
 * Reviews (parent: Profile)
 * @param {Object} props -  profileId   : Id of profile
 *                          user        : user object
 *                          updatedUser : parent function to update user
 * 
 * @returns {Object} - Reviews part of profile page for musicians
 */
export default function Reviews(props) {
    const classes = useStyles()

    const jwt = auth.isAuthenticated()

    const [values, setValues] = useState({
        reviews: [],
        open: false,
        error: '',
        reviewWriting: '',
        reviewStar: ''
      })


    //open review window
    const openReviewWindow = () => {
    setValues({...values, open: true})
    }


    //close review window
    const closeReviewWindow = () => {
    setValues({...values, open: false})
    }


    //send review to api-user
    const submitReview = () => {
        addReview({
            userId: props.profileId
        }, {t:jwt.token}, {poster: jwt.user._id, rating: values.reviewStar,  description: values.reviewWriting}).then((data) => {
            if(data.error) {
            setValues({...values, error: data.error})
            } else {
            setValues({...values, open: false})
            props.updateUser(data)
            }
        })
    }


    //handle change to input in review
    const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
    }


    //handle change in rating
    const setRating = (event, newValue) => {
    setValues({...values, reviewStar: newValue})
    }
    

    //helper function to find average of ratings
    const findavg = () => {
        if(props.user.reviews.length === 0){
        return null
        }

        var findav = 0

        props.user.reviews.forEach((val) => {
        findav += val.rating
        })
        return  Math.round((findav / props.user.reviews.length) * 10) / 10

    }

    return (
        <span>
            <Paper className={classes.root} elevation={1}>

            <Typography variant="h6" className={classes.title}>
                Customer Reviews
            </Typography>
            
            <Box component="fieldset" mb={3} borderColor="transparent">

            <Rating name="read-only" precision={0.1} value={findavg()} size={'large'} readOnly className={classes.totalRatings} />

            {props.user.pastCustomers.includes(jwt.user._id) && <Button variant="contained" className={classes.reviewButton} onClick={openReviewWindow}>
                Write A Review
            </Button>}
            
                <Typography variant="h2" className={classes.reviewSummary}>
                {props.user.reviews.length === 0 ? '--' : findavg()}/5
                </Typography>

                <Typography variant="p" className={classes.totalReviews}>
                {props.user.reviews.length} Review{props.user.reviews.length===1 ? '' : 's'}
                </Typography>

            </Box>

                {props.user.reviews.map((item, i) => {
                return <div>
                    <Card className={classes.cardRoot} elevation={0}>
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
                        <Rating name="read-only" precision={0.1} className={classes.reviewRating} value={item.rating} size={'medium'} readOnly/>
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
        </Paper>

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

            <Button onClick={submitReview} color="primary">
                Submit
            </Button>

        </DialogContent>

        </Dialog>
    </span>
    )
}