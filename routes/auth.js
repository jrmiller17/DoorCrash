const express = require('express')
const router = express.Router()
const passport = require('passport')

// @description   Authenticate with Google
//@route  GET /auth/google
//Routes are being used in index.js

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @description   Google Auth Callback
//@route  GET /auth/google/callback

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), (req, res) => {
    res.redirect('/stories')
})
//@description Logout User
//@route /auth/logout

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})
module.exports = router