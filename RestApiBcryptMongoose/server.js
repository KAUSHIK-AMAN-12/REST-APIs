require('dotenv').config()
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

//now we have to connect to mongoose to mongodb link
mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser : true,useUnifiedTopology : true})

const db = mongoose.connection            //------->   mongoose.connection will return an object
//db.dropDatabase();                       //------>   to drop the database 

//-----       to assure that our mongoose connected safely to mongodb          -------------------------///
db.on('error' , (error) =>
{
    console.log(error)
}) ///error aane pe 
db.once('open' ,()=> console.log('Connected safely'))  ///aur ekbar connect hojane pe

app.use(express.json())

const usersRoute = require('./routes/users')
app.use('/users', usersRoute)

app.listen(4545,()=>
{
    console.log('http://localhost:4545')
})
