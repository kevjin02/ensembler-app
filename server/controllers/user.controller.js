import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import profileImage from './../../client/assets/images/profile-pic.png'


/**
 * Access profile photo of user if exists
 * @param  {Object} req - profile : user profile
 * @param  {Object} res - object to be populated with profile photo of user
 * @param  {function} next - call next function in route
 */
const photo = (req, res, next) => {
  if(req.profile.photo.data){
    res.set("Content-Type", req.profile.photo.contentType)
    return res.send(req.profile.photo.data)
  }
  next()
}


/**
 * Access default photo
 * @param  {Object} req - unused
 * @param  {Object} res - object to be populated with default profile image
 */
 const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+profileImage)
}


/**
 * Create new user (create in api-user)
 * @param  {Object} req - body : user object to be created
 * @param  {Object} res - object to be populated with status and returned
 */
const create = async (req, res) => {
  const user = new User(req.body)

  try {
    //save new user that has been created
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
 * Helper function : check if user exists and populate profile in req
 * @param  {Object} req - body : user object to be created
 * @param  {Object} res - object to be populated with status and returned
 * @param  {function} next - call next function in route
 * @param  {string} id - id of user
 */
const userByID = async (req, res, next, id) => {
  try {
    //find user by id and add reviews to be returned
    let user = await User.findById(id).populate('posts', '_id').populate('reviews.poster','_id name').exec()
    
    //handle if user doesn't exist
    if (!user){
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


/**
 * Get profile without password (read in api-user)
 * @param  {Object} req - profile : user profile that is requested
 * @param  {Object} res - object to be populated with status and profile and returned
 */
const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}


/**
 * Update a profile (update in api-user)
 * @param  {Object} req - profile : user profile that is to be updated
 * @param  {Object} res - object to be populated with status and profile and returned
 */
const update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true

  //update profile and process image if inputted
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


/**
 * Delete a profile (remove in api-user)
 * @param  {Object} req - profile : user profile that is to be deleted
 * @param  {Object} res - object to be populated with status and deleted profile and returned
 */
const remove = async (req, res) => {
  try {
    let user = req.profile

    //delete user
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


/**
 * Add reviewer to a user (approve in api-post)
 * @param  {Object} req - body : 
 *                        auth : 
 * @param  {Object} res - object to be populated with status
 * @param  {function} next - call next function in route
 */
const addReviewer = async(req, res, next) => {
  try {
    //find musician and add customer who can review them
    await User.findByIdAndUpdate(req.body.musicianId, {$addToSet: {pastCustomers: req.auth._id}})
    
    next()
  } catch(err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Add review about a musician (addReview in api-user)
 * @param  {Object} req - body : userId of user being reviewed and object with review details
 * @param  {Object} res - object to be populated with updated reviews
 */
const addReview = async(req, res) => {
  try{
    //Check if rating/description empty
    if(!(req.body.reviewInfo.rating && req.body.reviewInfo.description)){
        return res.status('400').json({
          error: "Please providing a rating and description"
      })
    }
    
    //add review to user and prevent them from creating second review, then populate result with updated reviews
    let result = await User.findByIdAndUpdate(req.body.userId, {$push: {reviews: req.body.reviewInfo}, $pull:{pastCustomers: req.body.reviewInfo.poster}}, {new:true})
                       .populate('reviews.poster','_id name')
                       .sort({'reviews.created':'-1'})
                       .exec()

    res.json(result.reviews)

  } catch(err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  userByID,
  read,
  photo,
  defaultPhoto,
  remove,
  update,
  addReviewer,
  addReview
}
