const express = require('express');
const MajorController = require('../EF/controllers/MajorController');

const router = express.Router();

router.get('/majors', MajorController.getAllMajors);
router.get('/majors/:id', MajorController.getMajorById);
router.post('/majors', MajorController.createMajor);
router.put('/majors/:id', MajorController.updateMajor);
router.delete('/majors/:id', MajorController.deleteMajor);

module.exports = router;