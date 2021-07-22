import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import auth from './../auth/auth-helper'
import {listUserFeed} from './../posts/api-post.js'
import Post from './../posts/Post'
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  card: {
    margin: 'auto',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(3)
  },
  nopostscard: {
    paddingTop: theme.spacing(3),
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  media: {
    minHeight: 330
  }
}))
export default function Newsfeed () {
  const classes = useStyles()
  const [posts, setPosts] = useState([])
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listUserFeed({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setPosts(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [])

  const addPost = (post) => {
    const updatedPosts = [...posts]
    updatedPosts.unshift(post)
    setPosts(updatedPosts)
  }
  const removePost = (post) => {
    const updatedPosts = [...posts]
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts(updatedPosts)
  }

    return (
      <Card className={classes.card}>
      {posts.length === 0 ? (<span>
        <Typography variant="h3" className="title">
        No Posts Here!
      </Typography>
      <Typography variant="subtitle1">
        Start by creating a <Link to="/create-post">
                    New Posting
                  </Link>
      </Typography>
      </span>) : 
      
      (
        <div style={{marginTop: '24px'}}>
        {posts.map((item, i) => {
            return <Post post={item} key={i} onRemove={removePost}/>
          })
        }
      </div>
      )}
      </Card>
    )
}

