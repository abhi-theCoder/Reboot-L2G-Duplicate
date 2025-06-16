const jwt = require('jsonwebtoken');

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

module.exports = authenticateSuperAdmin;