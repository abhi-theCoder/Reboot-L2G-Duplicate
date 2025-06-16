// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingID: {
        type: String,
        required: true,
        unique: true,
        description: "Unique Booking ID, e.g., 'BKG12345'"
    },
    status: {
        type: String,
        required: true,
        enum: ['confirmed', 'pending', 'cancelled', 'completed'],
        default: 'pending', // Adjusted default to 'pending' as per frontend flow
        description: "Status of the booking"
    },
    bookingDate: {
        type: Date,
        required: true,
        default: Date.now,
        description: "Date and time the booking was made"
    },
    tour: {
        tourId: {
            type: String,
            required: true,
            description: "ID of the booked tour"
        },
        name: { // Added tour name as per discussion, required
            type: String,
            required: true,
            description: "Name of the booked tour"
        }
    },
    customer: {
        id:{ type: mongoose.Schema.Types.ObjectId , required: true},
        name: {
            type: String,
            required: true,
            description: "Full name of the customer"
        },
        email: {
            type: String,
            required: true,
            description: "Email address of the customer"
        },
        phone: {
            type: String,
            description: "Phone number of the customer"
        },
        address: {
            type: String,
            description: "Full address of the customer"
        },
        altPhone: String,
        dob: String,
        age: String,
        gender: String,
        aadhar: String,
        pan: String,
        whatsapp: String,
        disability: String,
        medicalCondition: String,
        medicalInsurance: String,
    },
    travelers: [ // This array stores all individuals (adults and children) travelling
        {
            name: { type: String, required: true },
            age: { type: Number, required: true }, // Age should be required for a traveler
            gender: { type: String, enum: ['male', 'female', 'other'], required: true }, // Gender should be required for a traveler
            // ID details are part of travelers on the frontend, but not in this schema for individual travelers.
            // If you need to store them per traveler in the backend, add:
            idType: { type: String },
            idNumber: { type: String },
        }
    ],
    payment: {
        totalAmount: {
            type: Number,
            required: false, // Made optional for initial booking creation
            description: "Total amount of the booking"
        },
        paidAmount: {
            type: Number,
            required: false, // Made optional for initial booking creation
            description: "Amount already paid by the customer"
        },
        paymentStatus: {
            type: String,
            required: false, // Made optional for initial booking creation
            enum: ['Paid', 'Pending', 'Refunded', 'Failed'],
            // default: 'paid', // Removed default here as status is 'pending' initially
            description: "Status of the payment"
        },
        paymentMethod: {
            type: String,
            required: false, // Made optional for initial booking creation
            description: "Method used for payment (e.g., Credit Card, Bank Transfer)"
        },
        transactionId: {
            type: String,
            required: false, // Made optional for initial booking creation
            description: "Unique transaction ID from the payment gateway"
        },
        paymentDate: {
            type: Date,
            required: false, // Made optional for initial booking creation
            description: "Date and time of the payment"
        },
        breakdown: [
            {
                item: { type: String, required: false }, // Made optional if not sent on initial save
                amount: { type: Number, required: false } // Made optional if not sent on initial save
            }
        ]
    },
    agent: {
        agentId: {
            type: String,
            description: "ID of the booking agent"
        },
        name: {
            type: String,
            description: "Name of the booking agent/agency"
        },
        commission: { // This field is not sent by frontend's saveBooking
            type: Number,
            description: "Commission amount for the agent"
        }
    }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields automatically

module.exports = mongoose.model('Booking', bookingSchema);