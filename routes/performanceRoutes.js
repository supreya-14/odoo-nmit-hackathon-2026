const express = require('express');
const router = express.Router();
const {
  getMyPerformance,
  getEmployeePerformance,
  createPerformanceRecord,
  updatePerformanceRecord,
  getAIInsights,
} = require('../controllers/performanceController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/my', protect, getMyPerformance);
router.post('/', protect, adminOnly, createPerformanceRecord);
router.get('/:employeeId', protect, adminOnly, getEmployeePerformance);
router.put('/:id', protect, adminOnly, updatePerformanceRecord);
router.post('/:employeeId/ai-insights', protect, adminOnly, getAIInsights);

module.exports = router;
