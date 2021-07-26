import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router()

router.route('/api/posts/follow/:postId')
  .put(authCtrl.requireLogin, postCtrl.follow)

router.route('/api/posts/unfollow/:postId')
  .put(authCtrl.requireLogin, postCtrl.unfollow)

router.route('/api/posts/new/:userId') 
  .post(authCtrl.requireLogin, postCtrl.create)

router.route('/api/posts/user/:userId')
  .get(authCtrl.requireLogin, postCtrl.listByUser)

router.route('/api/posts/musician/:userId')
  .get(authCtrl.requireLogin, postCtrl.listMusicianFeed) 

router.route('/api/posts/approve-app/:postId')
  .put(authCtrl.requireLogin, postCtrl.isPoster, userCtrl.addReviewer, postCtrl.approve)

router.route('/api/posts/decline-app/:postId')
  .put(authCtrl.requireLogin, postCtrl.isPoster, postCtrl.decline)

router.route('/api/posts/for/:userId') 
  .get(authCtrl.requireLogin, postCtrl.listByMusicianArea)

router.route('/api/posts/comment/:postId')
  .put(authCtrl.requireLogin, postCtrl.comment)

router.route('/api/posts/uncomment/:postId')
  .put(authCtrl.requireLogin, postCtrl.uncomment)

router.route('/api/posts/apply/:postId')
  .put(authCtrl.requireLogin, postCtrl.apply)

router.route('/api/posts/remove-musician/:postId')
  .put(authCtrl.requireLogin, postCtrl.isPoster,postCtrl.removeMusician)

router.route('/api/posts/chat/:postId')
  .get(authCtrl.requireLogin, postCtrl.loadChat)

router.route('/api/posts/:postId')
  .delete(authCtrl.requireLogin, postCtrl.isPoster, postCtrl.remove)



router.param('userId', userCtrl.userByID)
router.param('postId', postCtrl.postByID)

// console.log(router.stack)

export default router
