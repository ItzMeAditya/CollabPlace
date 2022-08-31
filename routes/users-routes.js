const express = require('express');
const {check} = require('express-validator');

const router = express.Router();

const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

router.get('/user/:uId',usersControllers.getUser);

router.get('/all',usersControllers.getAllUsers);

router.post(
    '/login',
    [
        check('email').notEmpty(),
        check('password').isLength({min:6})
    ],
    usersControllers.login);

router.post(
    '/signup',
    fileUpload.single('image'),
    [
        check('name').notEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min:6})
    ],
    usersControllers.signup);

module.exports = router;