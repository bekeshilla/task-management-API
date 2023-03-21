const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)




// const Task = mongoose.model ('Task', {
//     description:{ 
//         type: String,
//         required:true,
//         trim: true,

//     },
//     completed: {
//         type:Boolean,
//         default: false
//     }
// })
