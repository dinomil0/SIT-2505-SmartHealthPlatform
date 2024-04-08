const express = require('express');
const router = express.Router();
const { Measurement } = require('../models');
// Route to add a new measurement
router.post('/', async (req, res) => {
  try {
    const { attributeId, measurementValue, dateTime, userDeviceId } = req.body;

    // Create a new measurement
    const newMeasurement = await Measurement.create({
      attributeId,
      measurementValue,
      dateTime,
      userDeviceId
    });

    res.status(201).json(newMeasurement);
  } catch (error) {
    console.error('Error adding measurement:', error);
    res.status(500).json({ error: 'Failed to add measurement' });
  }
});

// Route to get all measurements
router.get('/', async (req, res) => {
  try {
    const measurements = await Measurement.findAll();
    res.json(measurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
});

module.exports = router;