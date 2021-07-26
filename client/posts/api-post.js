/**
 * Makes POST request to create new post (create in post.controller)
 * @param  {Object} params - userId : current user's ID
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} post - post to be created
 * 
 * @returns {Object} - Object containing status response, error otherwise
 * 
 */
const create = async (params, credentials, post) => {
    try {
      let response = await fetch('/api/posts/new/'+ params.userId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(post)
      }) 
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }


/**
 * Makes GET request to list all created posts by user (listByUser in post.controller)
 * @param  {Object} params - userId : current user's ID
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} signal - signal to communicate or abort a request
 * 
 * @returns {Object} - Object containing status response and posts to be added to feed, error otherwise
 * 
 */
const listUserFeed = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/posts/user/'+ params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })    
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes GET request to list all followed posts by musician (listMusicianFeed in post.controller)
 * @param  {Object} params - userId : current user's ID
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} signal - signal to communicate or abort a request
 * 
 * @returns {Object} - Object containing status response and posts to be added to feed, error otherwise
 * 
 */
const listMusicianFeed = async (params, credentials, signal)  => {
  try {
    let response = await fetch('/api/posts/musician/'+ params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })    
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}



/**
 * Makes GET request to find all postings near a musician (listByMusicianArea in post.controller)
 * @param  {Object} params - userId : current user's ID
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} signal - signal to communicate or abort a request
 * 
 * @returns {Object} - Object containing status response and posts to be added to feed, error otherwise
 * 
 */
const listByMusicianArea = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/posts/for/'+ params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })    
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes DELETE request to delete a posting (listByMusicianArea in post.controller)
 * @param  {Object} params - postId : id of post to be deleted
 * @param  {Object} credentials - jwt session information for user
 * 
 * @returns {Object} - Object containing status response and posts to be added to feed, error otherwise
 * 
 */
const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/posts/' + params.postId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes PUT request to add comment to posting (comment in post.controller)
 * @param  {Object} params - postID : id of post
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} comment - comment object to be added
 * 
 * @returns {Object} - Object containing status response and updated comment section, error otherwise
 * 
 */
const comment = async (params, credentials, comment) => {
  try {
    let response = await fetch('/api/posts/comment/'+params.postId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({comment: comment})
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes PUT request to delete comment at posting (uncomment in post.controller)
 * @param  {Object} params - postId: id of post that is to be deleted
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} comment - comment object to be deleted
 * 
 * @returns {Object} - Object containing status response and updated comment section, error otherwise
 * 
 */
const uncomment = async (params, credentials, comment) => {
  try {
    let response = await fetch('/api/posts/uncomment/'+params.postId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({comment: comment})
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes PUT request to add follower to post (follow in post.controller)
 * @param  {Object} params - postId: id of post to be followed
 * @param  {Object} credentials - jwt session information for user
 * 
 * @returns {Object} - Object containing status response and updated post, error otherwise
 * 
 */
const follow = async (params, credentials) => {
  try {
    let response = await fetch('/api/posts/follow/'+params.postId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes PUT request to remove follower to post (unfollow in post.controller)
 * @param  {Object} params - postId: id of post to be unfollowed
 * @param  {Object} credentials - jwt session information for user
 * 
 * @returns {Object} - Object containing status response and updated post, error otherwise
 * 
 */
const unfollow = async (params, credentials) => {
  try {
    let response = await fetch('/api/posts/unfollow/'+params.postId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes PUT request to add applicant to post (apply in post.controller)
 * @param  {Object} params - postId: id of post to be applied to
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} appInfo - instrument : instrument that is being applied for
 *                            description : description provided by applicant
 * 
 * @returns {Object} - Object containing status response and updated post, error otherwise
 * 
 */
const apply = async (params, credentials, appInfo) => {
  try {
    let response = await fetch('/api/posts/apply/'+params.postId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({instrument: appInfo.instrument, description: appInfo.description})
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes PUT request to add accepted applicant to ensemble (approve in post.controller)
 * @param  {Object} params - postId: id of post where approval takes place
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} appInfo - instrument : instrument that is being applied for
 *                            musicianId : userId of accepted musician
 * 
 * @returns {Object} - Object containing status response and updated post, error otherwise
 * 
 */
const approve = async (params, credentials, appInfo) => {
  try {
    let response = await fetch('/api/posts/approve-app/'+ params.postId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({instrument: appInfo.instrument, musicianId: appInfo.musicianId})
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes PUT request to decline an applicant (decline in post.controller)
 * @param  {Object} params - postId: id of post that a musician is declined from
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} appInfo - appId : Id of specific application
 * 
 * @returns {Object} - Object containing status response and updated applications, error otherwise
 * 
 */
const decline = async (params, credentials, appInfo) => {
  try {
    let response = await fetch('/api/posts/decline-app/'+ params.postId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({appId: appInfo.appId})
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes PUT request to remove a musician (removeMusician in post.controller)
 * @param  {Object} params - postId: id of post that a musician is removed from
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} memberId - id of ensemble member object to be removed
 * 
 * @returns {Object} - Object containing status response and updated ensemble, error otherwise
 * 
 */
const removeMusician = async (params, credentials, memberId) => {
  try {
    let response = await fetch('/api/posts/remove-musician/'+ params.postId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({memberId: memberId})
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes GET request to load a post's chat (loadChat in post.controller)
 * @param  {Object} params - postId: id of post that a musician is removed from
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} memberId - id of ensemble member object to be removed
 * 
 * @returns {Object} - Object containing status response and updated ensemble, error otherwise
 * 
 */
const loadChat = async(params, credentials, signal) => {
  try {
    let response = await fetch('/api/posts/chat/'+ params.postId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })    
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}



export {
  listUserFeed,
  listMusicianFeed,
  listByMusicianArea,
  create,
  remove,
  follow,
  unfollow,
  comment,
  uncomment,
  apply,
  approve,
  decline,
  removeMusician,
  loadChat
}
