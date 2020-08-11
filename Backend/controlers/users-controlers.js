const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require("../models/User-Model")
const bcrypt =require("bcryptjs")
const jwt = require("jsonwebtoken")

const DUMMY_Users=[
    {
        id:"u1",
        name:"yacine",
        email:"t@t.com",
        password:"password"
    }
]

const login =async(req,res,next)=>{

    const {email,password}=req.body
    try {
        existingUser= await User.findOne({email:email})
    } catch (error) {
        return next(new HttpError("error occured while trying to login"))
    }

    let isValidPassword
    try {
        isValidPassword=await bcrypt.compare(password,existingUser.password)
    } catch (error) {
        return next(new HttpError(error))
    }
    
    if(!isValidPassword){
        return next (new HttpError("invalid email or password"))
    }
    let token
    try {
        token =jwt.sign({userId:existingUser.id,email:existingUser.email},process.env.JWT_KEY,{expiresIn:"1H"})
    } catch (error) {
        
    }
 
    res.json({
        //user:createdUser.toObject({getters:true}),
        userId:existingUser.id,
        email:existingUser.email,
        token})
   
}

const signUp =async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }
 const { name, email,password}=req.body
let existingUser
 try {
    existingUser= await User.findOne({email:email})
} catch (error) {
    return next(new HttpError("couldn't check the email"))
}

if(existingUser){
    return next(new HttpError("user already exists",422))
}
let hashedPassword
try {
    hashedPassword= await bcrypt.hash(password,12)
} catch (error) {
    console.log(error)
}

 const createdUser=new User({
    
     name:name,
     email:email,
     image:req.file.path,
     password:hashedPassword,
     places:[]
 })

    await createdUser.save(function(err){
        if(err){
             console.log(err);
             return;
        }})

let token 
try {
    token= jwt.sign({userId:createdUser.id,email:createdUser.email},process.env.JWT_KEY,{expiresIn:'1H'})
} catch (error) {
    return next(new HttpError("token error"))
}
res.json({
    //user:createdUser.toObject({getters:true}),
    userId:createdUser.id,
    email:createdUser.email,
    token})

}

const getUsers=async(req,res,next)=>{
    let users
    try {
        users=await User.find({},"-password")
    } catch (error) {
        return next (new HttpError("something went wrong when getting the users"))
    }
    res.json({ users:users.map(user=>user.toObject({getters:true})) });

}


exports.login=login
exports.signUp=signUp
exports.getUsers=getUsers