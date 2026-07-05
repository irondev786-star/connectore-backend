const express =require("express")
const router=express.Router()
const cookieParser=require("cookie-parser")
const authmid=require("../middleweres/auth")
const users=require("../database/user")
const posts=require("../database/post")
router.use(cookieParser())
router.get("/",authmid,async (req,res)=>{
    const user=await users.findById(req.user.id)
    let activeUser=user.toObject()
    delete activeUser.posts
    let postIds=user.posts
    let userPosts=[]
    for(let i=0;i<postIds.length;i++){
        const post=await posts.findById(postIds[i])
        userPosts.push({post})
    }
    activeUser={activeUser,userPosts}
    res.json(activeUser)
})
router.get("/name",authmid,async (req,res)=>{
    const user=await users.findOne({fullName:req.body.name})
    if(!user){
        return res.status(400).json({errors:[{msg:"Account not found"}]})
    }
    if(user.id.toString()===req.user.id){
        return res.status(400).json({errors:[{msg:"You cannot search your own acound"}]})
    }
    let activeUser=user.toObject()
    delete activeUser.posts
    let postIds=user.posts
    let userPosts=[]
    for(let i=0;i<postIds.length;i++){
        const post=await posts.findById(postIds[i])
        userPosts.push({post})
    }
    activeUser={activeUser,userPosts}
    res.json(activeUser)
})
module.exports=router