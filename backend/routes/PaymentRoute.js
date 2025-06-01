const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/', async (req, res) => {
  try {
    const { tourID, agentID, tourName, tourPricePerHead, tourActualOccupancy, tourGivenOccupancy, tourStartDate } = req.body;
    // console.log(tourStartDate)
    // console.log(tourPricePerHead * tourGivenOccupancy * 100)
    // console.log(tourID)
    const response = await razorpay.paymentLink.create({
      amount: tourPricePerHead * tourGivenOccupancy * 100,// in paise
      currency: 'INR',
      description: `Booking for ${tourName}`,
      customer: {
        name: `Agent ${agentID}`,
        contact: req.body.contact || '9111111111', // dummy fallback
        email: req.body.email || 'no-reply@example.com'
      },      
      notes: {
        tourID,
        agentID,
        tourName,
        tourPricePerHead,
        tourActualOccupancy,
        tourGivenOccupancy,
        tourStartDate
      },
      callback_url: 'https://frontend-agent-management-system.onrender.com/thank-you',
      callback_method: 'get'
    });

    res.status(200).json({ url: response.short_url });
  } catch (error) {
    console.error('Error generating Razorpay link:', error);
    const description = error?.error?.description || 'Failed to generate Razorpay link';
    res.status(500).json({ error: description });
  }
});

module.exports = router;