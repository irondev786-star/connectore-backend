const express = require("express")
const router = express.Router()
const authmid = require("../middleweres/auth")
const { check, validationResult } = require("express-validator")
const posts = require("../database/post")
router.post("/add/:p_id", [authmid, [
    check("content", "We canot read comment from your mind").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(400).json({ errors: errors.array() })
    }
    const { content } = req.body
    const postId = req.params.p_id
    const userId = req.user.id

    try {
        let post = await posts.findById(postId)
        if (!post) {
            return res.status(400).json({ errors: [{ msg: "Post not found" }] })
        }
        const commentData = {
            content,
            writtenBy: userId
        }
        post.comments.push(commentData)
        post.save()
        res.json(post)
    } catch (err) {
        res.status(500).json({ errors: [{ msg: "Server is not responding properly" }] })
    }
})
router.delete("/delete/:p_id", authmid, async (req, res) => {
    const postId = req.params.p_id
    const userId = req.user.id
    const commentId = req.body.id
    try {
        const post = await posts.findById(postId)
        const comment = await post.comments.find(c => c._id == commentId)
        if (comment.writtenBy.toString() !== userId) {
            res.status(400).json({ errors: [{ msg: "You cannot delete this comment" }] })
        }
        let comments = []
        comments = await post.comments.filter(c => c._id != commentId)
        post.comments = comments
        await post.save()
        res.json(post)
    } catch (err) {
        res.status(500).json({ errors: [{ msg: "Server is not responding properly" }] })
    }

})
module.exports = router