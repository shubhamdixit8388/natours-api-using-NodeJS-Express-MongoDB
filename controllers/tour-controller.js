const Tour = require('../models/tour-model');

exports.checkBody = (req, res, next) => {
  // if (!(req.body.name && req.body.price)) {
  //   return res.status(400).send({
  //     status: 'fail',
  //     message: 'Missing name or price'
  //   });
  // }
  next();
}

exports.getAllTours = async (req, res) => {
  try {
    // 1A) Filtering
    let reqQuery = {...req.query};
    const excludeQueries = ['page', 'sort', 'limit', 'fields'];
    excludeQueries.forEach(excludeQuery => delete reqQuery[excludeQuery]);

    // 2B) Advanced filtering
    reqQuery = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    // Build query
    console.log(reqQuery);
    let query = Tour.find(JSON.parse(reqQuery));

    // 2)Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
      // sort('-price -duration') // descending sorting, first priority is price nd second is duration
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field Selection
    if (req.query.fields) {
      const fields = JSON.stringify(req.query.fields).split(',').join(' ');
      query = query.select(JSON.parse(fields));
    } else {
      // Excluding '__v'
      query = query.select('-__v');
    }

    // Execute query
    const tours = await query;

    // Chaining to query
    // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

    // Send response
    res.status(200).send({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: 'Fail',
      message: error
    })
  }

};

exports.addNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).send({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    // const tour = await Tour.findOne({_id: req.params.id});
    const tour = await Tour.findById(req.params.id);
    res.status(200).send({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).send({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error
    });
  }
};

exports.deleteTourById = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).send({
      status: 'success'
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error
    });
  }
};
