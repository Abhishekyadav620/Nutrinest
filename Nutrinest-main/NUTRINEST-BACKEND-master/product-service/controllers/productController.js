const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (rating) filter.rating = { $gte: Number(rating) };

    let sortObj = { createdAt: -1 };
    if (sort) {
      if (sort === "price-asc") sortObj = { price: 1 };
      else if (sort === "price-desc") sortObj = { price: -1 };
      else if (sort === "rating-desc") sortObj = { rating: -1 };
      else if (sort === "newest") sortObj = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

exports.getProductsBatch = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid request: ids array required" });
    }
    const products = await Product.find({ _id: { $in: ids } });
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.updateProductStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    product.stock = Math.max(0, (product.stock || 0) + quantity);
    await product.save();
    
    res.json({ stock: product.stock });
  } catch (err) {
    next(err);
  }
};
