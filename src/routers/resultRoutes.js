const express = require("express");
const { rollModel } = require("../models/rollSchema");
const { schoolModel } = require("../models/schoolSchema");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello mahfuz");
});

router.get("/individual", async (req, res) => {
  const roll = req.query.roll;
  const rollNumber = Number(roll);
  const year = req.query.year;
  try {
    const response = await rollModel.findOne(
      { roll: rollNumber },
      "-_id -__v -updatedAt -createdAt",
      {
        maxTimeMS: 1000,
      }
    );
    res.status(200).json({
      result: response,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({ err: "There was an server side error!" });
  }
});

router.get("/institution", async (req, res) => {
  const eiin = req.query.eiin;
  const eiinNumber = Number(eiin);
  const year = req.query.year;

  schoolModel
    .findOne({ eiin: eiinNumber })
    .populate("examine", "roll gpa -_id")
    .maxTimeMS(1000)
    .select({
      _id: 0,
      __v: 0,
    })
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({
          result: data,
          message: "Success",
        });
      }
    });
});

router.post("/", async (req, res) => {
  const { eiin } = req.body;

  const rollEntry = new rollModel(req.body);
  try {
    const rollSuccess = await rollEntry.save();
    console.log(rollSuccess?.roll);
    await schoolModel.updateOne(
      {
        eiin: eiin,
      },
      {
        $push: {
          examine: rollSuccess._id,
        },
      }
    );
    res.status(200).json("roll inserted successfully");
  } catch (err) {
    console.log(err);
  }
});

router.post("/school", async (req, res) => {
  const schoolEntry = new schoolModel(req.body);
  try {
    const data = await schoolEntry.save();
    res.status(200).json("school inserted successfully");
    console.log(data?.name);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
