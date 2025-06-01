// models/TourCategory.js
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({ 
    categoryType: { type: String, required: true },
    packages: [
      {
        name: { type: String, required: true },
        country: { type: String, required: true },
        pricePerHead: { type: Number, required: true },
        duration: { type: String, required: true },
        startDate: { type: Date, required: true },
        occupancy: { type: Number, required: true },
        remainingOccupancy: { type: Number, required: true },
        tourType: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: Buffer, required: true }, 
      },
    ]
  });
  

module.exports = mongoose.model("Tour", tourSchema);
