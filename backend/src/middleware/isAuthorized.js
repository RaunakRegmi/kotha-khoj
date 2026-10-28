// use after isAuthenticated
// isAuthorized("admin") => only admin can go to next
let isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "You are not allowed to do this.",
      });
    }
  };
};

export default isAuthorized;
