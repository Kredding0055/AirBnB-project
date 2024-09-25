const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot } = require('../../db/models');




//create spot middleware
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
router.post('/other', validateSpot, async (req, res,) => {
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



//*test url
//import the model
const {testfile2}=require('../../db/models');
//set up url
router.post('/test1', async (req,res) => {
    console.log(req.body)
    // authenticate 

    //grab data from res body
    const {message} = req.body

    //error code
    if(!message){
      res.status(400)
      res.json({error: "invalid message"})
    }    

    //create new instance of class
    const newTest = await testfile2.create({
      message
    })

    //send response
    res.status(200)
    res.json(newTest)
})

router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll();
    console.log(allSpots);

    res.json(allSpots)
})
/* test fetch
fetch('/api/spots/test1', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": "fWwuoKLy-LxSZ0ezNPW19aNKulQY_LB7ljs0"
    },
    body: JSON.stringify({address: "124", city: "test", state: "test", country: "test", name: "test", description: "test", lat: 12, lng: 12, price: 12
    })
  }).then(res => res.json()).then(data => console.log(data));
*/

router.get('/:id', async (req, res, next) => {
  const spotId = await Spot.findByPk(req.params.id);
  console.log(req.params.id)
  
})

module.exports = router;