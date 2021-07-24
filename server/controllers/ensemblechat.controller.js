import Post from '../models/post.model'

export default (server) => {
    const io = require('socket.io')(server)
    io.on('connection', function(socket){
        socket.on('join ensemble room', data => {
            console.log('joined')
            socket.join(data.room)
        })
        socket.on('leave ensemble room', data => {
            socket.leave(data.room)
        })
        socket.on('new message', data => {
            postMessage(data.messageInfo, data.room)
        })
    })
    const postMessage = async (messageInfo, room) => {
        try {
          let result = await Post.findByIdAndUpdate(room, {$push: {ensembleChat: messageInfo}}, {new: true})
                                  .populate('ensembleChat.postedBy', '_id name musician instrument')
                                  .exec()
            io
            .to(room)
            .emit('new message', result.ensembleChat)
        } catch(err) {
          console.log(err)
        }
    }

}