import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import profileImage from './../../client/assets/images/profile-pic.png'
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+profileImage)
}

const create = async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully registered"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id).populate('posts', '_id').populate('reviews.poster','_id name').exec()
    if (!user){
      console.log('user not found')
      return res.status('400').json({
        error: "User not found"
      })
      
    }
      
    req.profile = user
    return next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}



const update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    let user = req.profile
    user = extend(user, fields)
    user.updated = Date.now()
    if(files.photo){
      user.photo.data = fs.readFileSync(files.photo.path)
      user.photo.contentType = files.photo.type
    }
    try {
      await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      res.json(user)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
const photo = (req, res, next) => {
  if(req.profile.photo.data){
    res.set("Content-Type", req.profile.photo.contentType)
    return res.send(req.profile.photo.data)
  }
  next()
}

const addFollowing = async (req, res, next) => {
  try{
    let following = await User.findByIdAndUpdate(req.body.userId, 
                   {$push: {posts: req.body.followId}}) 

    res.json(following)
    
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeFollowing = async (req, res, next) => {
  try{
    let unfollowing = await User.findByIdAndUpdate(req.body.userId, 
                   {$pull: {posts: req.body.unfollowId}}) 
    res.json(unfollowing)
  }catch(err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const addReviewer = async(req, res, next) => {
  console.log(req.body.musicianId, req.body.userId)
  try {
    await User.findByIdAndUpdate(req.body.musicianId, {$addToSet: {pastCustomers: req.body.userId}})
    next()
  } catch(err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const addReview = async(req, res) => {
  try{
    let result = await User.findByIdAndUpdate(req.body.userId, {$push: {reviews: req.body.reviewInfo}, $pull:{pastCustomers: req.body.reviewInfo.poster}}, {new:true})
                       .populate('reviews.poster','_id name')
                       .sort({'reviews.created':'-1'})
                       .exec()
    res.json(result.reviews)
  } catch(err) {
    console.log(err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  userByID,
  read,
  list,
  photo,
  defaultPhoto,
  
  remove,
  update,
  addFollowing,
  removeFollowing,
  addReviewer,
  addReview
}
