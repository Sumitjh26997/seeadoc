const LOCATION = require('../models/location');

module.exports = {
    addLocation: addLocation,
    updateLocation: updateLocation,
    fetchLocations: fetchLocations,
    deleteLocation: deleteLocation
};


function addLocation(req, res, next) {
    if (!req.body.country && !req.body.state && !req.body.town) {
        res.status(400);
        return res.json({
            success: false,
            message: "Invalid credentials",
            data: null
        });
    } else {
        let location = new LOCATION({
            country: req.body.country,
            state: req.body.state,
            town: req.body.town,
            lat: req.body.lat,
            lng: req.body.lng            
        });

        location.save((err, success) => {
            if (err) throw err;
            res.status(200);
            return res.json({
                success: true,
                message: 'Location has been added',
                data: success
            });
        });
    }
}


function updateLocation(req, res, next) {
    if (!req.body.id && !req.body.country && !req.body.state && !req.body.town && !req.body.lat && !req.body.lng) {
        res.status(400);
        return res.json({
            success: false,
            message: "Required field error !",
            data: null
        });
    } else {
        let data = {
            country: req.body.country,
            state: req.body.state,
            town: req.body.town,
            lat: req.body.lat,
            lng: req.body.lng  
        };

        LOCATION.findByIdAndUpdate(req.body.id, data, { new: true }, (err, success) => {
            if (err) throw err;
            res.status(200);
            return res.json({
                success: true,
                message: 'Location has been updated',
                data: success
            });
        })
    }
}

function fetchLocations(req, res, next) {
    let query = req.body.query || {};
    LOCATION.find(query, function (err, locations) {
        if (err) throw err;
        res.status(200);
        return res.json({
            success: true,
            message: 'Locations list',
            data: locations
        });
    });
}

function deleteLocation(req, res, next) {
    if (!req.body.id) {
        res.status(400);
        return res.json({
            success: false,
            message: "Invalid credentials",
            data: null
        });
    } else {
        LOCATION.findByIdAndRemove(req.body.id, (err, success) => {
            if (err) throw err;
            res.status(200);
            return res.json({
                success: true,
                message: 'Location has been deleted!',
                data: success
            });
        });
    }
}