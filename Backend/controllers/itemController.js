const Item = require("../model/ItemModel");
const Coordinator = require("../model/coordinatorModel");
const Student = require("../model/studentModel");
const asyncHandler = require("express-async-handler");
const { findById } = require("../model/ItemModel");
const moment = require("moment");

const storeFoundItem = asyncHandler(async (req, res) => {
  try {
    const { itemName, description, location, foundDate } = req.body;

    const coordinator = await Coordinator.findById(req.user._id);

    if (!itemName || !description || !location || !foundDate) {
      res.status(400).json({ message: "Please add all fields" });
      throw new Error("Please add all field");
    }

    var formattedDate = moment(foundDate).format("DD-MM-YYYY");

    const item = await Item.create({
      ItemType: "Found",
      itemName,
      description,
      location,
      lostDate: "-",
      foundDate : formattedDate,
      listedBy: coordinator.userName,
      department: coordinator.department,
      status: "Not claimed",
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
        ItemType: item.lostType,
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

    var formattedDate = moment(lostDate).format("DD-MM-YYYY");

    const item = await Item.create({
      ItemType: "Lost",
      itemName: itemName,
      description: description,
      location: location,
      lostDate: formattedDate,
      foundDate: "-",
      listedBy: student.userName,
      department: student.department,
      status: "Not found",
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
        ItemType: item.lostType,
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

//-----------------------------------------> get- FoundItems <----------------------------------------------------------------//

const getFoundItems = async (req, res) => {
  try {
    const items = await Item.find({
      ItemType: "Found",
      status: "Not claimed",
    });
    if (!items) {
      res.json({ message: "No Items" });
    } else {
      res.json({ message: "Items Details", items: items });
    }
  } catch (error) {
    console.log(error);
  }
};
//-----------------------------------------> get- FoundItems by search <----------------------------------------------------------------//

const getFoundItemsBySearch = async (req, res) => {
  try {
    const query = req.query.q;
    const items = await Item.find({
      itemName: { $regex: new RegExp(query), $options: "i" },
      ItemType: "Found",
      status: "Not claimed",
    });
    if (!items) {
      res.json({ message: "No Items" });
    } else {
      res.json({ message: "Items Details", items: items });
    }
  } catch (error) {
    console.log(error);
  }
};

//-----------------------------------------> get Lost-Items <----------------------------------------------------------------//

const getLostItems = async (req, res) => {
  try {
    const items = await Item.find({
      ItemType: "Lost",
      status: { $in: ["Not claimed", "Not found"] },
    });
    if (!items) {
      res.json({ message: "No Items" });
    } else {
      res.json({ message: "Items Details", items: items });
    }
  } catch (error) {
    console.log(error);
  }
};
//-----------------------------------------> get- LostItems by search <----------------------------------------------------------------//

const getLostItemsBySearch = async (req, res) => {
  try {
    const query = req.query.q;
    const items = await Item.find({
      itemName: { $regex: new RegExp(query), $options: "i" },
      ItemType: "Lost",
      status: { $in: ["Not claimed", "Not found"] },
    });
    if (!items) {
      res.json({ message: "No Items" });
    } else {
      res.json({ message: "Items Details", items: items });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------------------ Update Found-Item Status ------------------------------------------------------------------------------>

const updateFoundItemStatus = async (req, res) => {
  try {
    // const updatedItem = await Item.findByIdAndUpdate(
    //   req.params.id,
    //   { $set: { status: req.body.status } },
    //   { new: true }
    // );

    const { _id } = req.body;

    const item = await Item.findById(_id);

    const coordinator = await Coordinator.findById(req.user._id); //Find Coordinator who updating Status

    if (!item) {
      res.status(400);
      console.log("Item not found to be update status");
    } else {
      item.status = "Claimed";
      item.handedBy = coordinator.userName;
      item.save();
    }

    return res.json({
      message: "Item status updated to Claimed from Not Claimed",
    });
  } catch (error) {
    console.log(error);
  }
};
//------------------------------------------------------ Update Lost-Item Status ------------------------------------------------------------------------------>

const updateLostItemStatus = async (req, res) => {
  try {
    // const updatedItem = await Item.findByIdAndUpdate(
    //   req.params.id,
    //   { $set: { status: req.body.status } },
    //   { new: true }
    // );

    const coordinator = await Coordinator.findById(req.user._id); //Find Coordinator who updating Status

    const { _id } = req.body;
    const item = await Item.findById(_id);

    if (!item) {
      res.status(400);
      console.log("Item not found to be update status");
    } else {
      if(item.status === "Not found")
      {
        item.status = "Not claimed";
      }
      else{
        item.status = "Claimed";
        item.handedBy = coordinator.userName;
      }
      
      item.save();
    }

    return res.json({
      message: "Item status updated to Claimed from Not Claimed",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  storeFoundItem,
  storeLostItem,
  getFoundItems,
  getLostItems,
  getFoundItemsBySearch,
  getLostItemsBySearch,
  updateFoundItemStatus,
  updateLostItemStatus,
};
