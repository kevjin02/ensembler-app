import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import {listByMusicianArea} from './api-post.js'
import Post from './Post'

import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'

const useStyles = makeStyles(theme => ({
  card: {
    margin: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing(3)
  },
}))

  /**
 * Post (parent: MainRouter)
 * @returns {Object} - Page with list of postings for musician by their city
 */
export default function Postings () {

  const classes = useStyles()

  const [posts, setPosts] = useState([])

  const jwt = auth.isAuthenticated()

  //Load by musician city on mount
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByMusicianArea({
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


  //remove post from postings
  const removePost = (post) => {
    const updatedPosts = [...posts]
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts(updatedPosts)
  }

    return (
      <Card className={classes.card}>
        <div style={{marginTop: '24px'}}>
        {posts.map((item, i) => {
            return <Post post={item} key={i} onRemove={removePost}/>
          })
        }
        </div>
      </Card>
    )
}

