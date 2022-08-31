const fs = require('fs');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const fileDelete = require('../middleware/file-delete');

/*
let DUMMY_PLACES = [
    {
        id : 'p1',
        title : 'Victoria Memorial',
        description : 'The Victoria Memorial is a large marble building in Central Kolkata, which was built between 1906 and 1921.',
        address : 'Victoria Memorial Hall, 1, Queens Way, Maidan, Kolkata, West Bengal 700071',
        location : {
            lat : 22.5448082,
            lng : 88.3425578
        },
        creator : 'u1'
    },
]*/

const getPlaceById = async (req,res,next) => {

    const placeId = req.params.pId;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place',500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError('Could not find the place for the provided id.',404);
        return next(error);
    }

    res.json({place : place.toObject({getters : true})});
}

const getPlacesByUserId = async (req,res,next) => {
    const userId = req.params.uId;
    
    let places;
    try {
        places = await Place.find({creator : userId}); // In mongoose find returns an array where in mongoDb it returns pointer
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place',500);
        return next(error);
    }

    if (!places || places.length === 0) {
        return next(new HttpError('Could not find the places for the provided user id.',404));
    }

    res.json({places : places.map(p => p.toObject({getters : true}))});
}

const createPlace = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return next (new HttpError('Invalid data !',422));
    }

    const { title, description, address} = req.body;

    
    let coordinates;
    try{
        coordinates = await getCoordsForAddress(address);
    }catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        image : req.file.location,
        location : coordinates,
        creator : req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again later',500);
        return next(error);
    }
    
    if (!user) {
        const error = new HttpError('Could not find user for provided id !',404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session : sess});
        user.places.push(createdPlace);
        await user.save({session : sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Creating place failed !, please try again.',500);
        return next(error);
    }

    res.status(201).json({createdPlace});
}

const updatePlace = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return next(new HttpError('Invalid data !',422));
    }

    const {title,description} = req.body;
    const placeId = req.params.pId;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update a place',500);
        return next(error);
    }

    if (place.creator.toString() !== req.userData.userId){
        const error = new HttpError(`You aren't allowed to edit this place`,401);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update place',500);
        return next(error);
    }

    res.status(200).json({updatedPlace : place.toObject({getters : true})});
}

const deletePlace = async (req,res,next) => {
    const placeId = req.params.pId;
    
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete place',500);
        return next(error);
    }

    if(!place) {
        const error = new HttpError('Could not find place for this id !',404);
        return next(error);
    }

    if (place.creator.id !== req.userData.userId){
        const error = new HttpError(`You aren't allowed to delete this place`,401);
        return next(error);
    }


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session : sess});
        place.creator.places.pull(place);
        await place.creator.save({session : sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete place',500);
        return next(error);
    }

    const imagePath = place.image;
    fileDelete(imagePath);
    // below code for removing file from static folder
    //fs.unlink(imagePath,err => {});



    res.status(200).json({message : "Deleted"});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;