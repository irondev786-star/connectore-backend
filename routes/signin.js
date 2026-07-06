const express = require("express")
const users = require("../database/user")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")
const router = express.Router()
require("dotenv").config()
const bcrypt = require("bcrypt")
const cookieParser=require("cookie-parser")
router.use(cookieParser())
router.post("/", [
    check("fullName", "Please enter your name").not().isEmpty(),
    check("email", "Please enter valid email").isEmail(),
    check("password", "Password is too short").isLength({ min: 6 }),
    check("password", "Password is too long").isLength({ max: 20 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    let { fullName, email, password } = req.body
    try {


        let user = await users.findOne({ email })
        if (user) {
            return res.status(400).json({ errors: [{ msg: "Email Already taken by another use" }] })
        }
        user = await users.findOne({ fullName })
        if (user) {
            return res.status(400).json({ errors: [{ msg: "Username is  Already taken by another use" }] })
        }

        const salt = await bcrypt.genSalt(process.env.ROUND)
        password = await bcrypt.hash(password, salt)
        user = new users({
            email,
            password,
            fullName
        })

        await user.save()
        const payload = { user: { id: user.id } }
        jwt.sign(payload, process.env.JWTSECRET, { expiresIn: 36000 }, (err, token) => {
            if (!err) {
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                return res.status(201).json({
                    msg: "User registered successfully",
                });
            }
            else{
                res.status(500).json({ errors: [{ msg: "Server is not responding Properly please try again latter" }] })
    }
            
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: [{ msg: "Server is not responding Properly please try again latter" }] })
    }

})

module.exports = router
