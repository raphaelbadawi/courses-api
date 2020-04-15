const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorReponse = require('../utils/errorReponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// Get all bootcamps
// GET /api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// Get a single bootcamp
// GET /api/v1/bootcamps/:id
// Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorReponse(`Resource with id of ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// Create a new bootcamp
// POST /api/v1/bootcamps
// Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  // If the user is not an admin, he can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// Update a bootcamp
// PUT /api/v1/bootcamps/:id
// Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorReponse(`Resource with id of ${req.params.id} not found`, 404)
    );
  }
  // Make sure the user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorReponse(
        `User ${req.user.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }
  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// Delete a bootcamp
// DELETE /api/v1/bootcamps/:id
// Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorReponse(`Resource with id of ${req.params.id} not found`, 404)
    );
  }
  // Make sure the user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorReponse(
        `User ${req.user.id} is not authorized to delete this bootcamp`,
        401
      )
    );
  }
  bootcamp.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

// Get bootcamps within a radius
// GET /api/v1/bootcamps/radius/:zipcode/:distance
// Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // Get lng/lat from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  // Calc radius using radians
  const radius = distance / 6378;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// Upload a photo for a bootcamp
// PUT /api/v1/bootcamps/:id/photo
// Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorReponse(`Resource with id of ${req.params.id} not found`, 404)
    );
  }
  // Make sure the user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorReponse(
        `User ${req.user.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }
  if (!req.files) {
    return next(new ErrorReponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  // Make sure the image is a photo
  if (!file.mimtetype.startsWith('image')) {
    return next(new ErrorReponse(`Please upload an image file`, 400));
  }
  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorReponse(
        `Please upload less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorReponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
    ongo;
  });
});
