// Get all bootcamps
// GET /api/v1/bootcamps
// Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Show all bootcamps'
  });
};

// Get a single bootcamp
// GET /api/v1/bootcamps/:id
// Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Display the bootcamp ${req.params.id}`
  });
};

// Create a new bootcamp
// POST /api/v1/bootcamps
// Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Create a new bootcamp'
  });
};

// Update a bootcamp
// PUT /api/v1/bootcamps/:id
// Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update the bootcamp ${req.params.id}`
  });
};

// Delete a bootcamp
// DELETE /api/v1/bootcamps/:id
// Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete the bootcamp ${req.params.id}`
  });
};
