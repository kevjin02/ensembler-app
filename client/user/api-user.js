/**
 * Makes POST request to create new user (create in user.controller)
 * @param  {Object} user - object containing user info
 * 
 * @returns {Object} - Object containing status response
 * 
 */
const create = async (user) => {
  try {
      let response = await fetch('/api/users/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes GET request to get user information (read in user.controller)
 * @param  {Object} params - userId : requested user's Id
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} signal - signal to communicate or abort a request
 * 
 * @returns {Object} - Object containing status response and requested profile
 * 
 */
const read = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
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
 * Makes PUT request to update user information (read in user.controller)
 * @param  {Object} params - userId : requested user's Id
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} user - object containing updated user
 * 
 * @returns {Object} - Object containing status response and requested profile
 * 
 */
const update = async (params, credentials, user) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: user
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


/**
 * Makes DELETE request to delete a user (remove in user.controller)
 * @param  {Object} params - userId : requested user's Id
 * @param  {Object} credentials - jwt session information for user
 * 
 * @returns {Object} - Object containing status response and deleted user
 * 
 */
const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
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
 * Makes PUT request to add review to user (addReview in user.controller)
 * @param  {Object} params - userId : requested user's Id
 * @param  {Object} credentials - jwt session information for user
 * @param  {Object} body - object containing review information
 * 
 * @returns {Object} - Object containing updated reviews
 * 
 */
const addReview = async (params, credentials, body) => {
  try {
    let response = await fetch('/api/users/add-review/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({userId: params.userId, reviewInfo: body})
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

export {
  create,
  read,
  update,
  remove,
  addReview
}