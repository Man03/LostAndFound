const Item = require("../model/ItemModel");
const Coordinator = require("../model/coordinatorModel");
const Student = require("../model/studentModel");
const asyncHandler = require("express-async-handler");

const storeFoundItem = asyncHandler(async (req, res) => {
  try {
    const { itemName, description, location, foundDate } = req.body;

    const coordinator = await Coordinator.findById(req.user._id);

    if (!itemName || !description || !location || !foundDate) {
      res.status(400).json({ message: "Please add all fields" });
      throw new Error("Please add all field");
    }

    const item = await Item.create({
      lostType: "Founded",
      itemName,
      description,
      location,
      lostDate: "-",
      foundDate,
      listedBy: coordinator.userName,
      department: coordinator.department,
      status: "Not Claimed",
    });

    await item.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });

    if (item) {
      res.status(200).json({
        message: "Posted successfully",
        _id: item.id,
        lostType: item.lostType,
        itemName: item.itemName,
        description: item.description,
        location: item.location,
        foundDate: item.foundDate,
        listedBy: item.listedBy,
        department: item.department,
      });
    } else {
      res.status(400);
      throw new Error("Invalid item data");
    }
  } catch (err) {
    console.log(err);
  }
});

const storeLostItem = asyncHandler(async (req, res) => {
  try {
    const { itemName, description, location, lostDate } = req.body;

    const student = await Student.findById(req.user.user._id);

    if (!itemName || !description || !location || !lostDate) {
      res.status(400).json({ message: "Please add all fields" });
      throw new Error("Please add all field");
    }

    const item = await Item.create({
      lostType: "Losted",
      itemName: itemName,
      description: description,
      location: location,
      lostDate: lostDate,
      foundDate: "-",
      listedBy: student.userName,
      department: student.department,
      status: "Not founded",
    });

    await item.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });

    if (item) {
      res.status(200).json({
        message: "Posted successfully",
        _id: item.id,
        lostType: item.lostType,
        itemName: item.itemName,
        description: item.description,
        location: item.location,
        lostDate: item.lostDate,
        listedBy: item.listedBy,
        department: item.department,
      });
    } else {
      res.status(400);
      throw new Error("Invalid item data");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  storeFoundItem,
  storeLostItem,
};
