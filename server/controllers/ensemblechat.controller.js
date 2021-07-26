import Post from '../models/post.model'

export default (server) => {
    const io = require('socket.io')(server)

    io.on('connection', function(socket){

        //Join chatroom
        socket.on('join ensemble room', data => {
            socket.join(data.room)
        })

        //Leave chatroom
        socket.on('leave ensemble room', data => {
            socket.leave(data.room)
        })

        //Add message to chatroom
        socket.on('new message', data => {
            postMessage(data.messageInfo, data.room)
        })
    })

    /**
     * Post a message to a chat room
     * @param  {Object} messageInfo - object containing message information
     * @param  {Object} room - add to posting chatroom
     * 
     */
    const postMessage = async (messageInfo, room) => {
        try {
          let result = await Post.findByIdAndUpdate(room, {$push: {ensembleChat: messageInfo}}, {new: true})
                                  .populate('ensembleChat.postedBy', '_id name musician instrument')
                                  .exec()

            //Send new message to all users in chatroom
            io
            .to(room)
            .emit('new message', result.ensembleChat)

        } catch(err) {
          console.log(err)
        }
    }

}