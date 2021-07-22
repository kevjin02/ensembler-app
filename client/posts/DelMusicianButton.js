import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import {removeMusician} from './api-post'

const useStyles = makeStyles(theme => ({
    removeMusician: {
      float: 'right',
      position: 'absolute',
      marginLeft: '33px',
      height: '5px',
      width: '5px'
    },
    deleteIcon: {
     height: '20px',
     width: '20px'
    }
  }))

  export default function DelMusicianButton(props) {
    const classes = useStyles()
    
    const delMusician = () => { 
        console.log(props.member)
      removeMusician({
        userId: props.userJwt.user._id,
        memberId: props.member.musician._id
      }, {
        t: props.userJwt.token
      }, props.postId).then((data) => {
        if(data.error) {
          console.log(data.error)
        } else {
          props.setEnsemble(data)
        }
      })
    }

      return <IconButton className={classes.removeMusician} onClick={delMusician}>
                <DeleteIcon className={classes.deleteIcon} />
              </IconButton>
  }