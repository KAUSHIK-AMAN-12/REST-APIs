//const route = require('express').Router() //--->   Another way to call Router() 
const { Router } = require('express')     //express ke andar hi router func() hota hai
const route = Router()

const users = require('../models/database') ;
const bcrypt = require('bcrypt')        //two func --> bcrypt.hash(req.body.password,10),bcrypt.genSalt(10)

//------------ FOR ALL USERS       ---------------------------------///
route.get('/',async (req,res)=>         ///--->  async function for Database 
{
try{
const userval = await users.find();
if(users == null)
{
   return res.status(404).json({ message : 'users doesnt exists'})
}        
res.status(201).json(userval)
}
catch(e){
res.json({ message : e.message})
}
})

///----------  CREATE USER in OUR DB -------------------//

route.post('/',async (req,res)=>
{
   try{
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(req.body.password , 10)
    console.log(salt)
    console.log(hashedpassword)
    const user = new users({
        name : req.body.name,
        password : hashedpassword,
        email : req.body.email,
        age : req.body.age
    })
    const newuser = await user.save();    
  
     res.status(201).json(newuser)
   }
   catch(err)
   {
       res.status(500).json({ message : err.message})
   }
})

//// ------------------------ MIDDLEWARE FUNC() For finding User by post ---------------//// 

async function finduserById(req,res,next)
{
    let user
    try{
      user = await users.findById(req.body.id)    //users schema me req.body.name se matching object data lana hai
     if(user == null)
     {
         return res.status(404).json({message : 'cannot find user'})
     }
     if(await bcrypt.compare(req.body.password,user.password))
    {
     res.user = user
    }
    else{
    res.send('not allowed') 
    } 
    }
    catch(e){
      return res.status(400).json({message : e.message})
    }
    next();
}

route.post('/getuser',finduserById,async (req,res)=>
{
res.json(res.user)
})
 
//------         Middleware func() for req.params.id      ------////
async function getuserbyidwithparams(req,res,next)
{
    let user;
    try{
    user = await users.findById(req.params.id)
    if(user == null)
    {
       return res.status(404).json({ message : 'Cannot find user' })
    }
    res.user = user
    }
    catch(e)
    {
       return res.status(500).json({ message : e.message })
    }
    next()
}

route.get('/:id/:password', getuserbyidwithparams , (req,res) =>
{
    res.json(res.user)
})


///------- UPDATING USER --------------------////
route.patch('/updateuser/:id', getuserbyidwithparams ,async(req,res)=>
{
if(req.body.name != null)
{
    res.user.name = req.body.name
}
if (req.body.email != null)
{
    res.user.email = req.body.email
}
try{
 let updatesuserval = await res.user.save()
 res.json(updatesuserval)
}
catch(e)
{
    res.status(400).json({ message : e.message })
}
})


module.exports = route 
