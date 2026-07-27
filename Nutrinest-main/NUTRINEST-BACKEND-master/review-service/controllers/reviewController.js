const Review = require("../models/review");
const axios = require("axios");

exports.addReview = async (req, res, next) => {
  try {
    const { rating, text } = req.body;
    const productId = req.params.id;
    
    // Verify product exists via Product Service
    const productResponse = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002'}/api/products/${productId}`
    ).catch(() => ({ data: null }));
    
    if (!productResponse.data) return res.status(404).json({ message: "Product not found" });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      username: req.user.username,
      rating,
      text,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.getRecentReviews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    const query = req.params.id ? { product: req.params.id } : {};

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("username rating text createdAt product");

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.addSiteReview = async (req, res, next) => {
  try {
    const { rating, text } = req.body;
    const review = await Review.create({
      user: req.user._id,
      username: req.user.username,
      rating,
      text,
      product: null, // Site review
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.getSiteReviews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    // Fetch reviews where product is null (site reviews)
    const reviews = await Review.find({ product: null })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
