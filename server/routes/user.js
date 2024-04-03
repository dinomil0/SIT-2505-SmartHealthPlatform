const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const { User, bloodPressure } = require("../models");
const yup = require("yup");
const { sign } = require("jsonwebtoken");
require("dotenv").config();
const { validateToken } = require("../middlewares/auth");
// const { bloodPressure } = require("../models/");

const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
const NRICRegex = /^[STMGstmg]\d{7}[A-Za-z]$/;

router.post("/signup", async (req, res) => {
  let data = req.body;

  //Validate request body
  let validationSchema = yup.object({
    NRIC: yup.string().trim().min(9).max(9).required(),
    name: yup.string().trim().min(3).max(50).required(),
    email: yup.string().trim().lowercase().email().max(50).required(),
    phoneNo: yup.string().trim().lowercase().min(8).max(8).required(),
    password: yup.string().trim().min(8).max(50).required(),
    address: yup.string().trim().required(),
    DOB: yup.date().required(),
    gender: yup.string().trim().required(),
    role: yup.string().trim().required(),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // Process valid data

    // Check email
    let user = await User.findOne({
      where: { email: data.email },
    });
    if (user) {
      res.status(400).json({ message: "Email already exists." });
      return;
    }

    // Hash passowrd
    data.password = await bcrypt.hash(data.password, 10);
    // Create user
    let result = await User.create(data);
    res.json({
      message: `Email ${result.email} was registered successfully.`,
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({ errors: err.errors });
  }
});


router.post("/login", async (req, res) => {
  let data = req.body;
  //Validate request body
  let validationSchema = yup.object({
    loginId: yup.string().trim().required(),
    password: yup.string().trim().min(8).max(50).required(),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    console.log("valided data", data)
    // Process valid data

    // Check email and password
    let errorMsg = "Invalid login credentials";
    let user;

    // Check if the login input matches email format or NRIC format using regex
    if (emailRegex.test(data.loginId)) {
      // If login matches email format, find user by email
      console.log("its an email")
      user = await User.findOne({
        where: { email: data.loginId },
      });
    }
    else if (NRICRegex.test(data.loginId)) {
      // If login matches NRIC format, find user by NRIC
      console.log("its a NRIC")
      user = await User.findOne({
        where: { NRIC: data.loginId },
      });
    }
    else {
      console.log("else")
      // If login does not match either email or NRIC format, return error
      res.status(400).json({ message: errorMsg });
      return;
    }

    if (!user) {
      console.log("user not found", user)
      res.status(400).json({ message: errorMsg });
      return;
    }
    let passwordCheck = await bcrypt.compare(data.password, user.password);
    if (!passwordCheck) {
      console.log("inccorect password")
      res.status(400).json({ message: "Password Incorrect" });
      return;
    }
    // Return user info
    let userInfo = {
      id: user.id,
      NRIC: user.NRIC,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      dob: user.DOB
    };

    let accessToken = sign(userInfo, process.env.APP_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });

    res.json({
      accessToken: accessToken,
      user: userInfo,
    });
  }
  catch (err) {
    console.log('error encountered', err)
    res.status(400).json({ errors: err.errors });
  }

  router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
      id: req.user.id,
      NIRC: req.user.NRIC,
      email: req.user.email,
      dob: req.user.DOB,
      name: req.user.name,
      phone: req.user.phone,
      address: req.user.address,
    };
    res.json({
      user: userInfo,
    });
  });
});

//Get blood pressure by NRIC
router.get("/getBloodPressure/:nric", async (req, res) => {
  const userNRIC = req.params.nric; // Assuming NRIC is passed as a parameter
  try {
    const BP = await bloodPressure.findAll({
      where: { NRIC: userNRIC }, // Filter by NRIC
      attributes: ['id', 'systolic', 'diastolic', 'measureDate'], // Select specific attributes to return
    });

    res.json(BP);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch BP." });
  }
});

//Add bloodpressure
router.post("/addBloodPressure", async (req, res) => {
  let data = req.body;

  // Validate request body
  let validationSchema = yup.object({
    NRIC: yup.string(),
    systolic: yup.number().required(),
    diastolic: yup.number().required(),
    measureDate: yup.date().required(), // Adding date validation
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // Process valid data

    // Create a new blood pressure record
    const newBP = await bloodPressure.create({
      NRIC: data.NRIC,
      systolic: data.systolic,
      diastolic: data.diastolic,
      measureDate: data.measureDate, // Include date in the creation process
    });

    res.json({ message: "Blood pressure record added successfully.", newBP });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errors: err.errors });
  }
});

router.get("getUserByID/:id", validateToken, async (req, res) => {
  let id = req.params.id;
  let user = await user.findByPk(id, {
    include: { model: User, as: "user", attributes: ['name'] }
  });
  // Check id not found
  if (!user) {
    res.sendStatus(404);
    return;
  }
  res.json(user);
});

router.put("/updateProfile/:id", validateToken, async (req, res) => {
  let userid = req.params.id;

  let user = await User.findByPk(userid);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  if (user.id != userid) {
    res.sendStatus(403);
    return;
  }


  let data = req.body;

  //Validate request body
  let validationSchema = yup.object({
    name: yup.string().trim().min(3).max(50).required(),
    email: yup.string().trim().lowercase().email().max(50).required(),
    phone: yup.string().trim().min(8).max(8).required(),
    address: yup.string().trim().required(),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });

    let user = await User.update(data, {
      where: { id: userid }
    });

    // update user
    let result = await User.update(data,
      {
        where: { id: userid }
      });
    res.json({
      message: `Profile of ${data.name} was updated successfully.`,
    });
  } catch (err) {
    console.log(err, "ERROR HERE")
    res.status(400).json({ errors: err.errors });
  }
});

router.put("/changePassword/:id", validateToken, async (req, res) => {
  let userId = req.params.id;
  let { oldPassword, newPassword } = req.body;

  try {
    // Find user by ID
    let user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the old password matches
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect old password." });
    }

    // Validate the new password
    let validationSchema = yup.object({
      newPassword: yup.string().trim().min(8).max(50).required(),
    });
    newPassword = await validationSchema.validate({ newPassword }, { abortEarly: false });

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await User.update({ password: hashedNewPassword }, { where: { id: userId } });

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Failed to change password." });
  }
});



module.exports = router;