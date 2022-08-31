const express = require('express');
const {check} = require('express-validator');

const router = express.Router();

const placesControllers = require('../controllers/places-controllers');
const FileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.get('/:pId',placesControllers.getPlaceById);

router.get('/user/:uId',placesControllers.getPlacesByUserId);

router.use(checkAuth);

router.post(
    '/',
    FileUpload.single('image'),
    [
        check('title').notEmpty(),
        check('description').isLength({min:5}),
        check('address').notEmpty()
    ],
    placesControllers.createPlace);

router.patch(
    '/:pId',
    [
        check('title').notEmpty(),
        check('description').isLength({min:5})
    ],
    placesControllers.updatePlace);

router.delete('/:pId',placesControllers.deletePlace);

module.exports = router;