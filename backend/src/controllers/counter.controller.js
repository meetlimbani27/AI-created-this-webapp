const Counter = require('../models/counter.model');

// @desc    Create counter
// @route   POST /api/counters
// @access  Private
const createCounter = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const counter = await Counter.create({
      user: req.user._id,
      name,
      description
    });

    res.status(201).json({
      success: true,
      data: counter
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all counters for a user
// @route   GET /api/counters
// @access  Private
const getCounters = async (req, res) => {
  try {
    const counters = await Counter.find({ user: req.user._id });
    
    res.json({
      success: true,
      data: counters
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single counter
// @route   GET /api/counters/:id
// @access  Private
const getCounter = async (req, res) => {
  try {
    const counter = await Counter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!counter) {
      return res.status(404).json({
        success: false,
        error: 'Counter not found'
      });
    }

    res.json({
      success: true,
      data: counter
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update counter value
// @route   PUT /api/counters/:id/value
// @access  Private
const updateCounterValue = async (req, res) => {
  try {
    const counter = await Counter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!counter) {
      return res.status(404).json({
        success: false,
        error: 'Counter not found'
      });
    }

    const { amount, operationType } = req.body;
    counter.updateCount(Number(amount), operationType);
    await counter.save();

    res.json({
      success: true,
      data: counter
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Reset counter
// @route   PUT /api/counters/:id/reset
// @access  Private
const resetCounter = async (req, res) => {
  try {
    const counter = await Counter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!counter) {
      return res.status(404).json({
        success: false,
        error: 'Counter not found'
      });
    }

    counter.reset();
    await counter.save();

    res.json({
      success: true,
      data: counter
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add custom button
// @route   POST /api/counters/:id/buttons
// @access  Private
const addCustomButton = async (req, res) => {
  try {
    const counter = await Counter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!counter) {
      return res.status(404).json({
        success: false,
        error: 'Counter not found'
      });
    }

    const { amount, name } = req.body;
    counter.addCustomButton(Number(amount), name);
    await counter.save();

    res.json({
      success: true,
      data: counter
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete custom button
// @route   DELETE /api/counters/:id/buttons/:buttonId
// @access  Private
const deleteCustomButton = async (req, res) => {
  try {
    const counter = await Counter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!counter) {
      return res.status(404).json({
        success: false,
        error: 'Counter not found'
      });
    }

    const buttonIndex = counter.customButtons.findIndex(
      button => button._id.toString() === req.params.buttonId
    );

    if (buttonIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Button not found'
      });
    }

    counter.customButtons.splice(buttonIndex, 1);
    await counter.save();

    res.json({
      success: true,
      data: counter
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createCounter,
  getCounters,
  getCounter,
  updateCounterValue,
  resetCounter,
  addCustomButton,
  deleteCustomButton
};
