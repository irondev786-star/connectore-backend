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

      const isPass = await bcrypt.compare(password, user.password);

if (!isPass) {
    return res.status(400).json({
        errors: [{ msg: "Invalid Email or Password" }]
    });
}
        const payload = { user: { id: user.id } }
        jwt.sign(payload, process.env.JWTSECRET, { expiresIn: 36000 }, (err, token) => {
            if (!err) {
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
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
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure:true,
        sameSite: "None", // use "Lax" if frontend and backend are on the same site
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});
module.exports = router
