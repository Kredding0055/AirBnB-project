const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot } = require('../../db/models');


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

router.get('/current', async (req, res, next) => {
    const userId = await User.findByPk(req.params.current);
    console.log(userId)
})

router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll();
    // console.log(allSpots);

    res.json(allSpots)
})


module.exports = router;