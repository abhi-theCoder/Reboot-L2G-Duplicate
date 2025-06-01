const mongoose = require('mongoose');
require('dotenv').config();
const Agent = require('../models/Agent');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
mongoose.connect('mongodb+srv://abhishekkumarmahto2005:PmYyWbh3hjbs5f7H@cluster0.pcr8b.mongodb.net/agentDB?retryWrites=true&w=majority&appName=Cluster0')
  .then(async() => {
    console.log('MongoDB Connected');

    const agentID = "032-2025-000A";
    let agent = await Agent.findOne({ agentID: agentID });
    const agent_id = agent._id;
    const tourPrice = 90000; 
    tourActualOccupancy=50,
    tourGivenOccupancy=15,
    percentageOnboarded = (tourGivenOccupancy/tourActualOccupancy)*100 ;
    console.log(percentageOnboarded);
    transferCommission(agent_id, tourPrice, percentageOnboarded);
  })
  .catch(err => console.error(err));


  function getCommissionRate(percentageOnboarded, level) {
    if (percentageOnboarded >= 65) {
      return level === 1 ? 10 : 5;
    } else if (percentageOnboarded >= 45) {
      return level === 1 ? 8.5 : 3.5;
    } else {
      return level === 1 ? 7 : 2.5;
    }
  }

  
  const transferCommission = async (agent_id, amount, percentageOnboarded, level = 1) => {
    try {
      const agent = await Agent.findById(agent_id);
      if (!agent) throw new Error("Agent not found: " + agent_id);
  
      const commissionRate = getCommissionRate(percentageOnboarded, level);
      const commission = (amount * commissionRate) / 100;
  
      agent.walletBalance += commission;
      // await agent.save();
  
      console.log(`Level ${level}: ₹${commission} (${commissionRate}%) to ${agent.agentID} (${agent.name})`);
  
      if (level === 1 && agent.parentAgent) {
        const remainingAmount = amount - commission;
        await transferCommission(agent.parentAgent, remainingAmount, percentageOnboarded, level + 1);
      }
    } catch (error) {
      console.error("Error transferring commission:", error.message);
    }
  };



dayjs.extend(customParseFormat);

const tourStartDate = "20%252F08%252F2025";
const rawDate = decodeURIComponent(decodeURIComponent(tourStartDate)); // "20/08/2025"
const formattedDate = dayjs(rawDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

console.log(formattedDate);  // Output: "2025-08-20"
