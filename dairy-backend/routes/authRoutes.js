const express = require('express');
const router = require('express').Router();
const ctrl = require('../controllers/authController');
const mustAuth = require('../middleware/authMiddleware');   // verifies JWT

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.post('/forgot-password', ctrl.forgotPassword);

router.get('/me', mustAuth, ctrl.me);


module.exports = router;
