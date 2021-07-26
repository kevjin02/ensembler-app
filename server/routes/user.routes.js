import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/users')
  .post(userCtrl.create) //handle creating new user

router.route('/api/users/photo/:userId')
  .get(userCtrl.photo, userCtrl.defaultPhoto) //access a user's profile photo or default if they don't have one
  
router.route('/api/users/defaultphoto')
  .get(userCtrl.defaultPhoto) //get default photo for user profile

router.route('/api/users/add-review')
  .put(authCtrl.requireLogin, userCtrl.addReview) // add a review to a user's profile


router.route('/api/users/:userId')
  .get(authCtrl.requireLogin, userCtrl.read) //get user information to be viewed in profile
  .put(authCtrl.requireLogin, authCtrl.hasAuthorization, userCtrl.update) //update a user's profile
  .delete(authCtrl.requireLogin, authCtrl.hasAuthorization, userCtrl.remove) //delete a user

  

router.param('userId', userCtrl.userByID) //check if user exists and populate request with found profile


export default router
