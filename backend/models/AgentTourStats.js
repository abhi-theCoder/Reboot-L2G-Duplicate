const mongoose = require('mongoose');

const agentTourStatsSchema = new mongoose.Schema({
  tourID: String,
  agentID: String,
  tourStartDate: String,
  customerGiven: { type: Number, default: 0 },
  finalAmount: { type: Number, default: 0 },
  commissionReceived: { type: Number, default: 0 },
});

module.exports = mongoose.model('AgentTourStats', agentTourStatsSchema);
