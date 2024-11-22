const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createCounter,
  getCounters,
  getCounter,
  updateCounterValue,
  resetCounter,
  addCustomButton,
  deleteCustomButton
} = require('../controllers/counter.controller');

// All routes are protected
router.use(protect);

router.route('/')
  .post(createCounter)
  .get(getCounters);

router.route('/:id')
  .get(getCounter);

router.route('/:id/value')
  .put(updateCounterValue);

router.route('/:id/reset')
  .put(resetCounter);

router.route('/:id/buttons')
  .post(addCustomButton);

router.route('/:id/buttons/:buttonId')
  .delete(deleteCustomButton);

module.exports = router;
