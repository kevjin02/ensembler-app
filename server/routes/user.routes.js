import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/users/follow')
  .put(authCtrl.requireLogin, 
       userCtrl.addFollowing)

router.route('/api/users/unfollow')
  .put(authCtrl.requireLogin, 
       userCtrl.removeFollowing)

router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)

router.route('/api/users/photo/:userId')
  .get(userCtrl.photo, userCtrl.defaultPhoto)
  
router.route('/api/users/defaultphoto')
  .get(userCtrl.defaultPhoto)


router.route('/api/users/:userId')
  .get(authCtrl.requireLogin, userCtrl.read)
  .put(authCtrl.requireLogin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireLogin, authCtrl.hasAuthorization, userCtrl.remove)

  

router.param('userId', userCtrl.userByID)


export default router
