const jwt = require('jsonwebtoken');

module.exports = (requiredRole = 'admin') => {
  return (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check role if required
      if (requiredRole === 'admin' && decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      // Add user to request object
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};