import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router()

router.route('/api/posts/follow')
  .put(authCtrl.requireLogin, postCtrl.follow)
router.route('/api/posts/unfollow')
  .put(authCtrl.requireLogin, postCtrl.unfollow)
router.route('/api/posts/new/:userId') 
  .post(authCtrl.requireLogin, postCtrl.create)

router.route('/api/posts/by/user/:userId')
  .get(authCtrl.requireLogin, postCtrl.listByUser)
router.route('/api/posts/by/musician/:userId')
  .get(authCtrl.requireLogin, postCtrl.listMusicianFeed)

router.route('/api/posts/approve-app')
  .put(authCtrl.requireLogin, userCtrl.addReviewer, postCtrl.approve)
router.route('/api/posts/decline-app')
  .put(authCtrl.requireLogin, postCtrl.decline)

  router.route('/api/posts/for/:userId') // postCtrl.listByUserArea
  .get(authCtrl.requireLogin, postCtrl.listByUserArea)

router.route('/api/posts/feed/:userId')
  .get(authCtrl.requireLogin, postCtrl.postByID)

router.route('/api/posts/comment')
  .put(authCtrl.requireLogin, postCtrl.comment)
router.route('/api/posts/uncomment')
  .put(authCtrl.requireLogin, postCtrl.uncomment)

router.route('/api/posts/apply')
  .get(authCtrl.requireLogin, postCtrl.showApplications)
  .put(authCtrl.requireLogin, postCtrl.apply)

router.route('/api/posts/remove-musician')
  .put(authCtrl.requireLogin, postCtrl.removeMusician)
  

router.route('/api/posts/')

router.route('/api/posts/:postId')
  .delete(authCtrl.requireLogin, postCtrl.isPoster, postCtrl.remove)



router.param('userId', userCtrl.userByID)
router.param('postId', postCtrl.postByID)

// console.log(router.stack)

export default router
