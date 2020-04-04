const Bootcamp = require('../models/Bootcamp');
const ErrorReponse = require('../utils/errorReponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// Get all bootcamps
// GET /api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // Copy req.query
  const reqQuery = { ...req.query };
  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);
  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));
  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIndex).limit(limit);
  // Executing query
  const bootcamps = await query;
  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  res
    .status(200)
    .json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps
    });
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
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
