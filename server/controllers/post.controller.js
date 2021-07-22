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
                            .populate('applications.musician','_id name instrument')
                            .populate('ensemble.musician','_id name instrument')
                            .sort('-created')
                            .exec()
      res.json(posts)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }

  const listMusicianFeed = async (req, res)=> {
    try {
      let posts = await Post.find({'followers': {$in : req.profile._id}})
                             .populate('ensemble.musician','_id name instrument')
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .sort('-created')
      res.json(posts)
    } catch(err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  
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


  const follow = async (req, res) => {
    console.log('ipoid')
    let follower = req.body.userId
    try{
      let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {followers: follower}})
      res.json(result)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }

  const unfollow = async (req, res) => {
    console.log('ihhuid')
    let follower = req.body.userId
    console.log(follower)
    try{
      let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {followers: follower}})
      res.json(result)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  
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
    try { 
      let posts = await Post.find({$and: [{'eventTime.start': {$gte: new Date}}, {'followers': {$ne: req.profile._id}}]})
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name')
                .populate('ensemble.musician','_id name instrument')
                .sort('-created')
                .exec()
      let secondrec = await Post.find({'followers': {$ne: req.profile._id}})
      res.json(posts)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }

  const apply = async (req, res) => {
    console.log(req.body.description)
    
    try{
      let curApps = await Post.findById(req.body.postId)
      console.log(curApps)
      
      let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {applications: {musician: req.body.userId,instrument: req.body.instrument,description: req.body.description}}})
      res.json(result)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }

  const showApplications = async (req, res)=> {
    try {
      let posts = await Post.findById(id).populate('applications.musician','_id name instrument')
                            .sort('-created')
                            .exec()
      res.json(posts)
    } catch(err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }

  const approve = async (req, res) => {
    try{
      let subDoc = await Post.findById(req.body.postId)
      subDoc.ensemble.forEach(element => {
        if(element.instrument === req.body.instrument){
          element['musician'] = req.body.musicianId
        }
          
      })

      let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {applications: {instrument: req.body.instrument}}, $set: {ensemble: subDoc.ensemble}}, {new: true})
                             .populate('applications.musician','_id name instrument')
                             .populate('ensemble.musician','_id name instrument')
                             .exec()
      res.json(result)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }

  const decline = async (req, res) => {
    try{
      let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {applications: {_id: req.body.appId}}}, {new: true})
                             .populate('applications.musician','_id name instrument')
                             .exec()
      res.json(result.applications)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }

  const removeMusician = async (req, res) => {
    console.log(req.body.postId, req.body.memberId, )
    try{
      let subDoc = await Post.findById(req.body.postId)
                              .populate('ensemble.musician','_id name instrument')
                              .exec()
     subDoc.ensemble.some(element => {
        if(element.musician && (element.musician._id == req.body.memberId)) {
          element['musician'] = undefined
          return true;
        }
      })
      let result = await Post.findByIdAndUpdate(req.body.postId, {$set: {ensemble: subDoc.ensemble}}, {new:true})
                            .populate('ensemble.musician','_id name instrument')
      res.json(result.ensemble)
    }catch(err){
      console.log(err)
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }

  
  export default {
    listByUser,
    listByUserArea,
    listMusicianFeed,
    create,
    postByID,
    remove,
    like,
    unlike,
    comment,
    uncomment,
    follow,
    unfollow,
    isPoster,
    showApplications,
    apply,
    approve,
    decline,
    removeMusician
  }
  