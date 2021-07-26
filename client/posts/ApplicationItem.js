import React from 'react'
import {Link} from 'react-router-dom'

import {makeStyles} from '@material-ui/core/styles'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles(theme => ({
    
    cardRoot: {
        boxShadow: 'none',
        width: '550px'
    },
    closeButton: {
        float: 'right'
    },
    buttons: {
        marginTop: '5px'
    },
  }))


/**
 * Application Item (parent: ViewApplications)
 * @param {Object} props -  declineApp : parent function to decline application
 *                          approveApp : parent function to approve application
 *                          index      : index of application
 *                          appItem    : object containing application information
 * 
 * @returns {Object} - Application item
 */
export default function ApplicationItem(props) {
    const classes = useStyles()

    //Approve application
    const approveHelper =() =>  {
        props.approve(props.index, props.app.musician._id)
    }

    //Decline application
    const declineHelper =() =>  {
        props.decline(props.index)
    }

    return (
        <Card className={classes.cardRoot}>
                        <CardHeader
              avatar={
                <Avatar  src={'/api/users/photo/'+props.app.musician._id}/>
              }
              title={<Link to={"/user/" + props.app.musician._id}>{props.app.musician.name}</Link>}
              subheader={props.app.instrument}
              action={
                  <div className={classes.buttons}><Button color="primary" onClick={approveHelper}>Approve</Button><Button color="primary" onClick={declineHelper}>Decline</Button></div>
              }
              className={classes.appHeader}

        />
            <CardContent>
                <Typography variant="body2">
                    {props.app.description}
                </Typography>
            </CardContent>
        </Card>)

}