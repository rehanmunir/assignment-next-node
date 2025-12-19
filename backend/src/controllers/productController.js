import Product from '../models/Product.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to serialize product and convert price to number
const serializeProduct = (product) => {
  const productData = product.toJSON();
  return {
    ...productData,
    price: parseFloat(productData.price),
  };
};

// @desc    Get all products with filters, search, and sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 20,
    } = req.query;

    // Build where clause
    const where = {};

    // Search by title
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    // Filter by category (support multiple categories)
    if (category) {
      const categories = category.split(',');
      where.category = { [Op.in]: categories };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    // Build order options
    let order = [];
    if (sortBy === 'price-asc') {
      order = [['price', 'ASC']];
    } else if (sortBy === 'price-desc') {
      order = [['price', 'DESC']];
    } else {
      order = [['createdAt', 'DESC']]; // Default: newest first
    }

    // Execute query with pagination
    const offset = (page - 1) * limit;
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset: offset,
    });

    res.json({
      products: products.map(serializeProduct),
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(serializeProduct(product));
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related products (same category)
// @route   GET /api/products/:slug/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const relatedProducts = await Product.findAll({
      where: {
        category: product.category,
        id: { [Op.ne]: product.id },
      },
      limit: 4,
    });

    res.json(relatedProducts.map(serializeProduct));
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public
export const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, availability } = req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const product = await Product.create({
      title,
      description,
      category,
      price,
      availability: availability === 'true' || availability === true,
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(serializeProduct(product));
  } catch (error) {
    console.error('Error in createProduct:', error);
    // Delete uploaded file if product creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { title, description, category, price, availability } = req.body;

    // Update fields
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (price) updates.price = price;
    if (availability !== undefined) {
      updates.availability = availability === 'true' || availability === true;
    }

    // Update image if new one uploaded
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '../../', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      updates.image = `/uploads/${req.file.filename}`;
    }

    await product.update(updates);

    // Fetch updated product to get the new slug if title changed
    const updatedProduct = await Product.findByPk(req.params.id);
    res.json(serializeProduct(updatedProduct));
  } catch (error) {
    console.error('Error in updateProduct:', error);

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '../../', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: error.message });
  }
};
