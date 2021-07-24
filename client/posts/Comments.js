import React, {useState} from 'react'
import auth from './../auth/auth-helper'
import CardHeader from '@material-ui/core/CardHeader'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import {comment, uncomment} from './api-post.js'
import {Link} from 'react-router-dom'
import theme from '../theme'
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    maxHeight: '500px',
    overflow: 'auto'
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  smallAvatar: {
    width: 25,
    height: 25
  },
  commentField: {
    width: '96%'
  },
  commentText: {
    // backgroundColor: 'white',
    padding: theme.spacing(1),
    margin: `2px ${theme.spacing(2)}px 2px 2px`
  },
  commentDate: {
    display: 'block',
    color: 'gray',
    fontSize: '0.8em'
 },
 commentDelete: {
   fontSize: '1.6em',
   verticalAlign: 'middle',
   cursor: 'pointer'
 }
}))

export default function Comments (props) {
  const classes = useStyles()
  const [text, setText] = useState('')
  const jwt = auth.isAuthenticated()
  const handleChange = event => {
    setText(event.target.value)
  }

  const addCommentEnter = (event) => {
    if(event.keyCode == 13 && event.target.value){
      event.preventDefault()
      addComment()
    }
  }
  const addComment = () => {
      comment({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, props.postId, {text: text}).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setText('')
          props.updateComments(data.comments)
        }
      })
    
  }

  const deleteComment = comment => event => {
    uncomment({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, props.postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        props.updateComments(data.comments)
      }
    })
  }

    const commentBody = item => {
      console.log(item.postedBy)
      return (
        <p className={classes.commentText} style={{backgroundColor: (props.postedbyId === item.postedBy._id ? '#fff1f5' : 'white')}}>
          <Link to={"/user/" + item.postedBy._id}>{item.postedBy.name}</Link> - {item.postedBy.musician ? item.postedBy.instrument : 'Client'}<br/>
          {item.text}
          <span className={classes.commentDate}>
            {(new Date(item.created)).toDateString()}
            {auth.isAuthenticated().user._id === item.postedBy._id &&
            <span> |<Icon onClick={deleteComment(item)} className={classes.commentDelete}>delete</Icon> </span>
              }
          </span>
        </p>
      )
    }

    return (<div className={classes.root}>
        <CardHeader
              avatar={
                <Avatar className={classes.smallAvatar} src={'/api/users/photo/'+auth.isAuthenticated().user._id}/>
              }
              title={ <TextField
                onKeyDown={addCommentEnter}
                multiline
                value={text}
                onChange={handleChange}
                placeholder="Write public comment ..."
                className={classes.commentField}
                margin="normal"
                InputProps={{endAdornment:<InputAdornment position="end">
                  {text && <Button onClick={addComment}>Send</Button>}
              </InputAdornment>}}
                />}
              className={classes.cardHeader}
        />
        { props.comments.map((item, i) => {
            return <CardHeader
                      avatar={
                        <Avatar className={classes.smallAvatar} src={'/api/users/photo/'+item.postedBy._id}/>
                      }
                      
                      title={commentBody(item)}
                      className={classes.cardHeader}
                      key={i}/>
              })
        }
    </div>)
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired
}
