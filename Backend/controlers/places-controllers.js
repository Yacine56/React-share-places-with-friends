const HttpError = require('../models/http-error');
//const uuid=require("uuid/v4")
const { validationResult } = require('express-validator');
const Place = require("../models/Place-Model")
const User = require("../models/User-Model")
const mongoose = require("mongoose")
const fs = require("fs")


const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place
  try {
    place = await Place.findById(placeId).exec()
  } catch (error) {
    return next(new HttpError("something went wrong coudn't find the place", 404))
  }

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }

  res.json({ place: place.toObject({ getters: true }) });
};



const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places
  try {
    places = await Place.find({ creator: userId }).exec()
  } catch (error) {
    throw HttpError(error, 500)
  }


  // if (!places || places.length == 0) {
  //   return next(
  //     new HttpError('Could not find a place for the provided user id.', 404)
  //   );
  //}

  res.json({ places: places.map(place => place.toObject({ getters: true })) })
};





const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
  const { title, description, address, creator } = req.body
  const NewPlace = new Place({

    title,
    description,
    image: req.file.path,
    location: {
      lat: 544564,
      lng: -5467858
    },
    address,
    creator:req.userData.userId
  })

 let user
  try {
    user = await User.findById(creator)
  } catch (error) {
    return next(new HttpError("couldn't look for the user for the created place", 404))
  }
  if (!user) {
    return next(new HttpError("couldn't find the user for the created place", 404))
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await NewPlace.save({ session: sess })
    user.places.push(NewPlace)
    await user.save({session:sess})
    await sess.commitTransaction()

  } catch (error) {
    return next(new HttpError(error))
  }




  res.status(201).json({ place: NewPlace })
};








const updatedPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description,address } = req.body;
  const placeId = req.params.pId;

  let place
  try {
    place = await Place.findById(placeId).exec()
  } catch (error) {
    return next(new HttpError("something went wrong coudn't find the place", 404))
  }
  if(place.creator.toString()!==req.userData.userId){
    return next(new HttpError("you are not allowed to do this update"))
  }
  

  place.title = title;
  place.description = description;
  place.address=address

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};






const deletePlace = async (req, res, next) => {
  const placeId = req.params.pId;

  let place
  try {
    place = await Place.findById(placeId).populate("creator")
  } catch (error) {
    return next(new HttpError("something went wrong coudn't find the place", 404))
  }
  if(!place){
    return next(new HttpError("place not found"))
  }
  if(place.creator.id!==req.userData.userId){
    return next(new HttpError("you are not allowed to do this update"))
  }
   const imagePath=place.image
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
   await place.remove({session:sess})
   place.creator.places.pull(place)
   await place.creator.save({session:sess})
   sess.commitTransaction()
  } catch (error) {
    return next(new HttpError(error, 404))
  }

 fs.unlink(imagePath,err=>{
   console.log(err)
 })

  res.status(200).json({ message: "deleted" })
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace
exports.updatedPlace = updatedPlace
exports.deletePlace = deletePlace