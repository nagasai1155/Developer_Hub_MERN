const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const devuser =require('./devusermodel');
const bodyparser = require('body-parser');

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