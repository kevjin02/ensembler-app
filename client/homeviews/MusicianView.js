import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import {listMusicianFeed} from './../posts/api-post.js'
import Post from './../posts/Post'
import {Link} from 'react-router-dom'

import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'


const useStyles = makeStyles(theme => ({
  card: {
    margin: 'auto',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(3)
  },
}))

/**
 * View if user is a musician
 */
export default function MusicianView () {

  const classes = useStyles()

  const [posts, setPosts] = useState([])

  const jwt = auth.isAuthenticated()


  /**
 * Display musician feed as component is mounted
 */
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listMusicianFeed({
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

  /**
   * Remove a post from view by updating state
   * @param  {Object} post - Unfollowed post
   */
  const removePost = (post) => {
    const updatedPosts = [...posts]
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts(updatedPosts)
  }

  return (
    <Card className={classes.card}>
      {
        posts.length === 0 ? (
      <span>

        <Typography variant="h3" className="title">
          No Posts Here!
        </Typography>

        <Typography variant="subtitle1">
          Start by looking for <Link to="/posts">
                      Postings Nearby
                    </Link>
        </Typography>

      </span>) : <div style={{marginTop: '24px'}}>

      {posts.map((item, i) => {
          return <Post post={item} key={i} onRemove={removePost}/>
        })
      }

</div>
      }
      

    </Card>
  )
}

