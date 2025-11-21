const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

router.get("/", imageController.index);
router.post("/", imageController.store);
router.post("/delete/:id", imageController.destroy);

module.exports = router;
