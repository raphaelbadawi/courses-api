const Bootcamp = require('../models/Bootcamp');
const ErrorReponse = require('../utils/errorReponse');
const asyncHandler = require('../middleware/async');

// Get all bootcamps
// GET /api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// Get a single bootcamp
// GET /api/v1/bootcamps/:id
// Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return new ErrorReponse(
      `Resource with id of ${req.params.id} not found`,
      404
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// Create a new bootcamp
// POST /api/v1/bootcamps
// Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

// Update a bootcamp
// PUT /api/v1/bootcamps/:id
// Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return new ErrorReponse(
      `Resource with id of ${req.params.id} not found`,
      404
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

// Delete a bootcamp
// DELETE /api/v1/bootcamps/:id
// Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return new ErrorReponse(
      `Resource with id of ${req.params.id} not found`,
      404
    );
  }
  res.status(200).json({
    success: true,
    data: {}
  });
});
