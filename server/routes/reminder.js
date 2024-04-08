const express = require('express');
const router = express.Router();
const { Reminder, User, Device } = require('../models');

// Route to add a new reminder
router.post('/', async (req, res) => {
  try {
    const { userId, deviceId, title, description, status, notifications, reminderTime } = req.body;

    // Create a new reminder
    const newReminder = await Reminder.create({
      userId,
      deviceId,
      title,
      description,
      status,
      notifications,
      reminderTime
    });

    res.status(201).json(newReminder);
  } catch (error) {
    console.error('Error adding reminder:', error);
    res.status(500).json({ error: 'Failed to add reminder' });
  }
});

// Route to get all reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      include: [User, Device] // Include associated User and Device data
    });
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

module.exports = router;
