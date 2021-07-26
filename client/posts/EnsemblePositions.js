import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import SignUpButton from './SignUpButton'
import DelMusicianButton from './DelMusicianButton'
import ViewApplications from './ViewApplications'

import {makeStyles} from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

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
    },
    root: {
      paddingTop: theme.spacing(2),
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
    },
    smallAvatar: {
      width: 40,
      height: 40,
      margin: 'auto'
    },
    gridList: {
      width: 650,
      height: 120,
    },
    tileText: {
      textAlign: 'center',
      margin: '10px auto 0'
    },
    gridListTile: {
      margin: '.7% auto',
      textAlign: 'center',
    },
    gridListTileLong: {
        margin: '.7% auto',
        textAlign: 'center',
      },
    applyButton: {
      width: '100%',
      height: '100%',
      borderRadius: '10px',
      borderWidth: '2px',
      borderColor: 'rgba(0,0,0,0.25)',
      backgroundColor: 'inherit',
      borderStyle: 'dashed',
    },
    error: {
      verticalAlign: 'middle'
    },
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

  /**
 * EnsemblePositions (parent: Post)
 * @param {Object} props -  post    : post object
 *                          userJwt : login credentials of user
 * 
 * @returns {Object} - Tiles containing ensemble information
 */
export default function EnsemblePositions(props) {

  const classes = useStyles()
  const [ensemble, setEnsemble] = useState(props.post.ensemble)
  
  //set ensemble when an applicant is approved
  const updateEnsemble = (newEnsemble) => setEnsemble(newEnsemble)
  
  return (
    <div className={classes.root}>

      <GridList cellHeight={160} className = {classes.gridList} cols={4}>

        {ensemble.map((member, i) => {
          return (
            <GridListTile className={classes.gridListTile} style={{'height':100, 'width': '18%'}} key={i}>{member.musician ?
              
              <span>{props.userJwt.user._id === props.post.postedBy._id && <DelMusicianButton userJwt={props.userJwt} postId={props.post._id} member={member} setEnsemble={setEnsemble}/>}
              
              <Link to={"/user/" + member.musician._id}>
                <Avatar src={'/api/users/photo/'+member.musician._id} className={classes.smallAvatar}/>
                <Typography className={classes.tileText}>{member.musician.name}</Typography>
                </Link>

              <Typography className={classes.instrumentText}>{member.instrument}</Typography>
          
              </span> :
              (props.userJwt.user.musician ? <SignUpButton post={props.post} instrument={member.instrument} userJwt={props.userJwt}/>: <button className={classes.applyButton} disabled={true}><Typography component="p" className={classes.tileText}>
              {member.instrument}
              </Typography></button>)}

            </GridListTile>)
      
        })}

      </GridList>
      <br/>

      {(props.post.postedBy._id === props.userJwt.user._id) && <ViewApplications updateEnsemble={updateEnsemble} id={props.post._id} apps={props.post.applications} />}

    </div>);
}