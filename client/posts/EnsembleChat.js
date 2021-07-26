import React, {useState, useEffect} from 'react'
import moment from 'moment'
import ScrollableFeed from 'react-scrollable-feed'
import {loadChat} from './api-post'
import {Redirect, Link} from 'react-router-dom'
import auth from './../auth/auth-helper'

import {makeStyles} from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Avatar from '@material-ui/core/Avatar'

const io = require('socket.io-client')
const socket = io() 

const useStyles = makeStyles(theme => ({
    closeButton: {
        float: 'right'
    },
    messageHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        minWidth: '400px'
    },
    cardHeader: {
        display: 'auto',
        position: 'absolute',
        left: '0',
        bottom: '0',
        width: '100%',
        backgroundColor: '#F8F8F8',
        borderTop: 'solid gray',
        borderWidth: '1px',
      },
      smallAvatar: {
        width: 25,
        height: 25
      },
      messageField: {
        width: '96%'
      },
      messageText: {
        // backgroundColor: 'white',
        padding: theme.spacing(1),
        margin: `2px ${theme.spacing(2)}px 2px 2px`
      },
      messageDate: {
        display: 'block',
        color: 'gray',
        fontSize: '0.8em'
     },
     smallAvatar: {
        width: 25,
        height: 25
      },

      messageArea: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
      height: "calc( 80vh - 160px )",
      },
  }))



/**
 * EnsembleChat (parent: Post)
 * @param {Object} props -  handleClose : parent function to close chat
 *                          postChat    : ensemble chat for post
 *                          postId      : post Id
 * 
 * @returns {Object} - Chat window for ensemble
 */
export default function EnsembleChat(props) {
  const classes = useStyles()
  const jwt = auth.isAuthenticated()

  const [chat, setChat] = useState({
      chats: [],
      text: '',
      redirectToHome: false
  })

  //load chat when component is mounted
  useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      loadChat({
          postId: props.postId
      }, {t: jwt.token}, signal).then((data) => {
        if (data.error) {
          setChat({...chat, redirectToHome: true})
        } else {
          setChat({...chat, chats: data})
          abortController.abort()
        }
      })
      return function cleanup(){
        abortController.abort()
      }
  
    }, [])


  //Redirect to home if not authorized or error
  if (chat.redirectToHome) {
    return <Redirect to='/'/>
  }


  //join ensemble chatroom and listen for events on mount
  useEffect(() => {
      socket.emit('join ensemble room', {room: props.postId})
      return () => {
          socket.emit('leave ensemble room', {
              room: props.postId
          })
      }
  }, [])


  //listen for new messages on mount and update state
  useEffect(() => {
      socket.on('new message', payload => {
        setChat({...chat, chats: payload, text: ''})
      })
      return () => {
        socket.off('new message')
      }
    })
  

  //handle input in message box
  const handleChange = event => {
    setChat({...chat, text: event.target.value})
  }


  //submit message 
  const addMessage = () => {
    const jwt = auth.isAuthenticated()    
        let newMessage = {
            message: chat.text,
            time: new Date(),
            postedBy: jwt.user
            }

        socket.emit('new message', {
            room: props.postId,
            messageInfo: newMessage
        })

        setChat({...chat, text: ''})

  }


  //helper function for message body
  const messageBody = item => {
      return (
        <p className={classes.messageText} style={{backgroundColor: (jwt.user._id === item.postedBy._id ? '#fff1f5' : 'white')}}>
          <Link to={"/user/" + item.postedBy._id}>{item.postedBy.name}</Link> - {item.postedBy.musician ? item.postedBy.instrument : 'Client'}<br/>
          {item.message}
          <span className={classes.messageDate}>
            {moment(item.time).format('ddd, MMM Do YYYY, h:mm A z')}
          </span>
        </p>)
  }


  //add enter button functionality to submit message on enter
  const addMessageClick = (event) => {
    if(event.keyCode == 13 && event.target.value){
      event.preventDefault()
      addMessage()
    }
  }


  return (
      <span>
      
        <DialogTitle id='form-dialog-title' >Ensemble Chat<Button className={classes.closeButton} onClick={props.handleClose} color="primary">
                  Close
              </Button>
        </DialogTitle>
          
        <DialogContent>

          <div className={classes.messageArea}>

            <ScrollableFeed>

                {chat.chats.map((item, i) => {
                    return (<CardHeader
                      avatar={
                        <Avatar className={classes.smallAvatar} src={'/api/users/photo/'+item.postedBy._id}/>
                      }
                      
                      title={messageBody(item)}
                      className={classes.messageHeader}
                      key={i}/>)
                })}

            </ScrollableFeed>
              

          </div>

          <CardHeader
            avatar={
              <Avatar className={classes.smallAvatar} src={'/api/users/photo/'+jwt.user._id}/>
            }
            title={ <TextField
              onKeyDown={addMessageClick}
              multiline
              value={chat.text}
              onChange={handleChange}
              placeholder="Write a message ..."
              className={classes.messageField}
              margin="normal"
              InputProps={{endAdornment:<InputAdornment position="end">
                {chat.text && <Button onClick={addMessage}>Send</Button>}
            </InputAdornment>}} />}
            className={classes.cardHeader}/>

        </DialogContent>

        </span>)
}