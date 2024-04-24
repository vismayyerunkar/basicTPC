import jwt from "jsonwebtoken"
const JWT_SECRET = 'samplesec12';

export const checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' });
    }
  
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
  
      if (!decodedToken) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      req.email = decodedToken.email;
      req.isAdmin = decodedToken.isAdmin;
      req.userId = decodedToken.id
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
};