const { Pizza } = require("../models");

const getPizzas = async (req, res) => {
  try {
    const {
      filter,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build query object
    let query = {};
    
    // Apply vegetarian filter
    if (filter === 'veg') {
      query.isVegetarian = true;
    } else if (filter === 'non-veg') {
      query.isVegetarian = false;
    }
    
    // Apply search filter
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Build sort object
    let sortObj = {};
    if (sortBy === 'price') {
      sortObj.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sortObj.name = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const pizzas = await Pizza.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalCount = await Pizza.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    // Send response with pagination info
    res.json({
      pizzas,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        limit: limitNum
      }
    });

  } catch (error) {
    console.error('Error fetching pizzas:', error);
    res.status(500).json({ message: 'Failed to fetch pizzas', error: error.message });
  }
};

const createPizza = async (req, res) => {
  try {
    const pizza = new Pizza(req.body);
    await pizza.save();
    res.status(201).json(pizza);
  } catch (error) {
    console.error('Error creating pizza:', error);
    res.status(500).json({ message: 'Failed to create pizza', error: error.message });
  }
};

module.exports = {
  getPizzas,
  createPizza,
};
