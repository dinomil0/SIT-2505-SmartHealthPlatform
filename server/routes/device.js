const express = require('express');
const router = express.Router();
const { Device } = require('../models');

// POST route to add a new device
router.post('/', async (req, res) => {
    try {
        const { name, type, userId } = req.body;

        // Create a new device record
        const newDevice = await Device.create({
            name,
            type,
            userId,
            setupCompleted: false // By default, device setup is not completed
        });

        res.status(201).json(newDevice);
    } catch (error) {
        console.error('Error adding device:', error);
        res.status(500).json({ error: 'Failed to add device' });
    }
});

// fetch all devices
router.get('/', async (req, res) => {
    try {
      // Fetch all devices from the database
      const devices = await Device.findAll();
  
      // Return the list of devices as a JSON response
      res.json(devices);
    } catch (error) {
      // Handle any errors that occur during the database query
      console.error('Error fetching devices:', error);
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });
module.exports = router;
