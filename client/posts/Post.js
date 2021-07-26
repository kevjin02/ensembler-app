import React, {useState} from 'react'
import auth from './../auth/auth-helper'
import Comments from './Comments'
import moment from 'moment'
import { follow, unfollow ,remove} from './api-post'
import EnsemblePositions from './EnsemblePositions'
import EnsembleChat from './EnsembleChat'
import {Link} from 'react-router-dom'

import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import CommentIcon from '@material-ui/icons/Comment'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth:700,
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
   float: 'right'
  },
  dialogPaper : {
    minHeight: '80vh',
    maxHeight: '80vh'
},
}))


  /**
 * Post (parent: Postings)
 * @param {Object} props -  item    : post object
 *                          onRemove : parent function to remove a post
 * 
 * @returns {Object} - A posting
 */
export default function Post (props){

  const classes = useStyles()

  const jwt = auth.isAuthenticated()

  const [values, setValues] = useState({
    comments: props.post.comments,
    following: props.post.followers.includes(jwt.user._id),
    open: false,
    confirmOpen: false
    
  })

  //update comments section when comment is posted
  const updateComments = (comments) => {
    setValues({...values, comments: comments})
  }


  //delete a post from api-post
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
    handleConfirmClose()
  }


  //open ensemble chat
  const viewChat = () => {
    setValues({...values, open: true})
  }


  //open confirm window
  const confirmDelete = () => {
    setValues({...values, confirmOpen: true})
  }

  //close ensemble chat
  const handleClose = () => {
    setValues({...values, open: false})
  }

  //close confirm window
  const handleConfirmClose = () => {
    setValues({...values, confirmOpen: false})
  }


  //helper function to followclickaction
  const followClick = () => {
    return followClickAction(follow)
  }

  //helper function to followclickaction
  const unfollowClick = () => {
    return followClickAction(unfollow)
  }


  //Follow or unfollow post at api-post
  const followClickAction = (followAction) => {
    followAction({
      postId: props.post._id
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, following: !values.following})
      }
    })
  }


  //Check if user is authorized to open musician chat
  const isAuthorized = () => {
    if(props.post.postedBy._id === jwt.user._id)
      return true
    return props.post.ensemble.find((item)=> (item.musician && (item.musician._id == jwt.user._id)))
  }

  return (
    <span>
      <Card className={classes.card}>

        <CardHeader
            avatar={
              <Avatar src={'/api/users/photo/'+props.post.postedBy._id}/>
            }
            action={jwt.user.musician 
            ? ((values.following ? <Button className={classes.followButton} onClick={unfollowClick} variant="contained" color="secondary">Unfollow</Button> : <Button className={classes.followButton} onClick={followClick} variant="contained" color="primary">Follow</Button>) )
            : ((props.post.postedBy._id === jwt.user._id) &&
              <IconButton onClick={confirmDelete}>
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

          <EnsemblePositions post={props.post} userJwt={jwt}/>

          <Typography component="p" className={classes.subtext}>
            {'Posted: '+moment(props.post.created).format('ddd, MMM Do YYYY, h:mm A z') }
          </Typography>
          {props.post.photo &&
            (<div className={classes.photo}>
              <img
                className={classes.media}
                src={'/api/posts/photo/'+props.post._id}
                />
            </div>)}
        </CardContent>
        {isAuthorized() && <CardActions>
          <Button className={classes.button} onClick={viewChat} aria-label="Comment" >
            <CommentIcon style={{paddingRight: '5px'}}/> {' Open Musician Chat'}
          </Button>
        </CardActions>}

        <Divider/>
        
        <Comments postId={props.post._id} postedbyId={props.post.postedBy._id} comments={values.comments} updateComments={updateComments}/>
      </Card>

      <Dialog  classes={{paper: classes.dialogPaper}} open={values.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <EnsembleChat handleClose={handleClose} postChat = {props.post.ensembleChat} postId={props.post._id}/>
      </Dialog>
      <Dialog open={values.confirmOpen} onClose={handleConfirmClose}>

        <DialogTitle>Delete Post?</DialogTitle>

        <DialogContent>

          <DialogContentText>
            {'You will not be able to undo this action and will not be refunded'}
          </DialogContentText>

        </DialogContent>

        <DialogActions>

          <Button autoFocus="autoFocus"  color="primary" onClick={handleConfirmClose}>
              Cancel
            </Button>

            <Button color="secondary" onClick={deletePost} >
              Delete
            </Button>

        </DialogActions>

        </Dialog>
    </span>
    
  )
  
}
