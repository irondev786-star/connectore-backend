const express=require("express")
const router=express.Router()
const authmid=require("../middleweres/auth")
const {check,validationResult}=require("express-validator")
const users=require("../database/user")
const posts=require("../database/post")
router.get("/onePost/:p_id",authmid,async (req,res)=>{
    const post=await posts.findById(req.params.p_id).populate("comments.writtenBy").populate("createdBy");
   
    res.json(post)
})
router.get("/allPosts",async (req,res)=>{
    const post=await posts.find()
    res.json(post)
})
router.post("/",[authmid,[
    check("title","You must give a title to your post").not().isEmpty(),
    check("title","Your title is too long").isLength({max:20}),
    check("content","We cant read content from your mind please give us some content").not().isEmpty(),
    check("content","Content is too small").isLength({min:100})
]],async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {title,content}=req.body
    let post=await posts.findOne({title})
    if(post){
        return res.status(400).json({errors:[{msg:"Chose a different title this title already taken by someone"}]})
    }
    post =new posts({
        title,
        content,
        createdBy:req.user.id
    })
    post.save()
    let user=await users.findById(req.user.id)
    await user.posts.push(post.id)
    user.save()
    res.json(post)
})
router.delete("/delete/:p_id", authmid, async (req, res) => {
    try {
        const postId = req.params.p_id;
        const userId = req.user.id;

        const post = await posts.findById(postId);

        if (!post) {
            return res.status(404).json({
                errors: [{ msg: "Post not found" }]
            });
        }

        if (post.createdBy.toString() !== userId) {
            return res.status(403).json({
                errors: [{ msg: "You are not allowed to delete this post." }]
            });
        }

        const user = await users.findById(userId);

        user.posts = user.posts.filter(
            (p) => p.toString() !== postId
        );

        await user.save();

        await posts.findByIdAndDelete(postId);

        res.json({ msg: "Post deleted successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({errors:[{ msg: "Server error" }]});
    }
});
module.exports=router