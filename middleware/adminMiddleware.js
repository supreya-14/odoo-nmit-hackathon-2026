// Only allows ADMIN or HR roles through. Must run after protect().
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'HR')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin/HR only.' });
  }
};

module.exports = { adminOnly };
