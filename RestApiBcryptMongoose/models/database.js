const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    password : {
    type : String,
    required : true
    },
    email : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        required  : false
    }
})

//export this schema
module.exports = mongoose.model('facebook' , usersSchema)