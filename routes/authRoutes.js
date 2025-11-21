const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // pastikan path benar

router.get('/login', authController.loginPage);   // HARUS function
router.post('/login', authController.login);
router.get('/register', authController.registerPage);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

module.exports = router;
