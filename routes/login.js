const express = require("express")
const users = require("../database/user")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")
const router = express.Router()
require("dotenv").config()
const bcrypt = require("bcrypt")
router.post("/", [
    check("email", "Please enter valid email").isEmail(),
    check("password", "Password is too short").isLength({ min: 6 }),
    check("password", "Password is too long").isLength({ max: 20 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    let { email, password } = req.body
    try {


        let user = await users.findOne({ email })
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid Email or Password" }] })
        }

        const isPass = bcrypt.compare(user.password,password)
        if (!isPass) {
            return res.status(400).json({ errors: [{ msg: "Invalid Email or Password" }] })
        }
        const payload = { user: { id: user.id } }
        jwt.sign(payload, process.env.JWTSECRET, { expiresIn: 36000 }, (err, token) => {
            if (!err) {
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                return res.status(201).json({
                    msg: "Logged In successfully",
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