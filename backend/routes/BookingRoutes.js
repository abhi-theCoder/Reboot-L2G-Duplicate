const Booking = require('../models/Booking');
const authenticate = require('../middleware/authMiddleware');
const authenticateSuperAdmin = require('../middleware/authSuperadminMiddleware');
const express = require('express');
const router = express.Router();

// const createBooking = async (req, res) => {
//     try {
//         const {
//             bookingID,
//             status,
//             bookingDate,
//             tour, // { tourId, name }
//             customer, // { name, email, phone, address }
//             travelers, // [{ name, age, gender }]
//             agent, // { agentId, name } or null
//             // Payment details are handled separately by generate-payment-link,
//             // so they are not expected on initial booking creation POST,
//             // and thus are optional in the schema.
//         } = req.body;

//         console.log("req.body:",req.body);
//         // Basic validation (more comprehensive validation via Zod is on frontend,
//         // but backend should always have its own validation)

//         console.log(req.user.id);
//         if (!bookingID || !tour || !tour.tourId || !tour.name || !customer || !customer.name || !customer.email || !req.user.id || !travelers || !Array.isArray(travelers) || travelers.length === 0) {
//             return res.status(400).json({ error: 'Missing required booking fields.' });
//         }

//         // Validate individual travelers if they have required fields
//         for (const traveler of travelers) {
//             if (!traveler.name || typeof traveler.age === 'undefined' || !traveler.gender) {
//                 return res.status(400).json({ error: 'All travelers must have a name, age, and gender.' });
//             }
//         }

//         customer.id = req.user.id;
//         // Create a new booking instance
//         const newBooking = new Booking({
//             bookingID,
//             status: status || 'pending', // Use provided status or default to 'pending'
//             bookingDate: bookingDate || new Date(), // Use provided date or default to now
//             tour,
//             customer,
//             travelers,
//             agent,
//             payment: {
//                 totalAmount: 0, // Default or leave undefined based on schema's required: false
//                 paidAmount: 0,
//                 paymentStatus: 'Pending',
//             }
//         });

//         const savedBooking = await newBooking.save();

//         res.status(201).json(savedBooking); 
//         console.log("Successfully saved booking data, payment is pending!!");
//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(409).json({ error: 'Booking with this ID already exists.', details: error.message });
//         }
//         console.error('Error creating booking:', error);
//         res.status(500).json({ error: 'Failed to create booking', details: error.message });
//     }
// };

const createBooking = async (req, res) => {
  try {
    const {
      bookingID,
      status,
      bookingDate,
      tour, // { tourId, name }
      customer, // { name, email, phone, address }
      travelers, // [{ name, age, gender }]
      agent, // { agentId, name } or null
    } = req.body;

    if (
      !bookingID ||
      !tour ||
      !tour.tourId ||
      !tour.name ||
      !customer ||
      !customer.name ||
      !customer.email ||
      !req.user ||
      !req.user.id ||
      !travelers ||
      !Array.isArray(travelers) ||
      travelers.length === 0
    ) {
      return res.status(400).json({ error: 'Missing required booking fields.' });
    }

    // Validate individual travelers
    for (const traveler of travelers) {
      if (!traveler.name || typeof traveler.age === 'undefined' || !traveler.gender) {
        return res.status(400).json({ error: 'All travelers must have a name, age, and gender.' });
      }
    }

    customer.id = req.user.id;

    // Check if booking exists for this user and tour
    const existingBooking = await Booking.findOne({
      'customer.id': customer.id,
      'tour.tourId': tour.tourId,
    });

    if (existingBooking) {
      // Update the existing booking
      existingBooking.bookingID = bookingID; // You can update bookingID or skip if you want it immutable
      existingBooking.status = status || existingBooking.status;
      existingBooking.bookingDate = bookingDate || existingBooking.bookingDate;
      existingBooking.tour = tour;
      existingBooking.customer = customer;
      existingBooking.travelers = travelers;
      existingBooking.agent = agent;

      const updatedBooking = await existingBooking.save();
      console.log("Updated booking data:",req.body);
      return res.status(200).json(updatedBooking);
    } else {
      // Create a new booking
      const newBooking = new Booking({
        bookingID,
        status: status || 'pending',
        bookingDate: bookingDate || new Date(),
        tour,
        customer,
        travelers,
        agent,
        payment: {
          totalAmount: 0,
          paidAmount: 0,
          paymentStatus: 'Pending',
        },
      });

      const savedBooking = await newBooking.save();
      console.log("Submitted a new booking data:",req.body);
      return res.status(201).json(savedBooking);
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Booking with this ID already exists.', details: error.message });
    }
    console.error('Error creating or updating booking:', error);
    return res.status(500).json({ error: 'Failed to create or update booking', details: error.message });
  }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
    }
};

router.get('/my-bookings/:tourID', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // MongoDB ObjectId of the logged-in user
    const {tourID} = req.params;
    const bookings = await Booking.find({ 'customer.id': userId ,'tour.tourId': tourID });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});


router.post('/', authenticate, createBooking);
router.get('/', authenticate, getBookings);

module.exports = router;