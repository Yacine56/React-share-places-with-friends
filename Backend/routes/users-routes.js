const express = require("express")
const router =express.Router()
const usersControllers = require('../controlers/users-controlers')
const { check } = require('express-validator');
const fileUpload =require('../Middleware/FileUpload')

  
  router.get('/',usersControllers.getUsers)

  router.post('/signup',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],usersControllers.signUp)

 router.post('/login',usersControllers.login)



  module.exports = router;