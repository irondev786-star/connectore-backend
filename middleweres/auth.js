
const jwt=require("jsonwebtoken")
const user = require("../database/user")
const { request } = require("express")
require("dotenv").config()
function authmid(req,res,next){
    const token=req.cookies.token
    if(!token){
        return res.status(400).json({errors:[{msg:"Tooken was not found"}]})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWTSECRET)
        req.user=decoded.user
        next()
    }catch(err){
        return res.status(401).json({errors:[{msg:"Tooken was invalid"}]})
    }  
}
module.exports=authmid