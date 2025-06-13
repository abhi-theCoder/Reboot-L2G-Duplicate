const express = require('express');
const crypto = require('crypto');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const Agent = require('../models/Agent'); 
const AgentTourStats = require('../models/AgentTourStats');
const Tours = require('../models/Tour');
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

dayjs.extend(customParseFormat);

// --- Custom parsing function for Razorpay's 'map' string format ---
// This function parses a string like "map[key1:value1 key2:value2]" into a JS object.
function parseRazorpayMapString(mapString) {
  if (typeof mapString !== 'string' || !mapString.startsWith('map[') || !mapString.endsWith(']')) {
    console.warn("Invalid map string format received:", mapString);
    return {}; 
  }
  const content = mapString.substring(4, mapString.length - 1); // Remove "map[" and "]"

  // This regex handles key:value pairs. It tries to capture value until a space or end of string.
  // It's a bit simplified; real-world values with spaces might break it without quotes.
  // Given your log, values seem to be single words or paths.
  const pairs = content.match(/(\w+):([^\s]+)/g); // Matches "key:value" for single-word values

  const result = {};
  if (pairs) {
    pairs.forEach(pair => {
      const parts = pair.split(':', 2); // Split only on the first colon
      if (parts.length === 2) {
        const key = parts[0];
        const value = parts[1];
        // Attempt to convert to number if it looks like one, otherwise keep as string
        result[key] = isNaN(Number(value)) ? value : Number(value);
      }
    });
  }
  return result;
}

// --- Custom parsing function for Razorpay's array of 'map' strings ---
// This function parses a string like "[map[...] map[...]]" into an array of JS objects.
function parseRazorpayTravelersString(travelersString) {
    if (typeof travelersString !== 'string') {
        console.warn("Travelers string is not a string:", travelersString);
        return [];
    }
    
    // Remove outer brackets if present, e.g., "[map[...]]" -> "map[...] map[...]"
    let content = travelersString;
    if (content.startsWith('[') && content.endsWith(']')) {
        content = content.substring(1, content.length - 1);
    }
    
    // Split by "map[" to get individual map strings, then add "map[" back to each part
    const mapStrings = content.split(' map[').filter(Boolean).map(s => 'map[' + s);
    
    const parsedTravelers = [];
    mapStrings.forEach(ms => {
        try {
            const traveler = parseRazorpayMapString(ms); // Use the single map string parser
            if (traveler) {
                // Ensure age is a number and gender is processed for Mongoose enum
                traveler.age = parseInt(traveler.age) || 0; 
                let gender = String(traveler.gender || 'unknown').toLowerCase();
                if (gender === 'm') gender = 'male';
                if (gender === 'f') gender = 'female';
                const validGenders = ['male', 'female', 'other'];
                traveler.gender = validGenders.includes(gender) ? gender : 'unknown';

                parsedTravelers.push(traveler);
            }
        } catch (e) {
            console.error("Error parsing individual traveler map string:", ms, e);
        }
    });
    return parsedTravelers;
}


function getCommissionRate(percentageOnboarded, level) {
  if (percentageOnboarded >= 65) {
    return level === 1 ? 10 : 5;
  } else if (percentageOnboarded >= 45) {
    return level === 1 ? 8.5 : 3.5;
  } else {
    return level === 1 ? 7 : 2.5;
  }
}

const transferCommission = async (agent_id, amount, updatedPercentage, commissionDelta, level, commissionRecords, tourID) => {
  try {
    const agent = await Agent.findById(agent_id);
    if (!agent) throw new Error("Agent not found");

    const rate = getCommissionRate(updatedPercentage, level);
    const commission = commissionDelta;

    commissionRecords.push({
      tourID,
      agentID: agent.agentID,
      level,
      commissionAmount: commission,
      commissionRate: rate,
    });

    if (level === 1 && agent.parentAgent) {
      const parentCommissionRate = getCommissionRate(updatedPercentage, level + 1);
      const parentCommission = (amount * parentCommissionRate) / 100;

      const parent = await Agent.findById(agent.parentAgent);
      if (parent) {
        // No direct wallet update here, it happens later in the main route
        commissionRecords.push({
          tourID,
          agentID: parent.agentID,
          level: level + 1,
          commissionAmount: parentCommission,
          commissionRate: parentCommissionRate,
        });
      }
    }
  } catch (error) {
    console.error('Error in commission transfer:', error.message);
  }
};


