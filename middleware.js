const jwt = require('jsonwebtoken');
module.exports= function(req,res,next){
    try{
       
        let token = req.Headers('header');
        if(!token){
            return res.status(403).json({message:"token not found"});
        }
        let decode = jwt.verify(token,'jwtpassword')
        req.user =decode.user;
        next();

       

    }catch(error){
        console.log(error);
        return res.status(400).json({message:"authtication error"})
    }
}
