import React, {useState} from 'react'
import auth from './../auth/auth-helper'
import {comment, uncomment} from './api-post.js'
import {Link} from 'react-router-dom'

import {makeStyles} from '@material-ui/core/styles'
import CardHeader from '@material-ui/core/CardHeader'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
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

/**
 * Comments section (parent: Post)
 * @param {Object} props -  postId         : Id of post
 *                          postedbyId     : Id of user who posted post
 *                          comments       : array of comments objects
 *                          updateComments : parent function to update comments section
 * 
 * @returns {Object} - Comment section
 */
export default function Comments (props) {
  const classes = useStyles()

  const [text, setText] = useState('')

  const jwt = auth.isAuthenticated()


  //update comment input text
  const handleChange = event => {
    setText(event.target.value)
  }
  

  //add comment when enter is pressed
  const addCommentEnter = (event) => {
    if(event.keyCode == 13 && event.target.value){
      event.preventDefault()
      addComment()
    }
  }


  //Adds comment from api-post
  const addComment = () => {
      comment({
        postId: props.postId
      }, {
        t: jwt.token
      }, {text: text}).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setText('')
          props.updateComments(data)
        }
      })
    
  }


  //Deletes comment from api-post
  const deleteComment = comment => event => {
    uncomment({
      postId: props.postId
    }, {
      t: jwt.token
    }, comment).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        props.updateComments(data)
      }
    })
  }

  //Helper function containing comment body
  const commentBody = item => {
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