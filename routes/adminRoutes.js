const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const uploadImage = require("../middleware/uploadImage");
const checkSession = require('../middleware/checkSession');
const checkRole = require('../middleware/checkRole');

router.use(checkSession);
// Redirect /admin ke /admin/foto
router.get("/", (req, res) => {
  res.redirect("/admin/foto");
});

// Tampilkan semua foto
router.get("/foto",checkRole('admin'), adminController.getAdmin);
// Tambah foto baru
router.post("/foto",checkRole('admin'), uploadImage.single("foto"), adminController.addPhoto);
// Form edit foto
router.get("/foto/edit/:id",checkRole('admin'), adminController.editForm);
// Update foto
router.post("/foto/update/:id",checkRole('admin'), uploadImage.single("foto"), adminController.updatePhoto);
// Hapus foto
router.post("/foto/delete/:id",checkRole('admin'), adminController.deletePhoto);

module.exports = router;
