const Cart = require("../models/cart");
const axios = require("axios");

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json([]);
    
    // Fetch product details from Product Service
    const productIds = cart.items.map(item => item.product);
    const productsResponse = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002'}/api/products/batch`,
      { ids: productIds },
      { headers: { 'Content-Type': 'application/json' } }
    ).catch(() => ({ data: { products: [] } }));
    
    const productsMap = new Map(
      productsResponse.data.products.map(p => [p._id.toString(), p])
    );
    
    const itemsWithProducts = cart.items.map(item => ({
      ...item.toObject(),
      product: productsMap.get(item.product.toString()) || null
    })).filter(item => item.product !== null);
    
    res.json(itemsWithProducts);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Verify product exists via Product Service
    const productResponse = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002'}/api/products/${productId}`
    ).catch(() => ({ data: null }));
    
    if (!productResponse.data) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
      return res.json(cart);
    }
    const idx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (idx > -1) cart.items[idx].quantity += quantity;
    else cart.items.push({ product: productId, quantity });
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id || req.body.productId;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const idx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (idx === -1)
      return res.status(404).json({ message: "Product not in cart" });
    if (quantity <= 0) cart.items.splice(idx, 1);
    else cart.items[idx].quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    next(err);
  }
};
