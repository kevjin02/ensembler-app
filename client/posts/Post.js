import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import {remove, like, unlike} from './api-post.js'
import Button from '@material-ui/core/Button';
import Comments from './Comments'
import moment from 'moment'
import { follow, unfollow } from './../user/api-user'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth:600,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(0, 0, 0, 0.06)'
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing(2)}px 0px`
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  text: {
    margin: theme.spacing(2)
  },
  followButton: {
    marginTop: theme.spacing(1)
  },
  subtext: {
    margin: theme.spacing(2),
    color:'#666666',
    fontSize: '80%'
  },
  photo: {
    textAlign: 'center',
    backgroundColor: '#f2f5f4',
    padding:theme.spacing(1)
  },
  media: {
    height: 200
  },
  button: {
   margin: theme.spacing(1),
  }
}))

export default function Post (props){
  console.log(props)
  const classes = useStyles()
  const jwt = auth.isAuthenticated()
  const [values, setValues] = useState({
    comments: props.post.comments,
    following: props.post.followers.includes(jwt.user._id)
    
  })

  
  
  // useEffect(() => {
  //   setValues({...values, like:checkLike(props.post.likes), likes: props.post.likes.length, comments: props.post.comments})
  // }, [])

  

  const updateComments = (comments) => {
    setValues({...values, comments: comments})
  }

  const deletePost = () => {   
    remove({
      postId: props.post._id
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        props.onRemove(props.post)
      }
    })
  }

  const followClick = () => {
    return followClickAction(follow)
  }
  const unfollowClick = () => {
    return followClickAction(unfollow)
  }

  const followClickAction = (followAction) => {
    followAction({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, props.post._id).then((data) => {
      if (data.error) {
        console.log(data.error)
        setValues({...values, error: data.error})
      } else {
        setValues({...values, following: !values.following})
      }
    })
  }

    return (
      <Card className={classes.card}>
        <CardHeader
            avatar={
              <Avatar src={'/api/users/photo/'+props.post.postedBy._id}/>
            }
            action={auth.isAuthenticated().user.musician 
            ? ((values.following ? <Button className={classes.followButton} onClick={unfollowClick} variant="contained" color="secondary">Unfollow</Button> : <Button className={classes.followButton} onClick={followClick} variant="contained" color="primary">Follow</Button>) )
            : ((props.post.postedBy._id === auth.isAuthenticated().user._id) &&
              <IconButton onClick={deletePost}>
                <DeleteIcon />
              </IconButton>
            )}
            title={<Link to={"/user/" + props.post.postedBy._id}>{props.post.postedBy.name}</Link>}
            className={classes.cardHeader}
          />
        <CardContent className={classes.cardContent}>
          <Typography variant="h4" className={classes.text}>
            {props.post.title}
          </Typography>
          <Typography component="p" className={classes.text}>
            {props.post.address}
          </Typography>
          <Typography component="p" className={classes.text}>
          {moment(props.post.eventTime.start).format('ddd, MMM Do YYYY, h:mm A z') + ' - ' + moment(props.post.eventTime.end).format('ddd, MMM Do YYYY, h:mm A z') }
           
          </Typography>
          
          <Typography component="p" className={classes.text}>
            {props.post.description}
          </Typography>
          <br/>
          <Typography component="p" className={classes.subtext}>
            {'Posted: '+moment(props.post.eventTime.start).format('ddd, MMM Do YYYY, h:mm A z') }
          </Typography>
          {props.post.photo &&
            (<div className={classes.photo}>
              <img
                className={classes.media}
                src={'/api/posts/photo/'+props.post._id}
                />
            </div>)}
        </CardContent>
        <CardActions>
          
              <IconButton className={classes.button} aria-label="Comment" color="secondary">
                <CommentIcon/>
              </IconButton> <span>{values.comments.length}</span>
        </CardActions>
        <Divider/>
        <Comments postId={props.post._id} comments={values.comments} updateComments={updateComments}/>
      </Card>
    )
  
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}
