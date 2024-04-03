const express = require('express');
const router = express.Router();

const { Op } = require("sequelize");
// let tutorialList = [];

const { Tutorial } = require('../models');

// Lab 1 activity 
// router.post("/", (req, res) => {

//     let data = req.body;
//     tutorialList.push(data);
//     res.json(data);

// });

// Lab 2a activity 3
// router.post("/", async (req, res) => {

//     let data = req.body;
//     let result = await Tutorial.create(data);
//     res.json(result);

// });

const yup = require("yup");
router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        // Process valid data
        let result = await Tutorial.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Lab 1 activity
// router.get("/", (req, res) => {

//     res.json(tutorialList);

// });

// Lab 2a activity 4
// router.get("/", async (req, res) => {

//     let list = await Tutorial.findAll({
//         order: [['createdAt', 'DESC']]
//     });
//     res.json(list);

// });

// Lab 2a activity 4
router.get("/", async (req, res) => {

    let condition = {};

    let search = req.query.search;

    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }



    // You can add condition for other columns here
    // e.g. condition.columnName = value;
    let list = await Tutorial.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);

});

//get by id
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let tutorial = await Tutorial.findByPk(id);
    //Check id not found
    if (!tutorial) {
        res.sendStatus(404);
        return;
    }
    res.json(tutorial);
})

//update by id
router.put("/:id", async (req, res) => {
    let id = req.params.id;

    // Check id not found
    let tutorial = await Tutorial.findByPk(id);
    if (!tutorial) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500)
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        // Process valid data


        let num = await Tutorial.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Tutorial was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update tutorial with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
})


//delete by id
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let num = await Tutorial.destroy({
            where: { id: id }
        })
        if (num == 1) {
            res.json({
                message: "Tutorial was deleted successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot delete tutorial with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});


module.exports = router;