import Post from '../models/post.model'
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
const create = async (req, res, next) => {
    let post = new Post(req.body)
    post['postedBy'] = req.profile

  try {
    let result = await post.save()
    res.json(result)

  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
  }

 
  
  const postByID = async (req, res, next, id) => {
    try{
      let post = await Post.findById(id).populate('postedBy', '_id name').exec()
      if (!post)
        return res.status('400').json({
          error: "Post not found"
        })
      req.post = post
      next()
    }catch(err){
      return res.status('400').json({
        error: "Could not retrieve use post"
      })
    }
  }
  
  const listByUser = async (req, res) => {
    
    try{
      let posts = await Post.find({postedBy: req.profile._id})
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .populate('followers', '_id')
                            .sort('-created')
                            .exec()
      res.json(posts)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  
  // const listNewsFeed = async (req, res) => {
  //   let following = req.profile.following
  //   following.push(req.profile._id)
  //   try{
  //     let posts = await Post.find({postedBy: { $in : req.profile.following } })
  //                           .populate('comments.postedBy', '_id name')
  //                           .populate('postedBy', '_id name')
  //                           .sort('-created')
  //                           .exec()
  //     res.json(posts)
  //   }catch(err){
  //     return res.status(400).json({
  //       error: errorHandler.getErrorMessage(err)
  //     })
  //   }
  // }
  
  const remove = async (req, res) => {
    let post = req.post
    try{
      let deletedPost = await post.remove()
      res.json(deletedPost)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  
  
  const like = async (req, res) => {
    try{
      let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
      res.json(result)
    }catch(err){
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
    }
  }
  
  const unlike = async (req, res) => {
    try{
      let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
      res.json(result)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  
  const comment = async (req, res) => {
    let comment = req.body.comment
    comment.postedBy = req.body.userId
    try{
      let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
                              .populate('comments.postedBy', '_id name')
                              .populate('postedBy', '_id name')
                              .exec()
      res.json(result)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  const uncomment = async (req, res) => {
    let comment = req.body.comment
    try{
      let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}}, {new: true})
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .exec()
      res.json(result)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }


  // const follow = async (req, res) => {
  //   // console.log('ipoid')
  //   // follower = req.body.userId
  //   // try{
  //   //   let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {following: follower}})
  //   //   res.json(result)
  //   // }catch(err){
  //   //   return res.status(400).json({
  //   //     error: errorHandler.getErrorMessage(err)
  //   //   })
  //   // }
  // }

  // const unfollow = async (req, res) => {
  //   // console.log('ihhuid')
  //   // follower = req.body.userId
  //   // try{
  //   //   let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {following: follower}})
  //   //   res.json(result)
  //   // }catch(err){
  //   //   return res.status(400).json({
  //   //     error: errorHandler.getErrorMessage(err)
  //   //   })
  //   // }
  // }
  
  const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if(!isPoster){
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
  }

  const listByUserArea = async(req, res, next) => {
    try { //, 'followers': {$ne: id}
      let posts = await Post.find({$and: [{'eventTime.start': {$gte: new Date}}, {'followers._id': {$ne: req.profile._id}}]})
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name')
                .sort('-created')
                .exec()
      res.json(posts)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  
  export default {
    listByUser,
    listByUserArea,
    // listNewsFeed,
    create,
    postByID,
    remove,
    like,
    unlike,
    comment,
    uncomment,
    // follow,
    // unfollow,
    isPoster
  }
  