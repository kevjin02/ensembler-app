import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'


/**
 * Check login attempt (login in api-auth)
 * @param  {Object} req - body : login attempt form
 * @param  {Object} res - object to be populated with status and a user's information
 * 
 */
const login = async (req, res) => {

  try {
    //Check if email is registered
    let user = await User.findOne({
      "email": req.body.email
    })

    //Return that email isn't registered
    if (!user){
      return res.status('401').json({
        error: "User not found"
      })
    }

    //Check if user email and password match
    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Incorrect password."
      })
    }


    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret)

    //Create new session
    res.cookie("t", token, {
      expire: new Date() + 9999
    })
    
    //Return token and user info
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        musician: user.musician,
        instrument: user.instrument,
        posts: user.posts
      }
    })

  } catch (err) {

    return res.status('401').json({
      error: "Could not log in"
    })

  }
}


/**
 * Clears session and logs user out
 * @param  {Object} req - Unused
 * @param  {Object} res - object to clear cookies and send status
 */
const logout = (req, res) => {
  res.clearCookie("t")

  return res.status('200').json({
    message: "logged out"
  })
}


/**
 * Checks if user has login credentials
 */
const requireLogin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
})


/**
 * Check whether user is authorized to edit profile
 * @param  {Object} req - profile : Musician who is requesting data
 *                        auth : Check whether user has credentials
 * @param  {Object} res - object to be populated with status if unauthorized
 * @param  {function} next - call next function or route
 */
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}


export default {
  login,
  logout,
  requireLogin,
  hasAuthorization
}
