import Post from '../models/post.model'
import errorHandler from '../helpers/dbErrorHandler'

/**
 * Helper function: Checks if user who is making request was also the poster
 * @param  {Object} req - post : post that is being checked
 *                        auth : ensure user is signed in
 * @param  {Object} res - object to be populated with status and returned
 * @param  {function} next - call next function in route
 */
 const isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
  if(!isPoster){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}


/**
 * Helper function: Checks if post exists and populates request with necessary info
 * @param  {Object} req - post : post to be populated with post from database
 * @param  {Object} res - object to be populated with status and returned
 * @param  {function} next - call next function in route
 * @param  {string} id - id of post
 */
 const postByID = async (req, res, next, id) => {
  try{

    //Find post given ID
    let post = await Post.findById(id).populate('postedBy', '_id name').exec()

    //Handle bad id
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


/**
 * Create new post (create in api-post)
 * @param  {Object} req - body : Prepared post object to be added
 *                        profile : User that created the post
 * @param  {Object} res - object to be populated with status and returned
 */
const create = async (req, res) => {
  let post = new Post(req.body)
  post['postedBy'] = req.profile

  try {
    //check if start and endtime are valid
    if(req.body.eventTime.start < new Date() || req.body.eventTime.start >= req.body.eventTime.end){
      return res.status('400').json({
        error: "Invalid start/end datetime"
      })
    }

    //save to db
    let result = await post.save()

    res.json(result)

  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Finds and arranges posts for a user (listUserFeed in api-post)
 * @param  {Object} req - profile : User who is requesting data
 * @param  {Object} res - object to be populated with status and a user's posts and returned
 */
 const listByUser = async (req, res) => {
  try{

    //Find posts that client had posted
    let posts = await Post.find({postedBy: req.profile._id})
                          .populate('comments.postedBy', '_id name musician instrument')
                          .populate('postedBy', '_id name')
                          .populate('ensembleChat.postedBy', '_id name musician instrument')
                          .populate('followers', '_id')
                          .populate('applications.musician','_id name instrument')
                          .populate('ensemble.musician','_id name instrument')
                          .sort('-created')
                          .exec()

    res.json(posts)

  }catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Finds and arranges posts a musician is following (listMusicianFeed in api-post)
 * @param  {Object} req - profile : Musician who is requesting data
 * @param  {Object} res - object to be populated with status and a user's posts and returned
 */
const listMusicianFeed = async (req, res)=> {
  try {

    //Find posts that musician is following
    let posts = await Post.find({'followers': {$in : req.profile._id}})
                            .populate('ensemble.musician','_id name instrument')
                          .populate('comments.postedBy', '_id name musician instrument')
                          .populate('ensembleChat.postedBy', '_id name musician instrument')
                          .populate('postedBy', '_id name')
                          .sort('-eventTime.start')
                          .exec()

  
    res.json(posts)
  } catch(err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Finds and arranges posts a musician is not following by nearest (listByMusicianArea in api-post)
 * @param  {Object} req - profile : Musician who is requesting data
 * @param  {Object} res - object to be populated with status and a user's posts and returned
 */
const listByMusicianArea = async(req, res) => {
  /**
   * Uses Haversine formula to determine the distance between two coordinates
   * @param  {number} lat1 - latitude of posting
   * @param  {number} lon1 - longitude of posting
   * @param  {number} lat2 - latitude of musician
   * @param  {number} lon2 - longitude of musician
   * 
   * @returns {number} - Distance in kilometers
   */
  function LatLontoKm(lat1,lon1,lat2,lon2) { 
  var R = 6371; // Radius of the earth in km
  var dLat = degtorad(lat2-lat1);  
  var dLon = degtorad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(degtorad(lat1)) * Math.cos(degtorad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; 
  return d;
}

  /**
   * Helper function converting degrees to radians
   * @param  {number} deg - degrees to be converted
   * 
   * @returns {number} - Converted radians
   */
  function degtorad(deg) {
    return deg * (Math.PI/180)
  }

  try { 
    
    //Find posts that aren't followed and haven't started
    let posts = await Post.find({$and: [{'eventTime.start': {$gte: new Date}}, {'followers': {$ne: req.profile._id}}]})
              .populate('comments.postedBy', '_id name musician instrument')
              .populate('postedBy', '_id name')
              .populate('ensemble.musician','_id name instrument')
              .sort('-created')
              .exec()
    
    
    //populate each post with calculated distance to user
    for (let i = 0; i < posts.length; i++) {
      posts[i]['distance']=LatLontoKm(posts[i].lat, posts[i].long, req.profile.lat, req.profile.long)
    }

    //sort posts
    posts.sort(function(a,b) {
      return a.distance - b.distance;
    })
      
    res.json(posts)

  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Deletes a posting (remove in api-post)
 * @param  {Object} req - post : post object to be deleted
 * @param  {Object} res - object to be populated with status
 */
const remove = async (req, res) => {
  let post = req.post
  try{
    let deletedPost = await post.remove()
    res.json(deletedPost)
  }catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Adds comment to a post (comment in api-post)
 * @param  {Object} req - body.comment : comment object to be added
 *                        post._id     : id of user who wants to add post
 *                        auth._id     : id of post comment is to be added to
 * 
 * @param  {Object} res - object to be populated with status and the updated post
 */
const comment = async (req, res) => {
  let comment = req.body.comment
  comment.postedBy = req.auth._id
  try{
    //add comment to post and provide updated post
    let result = await Post.findByIdAndUpdate(req.post._id, {$push: {comments: comment}}, {new: true})
                            .populate('comments.postedBy', '_id name musician instrument')
                            .populate('postedBy', '_id name')
                            .exec()

    res.json(result.comments)
  }catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Deletes a comment of a post (uncomment in api-post)
 * @param  {Object} req - body.comment : comment object to be deleted
 *                        post._id     : id of post comment is to be deleted from
 * 
 * @param  {Object} res - object to be populated with status and the updated post
 */
const uncomment = async (req, res) => {
  let comment = req.body.comment
  try{
    //remove specific comment from post and provide updated post
    let result = await Post.findByIdAndUpdate(req.post._id, {$pull: {comments: {_id: comment._id}}}, {new: true})
                          .populate('comments.postedBy', '_id name musician instrument')
                          .populate('postedBy', '_id name')
                          .exec()

    res.json(result.comments)
  }catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Adds follower to a post (follow in api-post)
 * @param  {Object} req - auth._id : id of user who wants to follow post
 *                        post._id : id of post with new follower
 * 
 * @param  {Object} res - object to be populated with status
 */
const follow = async (req, res) => {

  try{
    //add follower to array of followers in a post
    let result = await Post.findByIdAndUpdate(req.post._id, {$push: {followers: req.auth._id}})

    res.json(result)

  }catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Removes follower to a post (unfollow in api-post)
 * @param  {Object} req - auth._id : id of user who wants to unfollow post
 *                        post._id : id of post unfollower
 * 
 * @param  {Object} res - object to be populated with status
 */
const unfollow = async (req, res) => {
  try{

     //remove follower to array of followers in a post
    let result = await Post.findByIdAndUpdate(req.post._id, {$pull: {followers: req.auth._id}})
    res.json(result)
  }catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Adds applicant to post (apply in api-post)
 * @param  {Object} req - auth._id         : id of user who wants to unfollow post
 *                        post._id         : id of post being applied for
 *                        body.instrument  : instrument being applied for
 *                        body.description : description to be considered
 * 
 * @param  {Object} res - object to be populated with status
 */
const apply = async (req, res) => {
  
  try{

    if(!req.body.description){
      return res.status('400').json({
        error: "Please enter a description"
      })
    }

    let subDoc = await Post.findById(req.post._id)
                          .populate('applications.musician','_id name instrument')
                          .populate('ensemble.musician','_id name instrument')
                          .exec()

    let posError = ""
    subDoc.ensemble.some(element => {

    if(element.musician && (element.musician._id == req.auth._id)){
      posError= "You are already in the ensemble"
      return
    }

    else if(element.instrument === req.body.instrument){
      if(element.musician){
        posError = "Musician is already at position " + element.instrument
        return
      }
      
    }

    })

    subDoc.applications.some(element => {
      if(element.musician._id == req.auth._id && req.body.instrument == element.instrument){
        posError = "You can only apply to the same position once"
        return
      }
    })

    if(posError) {
      return res.status('400').json({
      error: posError
    })
    }


    //push new application to post for an instrument
    let result = await Post.findByIdAndUpdate(req.post._id, {$push: {applications: {musician: req.auth._id,instrument: req.body.instrument,description: req.body.description}}})
    
    res.json(result)
  }catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Adds applicant to a posting's ensemble and removes applications for that position (approve in api-post)
 * @param  {Object} req - body.musicianId  : id of musician who is joining ensemble
 *                        body.instrument  : instrument position being accepted
 *                        post._id         : id of post to be updated
 *                        body.description : description to be considered
 *                        
 * 
 * @param  {Object} res - object to be populated with status and updated post
 */
const approve = async (req, res) => {
  try{
    //Find current posting to check for duplicates
    let subDoc = await Post.findById(req.post._id)
                          .populate('applications.musician','_id name instrument')
                          .populate('ensemble.musician','_id name instrument')
                          .exec()

    let posError = ""
    subDoc.ensemble.some(element => {
      
      //Check if musician is already in ensemble
      if(element.musician && (element.musician._id == req.body.musicianId)){
          posError= "Musician is already in the ensemble"
          return
      }
      
      
      else if(element.instrument === req.body.instrument){
        //Check if there is already a musician at the spot
        if(element.musician){
          posError = "Musician is already at position " + element.instrument
        }
        //Update object to contain new musician inside ensemble
        element['musician'] = req.body.musicianId
        return
      }
        
    })

    if(posError) {
      return res.status('400').json({
        error: posError
      })
    }

    //Find post by Id and replace ensemble with updated ensemble created by subdoc and remove all other applications for that instrument
    let result = await Post.findByIdAndUpdate(req.post._id, {$pull: {applications: {instrument: req.body.instrument}}, $set: {ensemble: subDoc.ensemble}}, {new: true})
                            .populate('applications.musician','_id name instrument')
                            .populate('ensemble.musician','_id name instrument')
                            .exec()

    res.json(result)
  }catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Removes applicant from a posting(decline in api-post)
 * @param  {Object} req - body.appId : id of application to be removed
 *                        post_id    : id of post to be updated
 *                        
 * @param  {Object} res - object to be populated with status and updated applications
 */
const decline = async (req, res) => {
  try{
    //Find post by Id, removes application and returns post with updated applications
    let result = await Post.findByIdAndUpdate(req.post._id, {$pull: {applications: {_id: req.body.appId}}}, {new: true})
                            .populate('applications.musician','_id name instrument')
                            .exec()

    res.json(result.applications)
  }catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Removes musician from ensemble (removeMusician in api-post)
 * @param  {Object} req - body.memberId : id of ensemble member object to be removed
 *                        post._id    : id of post to be updated
 *                        
 * @param  {Object} res - object to be populated with status and updated ensemble
 */
const removeMusician = async (req, res) => {
  try{
    //Find post by Id and populates ensemble user information
    let subDoc = await Post.findById(req.post._id)
                            .populate('ensemble.musician','_id name instrument')
                            .exec()

    subDoc.ensemble.some(element => {
      //Remove musician at specified member position
      if(element.musician && (element._id == req.body.memberId)) {
        element['musician'] = undefined
        return true;
      }
    })
    //Find post by Id, set updated ensemble, and populates post with updated ensemble user info
    let result = await Post.findByIdAndUpdate(req.post._id, {$set: {ensemble: subDoc.ensemble}}, {new:true})
                          .populate('ensemble.musician','_id name instrument')
                          .exec()

    res.json(result.ensemble)
  }catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Loads chat for an ensemble (removeMusician in api-post)
 * @param  {Object} req - post._id : id of post whose chat is to be loaded
 *                        
 * @param  {Object} res - object to be populated with status and updated ensemble
 */
const loadChat = async(req, res) => {
  try {
    let checkAuth = await Post.findById(req.post._id)
                            .populate('ensemble.musician', '_id')
                            .populate('postedBy', '_id')
                            .exec()

    let authorized = false

    checkAuth.ensemble.some(member => {
      if(member.musician && member.musician._id == req.auth._id){
        authorized = true
        return true
      }
    })
    if(checkAuth.postedBy._id == req.auth._id) {authorized = true}

    if(!authorized) {
      return res.status('403').json({
        error: 'User not authorized'
      })
    }
     //Find post by Id and loads ensemble chat to be returned
    let result = await Post.findById(req.post._id)
                            .populate('ensembleChat.postedBy', '_id name musician instrument')
                            .exec()

    res.json(result.ensembleChat)
  } catch(err){
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
  
  
export default {
  listByUser,
  listByMusicianArea,
  listMusicianFeed,
  create,
  postByID,
  remove,
  comment,
  uncomment,
  follow,
  unfollow,
  isPoster,
  apply,
  approve,
  decline,
  removeMusician,
  loadChat
}
