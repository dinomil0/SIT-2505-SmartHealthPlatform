const express = require('express');
const cors = require('cors')
const app = express();

require('dotenv').config();

app.use(express.json());

// Enable CORS
app.use(cors({

    origin: process.env.CLIENT_URL

}));

// Simple Route
app.get("/", (req, res) => {

    res.send("Welcome to the learning.");

});

// Routes
const tutorialRoute = require('./routes/tutorial');
app.use("/tutorial", tutorialRoute);
const userRoute = require('./routes/user');
app.use("/user", userRoute);

const deviceRoute = require('./routes/device');
app.use('/device', deviceRoute);

const measurementRoute = require('./routes/measurement');
app.use('/measurement', measurementRoute);

const reminderRoute = require('./routes/reminder');
app.use('/reminder', reminderRoute);


const db = require("./models");

db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
