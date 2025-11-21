const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/home", homeController.getHome);
router.get("/bulan/:month", homeController.getByMonth);

module.exports = router;
