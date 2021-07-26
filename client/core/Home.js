import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import MusicianView from './../homeviews/MusicianView'
import UserView from './../homeviews/UserView'
import CssBaseline from '@material-ui/core/CssBaseline';
import HomeView from './../homeviews/HomeView'



/**
 * Homepage
 */
export default function Home({history}){
  
  const [defaultPage, setDefaultPage] = useState(null)

  //Check if user is authenticated
  useEffect(()=> {
    setDefaultPage(auth.isAuthenticated())
    const unlisten = history.listen (() => {
      setDefaultPage(auth.isAuthenticated())
    })
    
    return () => {
      
      unlisten()
    }
  }, [])
    return (
      <div>
      <CssBaseline />
      {defaultPage ?  <span>{
        auth.isAuthenticated().user.musician ?
        <MusicianView />: <UserView/>
      }</span>
      : (<HomeView/>)
      
        
      }
    </div>
    )
}

