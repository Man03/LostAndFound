const express = require("express");
const router = express.Router();

const { protectCoordinator } = require("../middlewares/auth_coordinator");
const { protectStudent } = require("../middlewares/auth_student");

const {
  storeFoundItem,
  storeLostItem,
  updateFoundItemStatus,
} = require("../controllers/itemController");

router.post("/storeFounditems", protectCoordinator, storeFoundItem);

router.post("/storeLostitems", protectStudent, storeLostItem);

router.post("/updateStatus", protectCoordinator, updateFoundItemStatus);

module.exports = router;
