const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const User = require('../models/user');

const getUser = async (req,res,next) => {
    const userId = req.params.uId;
    let user;
    try {
        user = await User.findById(userId,'-password');
    } catch (err) {
        const error = new HttpError('Fetching user failed, please re-login',500);
        return next(error);
    }
    
    if (!user) {
        const error = new HttpError('Could not find user for provided id !',404);
        return next(error);
    }

    
    res.json({user : user.toObject({getters : true})});
}

const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError('Fetching users failed, please try again later',500);
        return next(error);
    }

    res.json({users: users.map(u => u.toObject({getters : true}))});
}

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return next (new HttpError('Invalid data !',422));
    }

    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email : email});
    } catch (err) {
        const error = new HttpError('Logging in failed !, please try again.',500);
        return next(error);
    }

    if(!existingUser){
        const error = new HttpError(`Invalid credentials, can't log you in !`,401);
        return next(error);
    }

    let isValidPassword;
    try {
        isValidPassword = await bycrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(`Couldn't log you in, check your credentials and please try again.`,500);
        return next(error);
    }

    if(!isValidPassword){
        const error = new HttpError(`Invalid credentials, can't log you in !`,401);
        return next(error);
    }

    let token;
    try {
        token = await jwt.sign({userId : existingUser.id, email : existingUser.email},process.env.JWT_KEY,{expiresIn : '1h'});
    } catch (err) {
        const error = new HttpError('Logging in failed !, please try again.',500);
        return next(error);
    }

    res.status(200).json({userId : existingUser.id, email : existingUser.email, token : token});
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return next (new HttpError('Invalid data !',422));
    }

    const {name , email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email : email});
    } catch (err) {
        const error = new HttpError('Signing up failed !, please try again.',500);
        return next(error);
    }

    if(existingUser){
        const error = new HttpError('User already exists, you can login instead',422);
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bycrypt.hash(password,12);
    } catch (err) {
        const error = new HttpError('Could not create user, please try again.',500);
        return next(error);
    }

    const createdUser = new User ({
        name,
        email,
        password : hashedPassword,
        image : req.file.location,
        places : []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed !, please try again.',500);
        return next(error);
    }

    let token;
    try {
        token = await jwt.sign({userId : createdUser.id, email : createdUser.email},process.env.JWT_KEY,{expiresIn : '1h'});
    } catch (err) {
        const error = new HttpError('Signing up failed !, please try again.',500);
        return next(error);
    }

    res.status(201).json({userId : createdUser.id, email : createdUser.email, token : token });
}

exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.login = login;
exports.signup = signup;