import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Register from './user/Register'
import Login from './auth/Login'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import NewPost from './posts/NewPost' 
import Postings from './posts/Postings'
import Menu from './core/Menu'
import Footer from './core/Footer'

const MainRouter = () => {
    return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <PrivateRoute path="/user/:userId" component={Profile}/>
        <PrivateRoute path="/create-post" component={NewPost}/>
        <PrivateRoute path="/posts" component={Postings}/>
      </Switch>
      <Footer/>
    </div>)
}

export default MainRouter
