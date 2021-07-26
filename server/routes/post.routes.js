import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router()

router.route('/api/posts/follow/:postId')
  .put(authCtrl.requireLogin, postCtrl.follow) //handle musician following posting

router.route('/api/posts/unfollow/:postId')
  .put(authCtrl.requireLogin, postCtrl.unfollow) //handle musician unfollowing posting

router.route('/api/posts/new/:userId') 
  .post(authCtrl.requireLogin, postCtrl.create) //create a new posting

router.route('/api/posts/user/:userId')
  .get(authCtrl.requireLogin, postCtrl.listByUser) //show user's postings for their homepage

router.route('/api/posts/musician/:userId')
  .get(authCtrl.requireLogin, postCtrl.listMusicianFeed) //show posts a musician is following

router.route('/api/posts/approve-app/:postId')
  .put(authCtrl.requireLogin, postCtrl.isPoster, userCtrl.addReviewer, postCtrl.approve) //allow user to review musician and accept them into ensemble

router.route('/api/posts/decline-app/:postId')
  .put(authCtrl.requireLogin, postCtrl.isPoster, postCtrl.decline) //decline an application for an ensemble

router.route('/api/posts/for/:userId') 
  .get(authCtrl.requireLogin, postCtrl.listByMusicianArea) //list all posts sorted by nearest to musician's city

router.route('/api/posts/comment/:postId')
  .put(authCtrl.requireLogin, postCtrl.comment) //add comment to posting

router.route('/api/posts/uncomment/:postId')
  .put(authCtrl.requireLogin, postCtrl.uncomment) //remove comment from posting

router.route('/api/posts/apply/:postId')
  .put(authCtrl.requireLogin, postCtrl.apply) //add application to posting

router.route('/api/posts/remove-musician/:postId')
  .put(authCtrl.requireLogin, postCtrl.isPoster,postCtrl.removeMusician) //remove a musician from an ensemble

router.route('/api/posts/chat/:postId')
  .get(authCtrl.requireLogin, postCtrl.loadChat) //load ensemble chat

router.route('/api/posts/:postId')
  .delete(authCtrl.requireLogin, postCtrl.isPoster, postCtrl.remove) //delete a user's posting



router.param('userId', userCtrl.userByID) //check if user exists and populate request with found profile
router.param('postId', postCtrl.postByID) //check if post exists and populate request with found post

// console.log(router.stack)

export default router
