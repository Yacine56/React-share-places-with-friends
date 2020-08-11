const express = require("express");

const placesControllers = require("../controlers/places-controllers");
const { check } = require("express-validator");
const fileUpload =require('../Middleware/FileUpload')
const router = express.Router();
const checkAuth = require('../Middleware/check-auth')

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.use(checkAuth)

router.post(
  "/",
  fileUpload.single('image'),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatedPlace
);

router.delete("/:pId", placesControllers.deletePlace);

module.exports = router;
