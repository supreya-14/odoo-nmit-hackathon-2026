const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, applyLeave);
router.get('/my', protect, getMyLeaves);
router.get('/all', protect, adminOnly, getAllLeaves);
router.put('/:id/approve', protect, adminOnly, approveLeave);
router.put('/:id/reject', protect, adminOnly, rejectLeave);

module.exports = router;
