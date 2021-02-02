const express = require('express');
const router = express.Router();

module.exports = router;

const getTile = async (req, res, next) => {
    const {z, x, y } = req.params;
    try {
        const tile = await require(`../export/cacheV2`).getTile(z, x, y)
        res.writeHead(200, {'Content-Type': 'image/png'})
        res.end(tile)
    }
    catch (err){   
        return next(err)
    } 

}

router.get('/:z/:x/:y', getTile);
