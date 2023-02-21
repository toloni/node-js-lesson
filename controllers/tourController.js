const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);

    // BUILD QUERY
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    //2) Advanced Filtering
    //http://localhost:8000/api/v1/tours?duration[$lt]=5
    // gte|gt|lte|lt

    let query = Tour.find(queryObj);

    // SORT
    //http://localhost:8000/api/v1/tours?sort=price  ?sort=-price
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // FIELDS "select atribute, atribute"
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      //console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // ?page=2&limit=10  // skipt - pular 10 itens
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page is not exist');
    }

    // EXECUTE
    const tours = await query;

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('diffculty')
    //   .equals('easy');
    res.status(200).json({
      status: 'success',
      results: tours.length,
      page: page,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      satus: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      satus: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.patchTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
