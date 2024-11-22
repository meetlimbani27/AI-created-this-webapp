const mongoose = require('mongoose');

const customButtonSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Button amount is required']
  },
  name: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const historyEntrySchema = new mongoose.Schema({
  operationType: {
    type: String,
    required: true,
    enum: ['increment', 'decrement', 'reset', 'custom']
  },
  amount: {
    type: Number,
    required: true
  },
  previousValue: {
    type: Number,
    required: true
  },
  newValue: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const counterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'My Counter'
  },
  description: {
    type: String,
    default: null
  },
  currentCount: {
    type: Number,
    default: 0
  },
  customButtons: [customButtonSchema],
  history: [historyEntrySchema],
  lastOperation: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to add history entry
counterSchema.methods.addHistoryEntry = function(operationType, amount, previousValue, newValue) {
  this.history.push({
    operationType,
    amount,
    previousValue,
    newValue
  });
  this.lastOperation = `${operationType}: ${amount}`;
};

// Method to update counter value
counterSchema.methods.updateCount = function(amount, operationType = 'custom') {
  const previousValue = this.currentCount;
  this.currentCount += amount;
  this.addHistoryEntry(operationType, amount, previousValue, this.currentCount);
};

// Method to reset counter
counterSchema.methods.reset = function() {
  const previousValue = this.currentCount;
  this.currentCount = 0;
  this.addHistoryEntry('reset', 0, previousValue, 0);
};

// Method to add custom button
counterSchema.methods.addCustomButton = function(amount, name = null) {
  this.customButtons.push({
    amount,
    name,
    order: this.customButtons.length
  });
};

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
