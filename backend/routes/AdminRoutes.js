const express = require('express');
const bcrypt = require('bcrypt');
const Agent = require('../models/Agent'); 
const Transaction = require('../models/Transaction');
const Superadmin = require('../models/Superadmin');
const Tour = require('../models/Tour');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer(); // Memory storage if you're using base64 directly

const authenticateSuperAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'superadmin') {
          return res.status(403).json({ error: 'Access denied: Not SuperAdmin' });
      }
      req.user = decoded;
      next();
  } catch (error) {
    console.error("SuperAdmin Auth Error:", error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
}
};

router.get('/profile', authenticateSuperAdmin, async (req, res) => {
  // console.log("Admin profile route hit");
    try {
        const superadmin = await Superadmin.findById(req.user.id);
        // console.log(superadmin);

        if (!superadmin) {
            return res.status(404).json({ error: 'superadmin not found' });
        }
        // console.log(superadmin);
        res.json(superadmin);
    } catch (error) {
        console.error("Error fetching profile: ", error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

router.put('/profile', authenticateSuperAdmin, upload.single('photo'), async (req, res) => {
  try {
    const superadminId = req.user.id;

    const superadmin = await Superadmin.findById(superadminId);
    if (!superadmin) {
      return res.status(404).json({ error: "superadmin not found" });
    }

    let updateData = {};
    if (req.body.updateData) {
      updateData = JSON.parse(req.body.updateData);
    }

    const { name, password } = updateData;

    if (name) superadmin.name = name;

    if (password && password.trim() !== '') {
      superadmin.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      superadmin.photo = `data:image/png;base64,${base64Image}`;
    }

    await superadmin.save();
    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Error updating profile: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/find-user', authenticateSuperAdmin, async (req, res) => {
  const { identifier } = req.body;
  // console.log(identifier);
  const agent = await Agent.findOne({
    $or: [{ email: identifier }, { phone_calling: identifier }]
  });

  if (agent) return res.json({ success: true });
  res.json({ success: false });
});

router.get('/all-users', authenticateSuperAdmin, async(req,res)=>{
  try{
    const agents = await Agent.find();
    res.json({agents});
  }
  catch(error){
    console.error("Error fetching all users : ", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
})

router.get('/inactive-count',authenticateSuperAdmin, async (req, res) => {
  try {
    const count = await Agent.countDocuments({ status: 'inactive' });
    res.json({ count });
  } catch (err) {
    console.error("Error:",err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

router.post('/update-status', authenticateSuperAdmin, async (req, res) => {
  const { userId, status } = req.body;
  try {
    await Agent.findByIdAndUpdate(userId, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.post('/agent/:id/remarks', authenticateSuperAdmin, async (req, res) => {
  const { id } = req.params;

  // console.log(req.params);
  // console.log(req.body);
  const { remarks } = req.body; 

  try {
    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    agent.remarks = remarks;

    await agent.save();

    res.status(200).json({ message: 'Remarks updated successfully', agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// router.get('/security-key', authenticateSuperAdmin, (req, res) => {
//   try {
//     if (req.header('role') !== 'superadmin') {
//       return res.status(403).json({ error: 'Access denied' });
//     }
//     const securityKey = process.env.SUPERADMIN_SECURITY_KEY;

//     if (!securityKey) {
//       return res.status(500).json({ error: 'Security key not set in environment!' });
//     }

//     res.json({ securityKey });
//   } catch (error) {
//     console.error('Error getting SuperAdmin security key:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// router.put('/security-key', authenticateSuperAdmin, async (req, res) => {
//   try {
//     if (req.header('role') !== 'superadmin') {
//       return res.status(403).json({ error: 'Access denied' });
//     }

//     const { newKey } = req.body;
//     if (!newKey) {
//       return res.status(400).json({ error: 'New key is required' });
//     }
//     process.env.SUPERADMIN_SECURITY_KEY = newKey;
//     res.json({ message: 'Security key updated successfully!' });
//   } catch (error) {
//     console.log("Error occured while updating security key",error);
//     res.status(500).json({ error: 'Internal Server error occured while updating security key' });
//   }
// });

router.post('/tours', authenticateSuperAdmin, upload.single('image'), async (req, res) => {
  try {
    const { categoryType, packageData } = req.body;

    if (!categoryType || !packageData) {
      return res.status(400).json({ message: 'Missing data' });
    }

    const parsedPackage = JSON.parse(packageData); 

    const tour = await Tour.create({
      categoryType: categoryType,
      packages: [{
        name: parsedPackage.name,
        country: parsedPackage.country,
        pricePerHead: parsedPackage.pricePerHead,
        duration: parsedPackage.duration,
        startDate: parsedPackage.startDate,
        tourType: parsedPackage.tourType,
        occupancy : parsedPackage.occupancy,
        description: parsedPackage.description,
        image: req.file ? req.file.buffer.toString('base64') : null,
      }]
    });

    res.status(201).json({ message: 'Tour created', tour });
  } catch (err) {
    console.error('Error adding tour:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/tours', authenticateSuperAdmin, async (req, res) => {
  try {
    const tourDocs = await Tour.find();

    const formattedTours = tourDocs.flatMap((tourDoc) =>
      tourDoc.packages.map((pkg) => ({
        tourID: tourDoc._id,
        name: pkg.name,
        country: pkg.country,
        pricePerHead: pkg.pricePerHead,
        duration: pkg.duration,
        startDate: pkg.startDate,
        description: pkg.description,
        remainingOccupancy: pkg.remainingOccupancy,
        occupancy: pkg.occupancy,
        image: pkg.image ? `data:image/jpeg;base64,${pkg.image}` : null,
        categoryType: tourDoc.categoryType,
      }))
    );

    res.json({ tours: formattedTours });
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ message: 'Server error while fetching tours', error });
  }
});

router.get('/pending-cancellations', authenticateSuperAdmin, async (req, res) => {
  try {
    const pending = await Transaction.find({ 
      cancellationRequested: true, 
      cancellationApproved: false, 
      cancellationRejected: false 
    });
    
    return res.json({ pending });
  } catch (error) {
    console.error("Error fetching pending cancellations:", error);
    return res.status(500).json({ error: "Failed to fetch pending cancellations." });
  }
});

router.put('/approve-cancellation/:transactionId', authenticateSuperAdmin, async (req, res) => {
  // if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Forbidden' });

  const { transactionId } = req.params;
  const { deductionPercentage } = req.body;

  const transaction = await Transaction.findOne({ transactionId });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

  if (transaction.cancellationApproved || transaction.cancellationRejected) {
    return res.status(400).json({ message: 'Already processed' });
  }
  const totalPriceTour = transaction.tourGivenOccupancy * transaction.tourPricePerHead;
  const refundAmount = totalPriceTour * ((100 - deductionPercentage) / 100);
  transaction.cancellationApproved = true;
  transaction.refundAmount = refundAmount;
  transaction.deductionPercentage = deductionPercentage;

  const tour = await Tour.findById(transaction.tourID);
  const pkg = tour?.packages[0];
  if (pkg) {
    pkg.remainingOccupancy += transaction.tourGivenOccupancy;
    await tour.save();
  }

  await transaction.save();

  // TODO: Add refund payment processing logic here (e.g., Razorpay refund or wallet credit)

  res.status(200).json({ message: 'Cancellation approved and refund processed', refundAmount });
});

router.put('/reject-cancellation/:transactionId', authenticateSuperAdmin, async (req, res) => {
  // if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Forbidden' });

  const { transactionId } = req.params;
  const transaction = await Transaction.findOne({ transactionId });

  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

  transaction.cancellationRejected = true;
  await transaction.save();

  res.status(200).json({ message: 'Cancellation request rejected' });
});

router.get('/:id', authenticateSuperAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const agent = await Agent.findById(id).lean();
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    res.json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});