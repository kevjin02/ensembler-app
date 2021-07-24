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
  
  const listByUser = async (params, credentials) => {
    try {
      let response = await fetch('/api/posts/by/'+ params.userId, {
        method: 'GET',
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
  
  const listUserFeed = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/posts/by/user/'+ params.userId, {
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

  const listMusicianFeed = async (params, credentials, signal)  => {
    try {
      let response = await fetch('/api/posts/by/musician/'+ params.userId, {
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

  const getAllNearby = async (params, credentials, signal) => {
    console.log(signal, 'cool')
    try {
      let response = await fetch('/api/posts/for/'+ params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
        // body: JSON.stringify({userId:params.userId})
      })    
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
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
  
  
  const like = async (params, credentials, postId) => {
    try {
      let response = await fetch('/api/posts/like/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  
  const unlike = async (params, credentials, postId) => {
    try {
      let response = await fetch('/api/posts/unlike/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  
  const comment = async (params, credentials, postId, comment) => {
    try {
      let response = await fetch('/api/posts/comment/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId, comment: comment})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  
  const uncomment = async (params, credentials, postId, comment) => {
    try {
      let response = await fetch('/api/posts/uncomment/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId, comment: comment})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const follow = async (params, credentials, postId) => {
    console.log(params)
    try {
      let response = await fetch('/api/posts/follow/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const unfollow = async (params, credentials, postId) => {
    try {
      let response = await fetch('/api/posts/unfollow/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const apply = async (params, credentials, postId, appInfo) => {
    try {
      let response = await fetch('/api/posts/apply/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, instrument: appInfo.instrument, postId: postId, description: appInfo.description})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  const approve = async (params, credentials, postId, appInfo) => {
    try {
      let response = await fetch('/api/posts/approve-app/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId, appId: appInfo.appId, instrument: appInfo.instrument, musicianId: appInfo.musicianId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  const decline = async (params, credentials, postId, appInfo) => {
    try {
      let response = await fetch('/api/posts/decline-app/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId, instrument: appInfo.instrument, appId: appInfo.appId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const removeMusician = async (params, credentials, postId) => {
    console.log(params.member)
    try {
      let response = await fetch('/api/posts/remove-musician/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, memberId: params.memberId, postId: postId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const loadChat = async(params, credentials, signal) => {
    console.log('poggggg')
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
    listByUser,
    create,
    remove,
    like,
    unlike,
    follow,
    unfollow,
    getAllNearby,
    comment,
    uncomment,
    apply,
    approve,
    decline,
    removeMusician,
    loadChat
  }
  