const User = require('../models/User');
const ErrorReponse = require('../utils/errorReponse');
const asyncHandler = require('../middleware/async');

// Register user
// POST /api/v1/auth/register
// Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendTokenResponse(user, 200, res);
});

// Login user
// POST /api/v1/auth/login
// Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email & password
  if (!email || !password) {
    return next(new ErrorReponse('Please provide an email and password', 400));
  }
  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorReponse('Invalid credentials', 401));
  }
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorReponse('Invalid credentials', 401));
  }
  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  // Create cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

// Get current logged in user
// GET /api/v1/auth/me
// Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});
