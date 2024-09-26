/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express')
//creates a new router for this route
const router = express.Router();
//Used for hashing passwords
const bcrypt = require('bcryptjs');
//imports key functions from utils/auth.js. setTokenCookie creates JWT token, requireAuth verifies 'user' from a token
const { setTokenCookie, requireAuth } = require('../../utils/auth');
//used for validating and sanitizing request data
const { check } = require('express-validator');
//imports a function for handling errors
const { handleValidationErrors } = require('../../utils/validation');
//imports the Spot model
const { Spot } = require('../../db/models');

/************************************************************************************************************************************************ */
//*                                     GET ALL SPOTS
/************************************************************************************************************************************************/

// {
//   "Spots": [
//     {
//       "id": 1,
//       "ownerId": 1,
//       "address": "123 Disney Lane",
//       "city": "San Francisco",
//       "state": "California",
//       "country": "United States of America",
//       "lat": 37.7645358,
//       "lng": -122.4730327,
//       "name": "App Academy",
//       "description": "Place where web developers are created",
//       "price": 123,
//       "createdAt": "2021-11-19 20:39:36",
//       "updatedAt": "2021-11-19 20:39:36",
//       "avgRating": 4.5,
//       "previewImage": "image url"
//     }
//   ]
// }

router.get('/', async (req, res, next) => {
  const allSpots = await Spot.findAll()
  res.status(200).json({
    allSpots
  })
})

/************************************************************************************************************************************************ */
//*                                     CREATE A SPOT 
/************************************************************************************************************************************************/

// middleware
const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('needs address'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('needs city'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('needs state'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('needs country'),
    check('name')
      .exists({ checkFalsy: true })
      .withMessage('needs name'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('needs description'),
    check('lat')
      .exists({ checkFalsy: true })
      .withMessage('needs lattitude'),
    check('lng')
      .exists({ checkFalsy: true })
      .withMessage('needs longitude'),
    check('price')
      .exists({ checkFalsy: true })
      .withMessage('needs price'),
    handleValidationErrors
];

//create a spot
router.post('/', validateSpot, async (req, res,) => {
    console.log(req.body)
    //get all info from req body
    const {address, city, state, country, name, description, lat, lng, price} = req.body;
    //create new instance of spot
    const newSpot = await Spot.create({
        address,
        city,
        state,
        country,
        name,
        description,
        lat,
        lng,
        price
    });

    res.status(201)
    res.json(newSpot)
})

/************************************************************************************************************************************************ */
//*                                     GET DETAILS OF A SPOT FROM AN ID
/************************************************************************************************************************************************/


router.get('/:id', async (req, res, next) => {
  const spotId = await Spot.findByPk(req.params.id);
  // console.log("SPOT SPOT SPOT SPOT SPOT ", spotId)
  if(spotId) {
      res.json(spotId)
  }
  else {
      res.json({"message": "Spot couldn't be found"});
      res.status(404);
  } 
})

router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll();
    // console.log(allSpots);

    res.json(allSpots)
})

/************************************************************************************************************************************************/

module.exports = router;