// --- REMOVED express.json() MIDDLEWARE FROM HERE ---
// It's handled by bodyParser.json() in index.js for '/webhook' route
router.post('/', async (req, res) => {
  console.log("webhook hit");
  const razorpaySignature = req.headers['x-razorpay-signature'];
  const payload = req.rawBody; // This is set by index.js's bodyParser.json()

  // IMPORTANT: payload.toString() is used here because crypto.createHmac().update() expects a string or Buffer.
  // req.rawBody is already a string from index.js, so payload is fine.
  console.log("Raw Webhook Payload for verification:", payload); 

  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  if (razorpaySignature !== expectedSignature) {
    console.error('Invalid Razorpay webhook signature');
    return res.sendStatus(400);
  }

  const event = req.body; // This is the already parsed JavaScript object from index.js's middleware
  console.log("Parsed Webhook Event (req.body):", JSON.stringify(event, null, 2));


  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;

    let tourID, agentID, tourPricePerHead, tourActualOccupancy, tourGivenOccupancy,
        tourStartDate, GST, finalAmount, customerNotesRaw, travelersNotesRaw, tourName; 

    if (payment && payment.notes) {
        ({
            tourID,
            agentID,
            tourPricePerHead,
            tourActualOccupancy,
            tourGivenOccupancy,
            tourStartDate,
            GST,
            finalAmount,
            customer: customerNotesRaw, // This will be the "map[...]" string
            travelers: travelersNotesRaw, // This will be the "[map[...]]" string
            tourName 
        } = payment.notes);
    }

    // --- CRITICAL CHANGE: Parse the map[...] strings ---
    let customerData = {};
    if (customerNotesRaw) {
      try {
        customerData = parseRazorpayMapString(customerNotesRaw);
        customerData.name = customerData.name || 'N/A';
        customerData.email = customerData.email || 'unknown@example.com';
        customerData.phone = customerData.phone || 'N/A';
        customerData.address = customerData.address || 'Not provided';
      } catch (e) {
        console.error("Error parsing customerNotesRaw:", customerNotesRaw, e);
        customerData = { name: 'N/A', email: 'unknown@example.com', phone: 'N/A', address: 'Not provided' };
      }
    } else {
        customerData = { name: 'N/A', email: 'unknown@example.com', phone: 'N/A', address: 'Not provided' };
    }
    
    let processedTravelers = [];
    if (travelersNotesRaw) {
        try {
            processedTravelers = parseRazorpayTravelersString(travelersNotesRaw);
        } catch (e) {
            console.error("Error parsing travelersNotesRaw:", travelersNotesRaw, e);
            // Fallback for parsing errors: use customer as a single traveler
            processedTravelers = [{ name: customerData.name, age: 0, gender: 'unknown' }];
        }
    } else {
        // Fallback if travelersNotesRaw is empty or null
        processedTravelers = [{ name: customerData.name, age: 0, gender: 'unknown' }];
    }
    // Ensure at least one traveler if none were parsed or fell back, and it's missing
    if (processedTravelers.length === 0) {
        processedTravelers.push({
            name: customerData.name,
            age: 0,
            gender: 'unknown'
        });
    }

    console.log("Webhook received notes customer (parsed object):", customerData);
    console.log("Webhook received notes travelers (parsed array):", processedTravelers);
    console.log("Webhook received notes tourName:", tourName); 


    if (!payment || !payment.notes || !tourID || typeof finalAmount === 'undefined' || !customerData || !processedTravelers || typeof payment.amount === 'undefined' || typeof payment.created_at === 'undefined') {
        console.error('Missing or invalid critical payment data in Razorpay payload or notes. Details:', {
            paymentNotes: payment.notes,
            paymentAmount: payment.amount,
            paymentCreatedAt: payment.created_at,
            tourID,
            finalAmount,
            customerData, 
            processedTravelers
        });
        return res.status(400).json({ error: "Missing or invalid critical payment data from Razorpay." });
    }

    const transactionId = payment.id;
    const paymentMethod = payment.method;

    const parsedTourPricePerHead = parseFloat(tourPricePerHead);
    const parsedTourActualOccupancy = parseFloat(tourActualOccupancy);
    const parsedTourGivenOccupancy = parseFloat(tourGivenOccupancy);
    const parsedGST = parseFloat(GST);
    const parsedFinalAmount = parseFloat(finalAmount);
    const paidAmountValue = parseFloat(payment.amount) / 100;

    if (isNaN(parsedTourPricePerHead) || isNaN(parsedTourActualOccupancy) || isNaN(parsedTourGivenOccupancy) || isNaN(parsedGST) || isNaN(parsedFinalAmount) || isNaN(paidAmountValue)) {
        console.error('Invalid numeric data in payment notes or Razorpay payload. Details:', {
            tourPricePerHead, tourActualOccupancy, tourGivenOccupancy, GST, finalAmount, paymentAmount: payment.amount
        });
        return res.status(400).json({ error: "Invalid numeric data in payment notes." });
    }

    const paymentDateValue = new Date(payment.created_at * 1000);
    if (isNaN(paymentDateValue.getTime())) {
        console.error('Invalid payment date timestamp from Razorpay:', payment.created_at);
        return res.status(400).json({ error: "Invalid payment creation timestamp." });
    }

    const formattedDate = dayjs(tourStartDate).format('YYYY-MM-DD');


    const bookingId = `BKG-${Date.now()}`;

    const commonBookingData = {
        bookingID: bookingId,
        status: 'confirmed',
        bookingDate: new Date(),
        tour: {
            tourId: tourID,
        },
        customer: customerData, 
        travelers: processedTravelers,
        payment: {
            totalAmount: parsedFinalAmount,
            paidAmount: paidAmountValue,
            paymentStatus: 'Paid',
            paymentMethod: paymentMethod,
            transactionId: transactionId,
            paymentDate: paymentDateValue,
            breakdown: [
                { item: `Base Price (${parsedTourGivenOccupancy} pax)`, amount: parsedTourPricePerHead * parsedTourGivenOccupancy },
                { item: 'GST', amount: parsedGST }
            ]
        }
    };

    try {
      if (!agentID || agentID === '') {
        const newBooking = new Booking(commonBookingData);
        await newBooking.save();
        console.log("Direct customer booking saved successfully:", bookingId);

        const commissionRecords = [];
        
        const newTransaction = new Transaction({
          tourID,
          agentID: null, 
          customerEmail: customerData.email, // Use parsed customerData
          transactionId,
          tourPricePerHead: parsedTourPricePerHead,
          tourActualOccupancy: parsedTourActualOccupancy,
          tourGivenOccupancy: parsedTourGivenOccupancy,
          tourStartDate: formattedDate,
          commissions: commissionRecords,
          finalAmount: parsedFinalAmount 
        });

        console.log("Direct transaction through customer saved successfully. No agent involved")
        await newTransaction.save();

        const tour = await Tours.findById(tourID);
        if (!tour) {  
          console.warn(`Tour with ID ${tourID} not found for occupancy update during direct booking.`);
        } else {
          tour.remainingOccupancy -= parsedTourGivenOccupancy;
          if (tour.remainingOccupancy < 0) {
            tour.remainingOccupancy = 0;
          }
          await tour.save();
          console.log(`Tour ${tourID} remaining occupancy updated to ${tour.remainingOccupancy}`);
        }

        return res.status(200).json({ received: true, bookingId: bookingId });

      } else {
        const agent = await Agent.findOne({ agentID });
        if (!agent) {
          console.error(`Agent with ID ${agentID} not found.`);
          return res.status(404).json({ error: 'Agent not found' });
        }

        const agent_id = agent._id;
        const statsKey = { agentID, tourStartDate: formattedDate, tourID };

        let stats = await AgentTourStats.findOne(statsKey);
        if (!stats) {
          stats = new AgentTourStats(statsKey);
        }

        const givenCustomerCount = parsedTourGivenOccupancy;
        const addedAmount = givenCustomerCount * parsedTourPricePerHead;
        const newCustomerGiven = stats.customerGiven + givenCustomerCount;
        const updatedPercentage = (newCustomerGiven / parsedTourActualOccupancy) * 100;

        const newTotalAmountForStats = stats.totalAmount + addedAmount; 
        const level = 1;
        const newCommissionRate = getCommissionRate(updatedPercentage, level);
        const newTotalEligibleCommission = (newTotalAmountForStats * newCommissionRate) / 100;
        const commissionDelta = newTotalEligibleCommission - stats.commissionReceived;

        const commissionRecords = [];

        if (commissionDelta > 0) {
          await transferCommission(agent_id, newTotalAmountForStats, updatedPercentage, commissionDelta, level, commissionRecords, tourID);
        }

        stats.customerGiven = newCustomerGiven;
        stats.totalAmount = newTotalAmountForStats; 
        stats.commissionReceived = newTotalEligibleCommission;
        await stats.save();

         const newBooking = new Booking({
            ...commonBookingData,
            agent: {
                agentId: agentID,
                name: agent.name,
                commission: commissionRecords.find(rec => rec.agentID === agentID)?.commissionAmount || 0
            }
        });
        await newBooking.save();
        console.log("Agent booking saved successfully:", bookingId);
        
        const newTransaction = new Transaction({
          tourID,
          agentID,
          customerEmail: customerData.email, // Use parsed customerData
          transactionId,
          tourPricePerHead: parsedTourPricePerHead,
          tourActualOccupancy: parsedTourActualOccupancy,
          tourGivenOccupancy: parsedTourGivenOccupancy,
          tourStartDate: formattedDate,
          commissions: commissionRecords,
          finalAmount: parsedFinalAmount
        });

        await newTransaction.save();
        console.log("Transaction saved successfully with commissions");

        const tour = await Tours.findById(tourID);
        if (!tour) {
          console.warn(`Tour with ID ${tourID} not found for occupancy update during agent booking.`);
        } else {
          tour.remainingOccupancy -= parsedTourGivenOccupancy;
          if (tour.remainingOccupancy < 0) {
            tour.remainingOccupancy = 0;
          }
        }
        await tour.save();
        console.log(`Tour ${tourID} remaining occupancy updated to ${tour.remainingOccupancy}`);

        for (const record of commissionRecords) {
          const agentToUpdate = await Agent.findOneAndUpdate(
            { agentID: record.agentID },
            { $inc: { walletBalance: record.commissionAmount } },
            { new: true }
          );
          if(agentToUpdate) {
            console.log(`Successfully added ${record.commissionAmount} to the wallet of ${agentToUpdate.agentID} (${agentToUpdate.name})`);
          } else {
            console.warn(`Agent ${record.agentID} not found for wallet update.`);
          }
        }
        res.status(200).json({ received: true, bookingId: bookingId });
      }
    } catch (err) {
      console.error('Error processing transaction:', err);
      if (err.name === 'ValidationError') {
          console.error('Mongoose Validation Error Details:', err.errors);
          return res.status(400).json({ error: 'Booking validation failed', details: err.errors });
      }
      res.status(500).json({ error: 'Internal server error during webhook processing', details: err.message });
    }
  } else {
    res.status(200).json({ message: 'Webhook received but event not handled' });
  }
});


module.exports = router;