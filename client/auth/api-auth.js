/**
 * Makes POST request to API to create new user.
 * @param  {Object} props - Object containing user information to be sent to API.
 * 
 * @returns {Object} - Status of whether request was successful
 * 
 */
const login = async (user) => {
  try {
    let response = await fetch('/auth/login/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(user)
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

/**
 * Makes GET request to API to log out current user.
 * 
 * @returns {Object} -  Status of whether request was successful
 * 
 */
const logout = async () => {
  try {
    let response = await fetch('/auth/logout/', { method: 'GET' })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


export {
  login,
  logout
}