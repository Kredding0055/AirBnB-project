const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot } = require('../../db/models');


router.get('/:id', async (req, res, next) => {
    const spotId = await Spot.findByPk(req.params.id);
    console.log(req.params.id)
    
})

router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll();
    console.log(allSpots);

    res.json(allSpots)
})


module.exports = router;