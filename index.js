const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const devuser =require('./devusermodel');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware')

dotenv.config();

 mongoose.connect(process.env.MONGO_URI)
 .then(()=>{
    console.log("mongodb connected successfully");
 })
 .catch(()=>{
    console.log("mongodb not conncted");
 })

app.use(bodyparser.json());
app.listen(3600,()=>{
    console.log("sever running at port 3600");
})



app.get('/home',(req,res)=>{
    return res.send("hello world");
})


//first router registration 
app.post('/register',async(req,res)=>{
    try{
        const {fullname,email,mobile,skills,password,confirmpassword}=req.body;
        const exists = await devuser.findOne({email}) ;
        if(exists){
            return res.status(400).json({message:"user already registerd"})
        }
        if(password != confirmpassword) {
            return res.status(402).json({message:"password not matches "})

        }
        let newuser = new devuser({
            fullname,email,mobile,skills,password,confirmpassword
        })
        newuser.save();
        console.log(newuser);
        return res.status(200).json({message:"successfully registred"});
        

    }catch(error){
        console.log(error);
        return res.status(503).json({message:"server error"});
    }
})

//now router for the login 

app.get('/login',async(req,res)=>{
    try{
        const {email,password}= req.body;
        const exists = await devuser.findOne({email})
        if(!exists){
            return res.status(404).json({message:"user not exists"})
        }

       if(exists.password != password){
        return res.status(400).json({message:"invalid password"});
       }
         
       let payload={
        "user":{
            "id":"exists.id"
        }
       }
       jwt.sign(payload,'jwtpassword',{expiresIn:"1h"},(err,token)=>{
         if(err) throw err;
         return res.json({token});
       })

       
    }catch(error){
        console.log(error);
        return res.status(502).json({message:"server error"})
    }
})

//router for the all profiles

app.get('/allprofiles',async(req,res)=>{

    try{
 
        let allprofiles = await devuser.find();
         return res.json(allprofiles);
   




    }catch(err){
        console.log(err);
        return res.status(500).json({message:"server error"})
    }
})


//myprofile token
app.get('/myprofile',middleware,async(req,res)=>{
    try{
    let user = await devuser.findById(req.user.id);
    return res.json(user);

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"server error"})
    }
})

//add review rotuer

app.post('/addreview',middleware,async(req,res)=>{
    try{
        
    }catch(err){
        console.log(err);
        return res.status(501).send("server error")
    }
})