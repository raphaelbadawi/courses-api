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
  // Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
});
