import { DataTypes } from 'sequelize';
import slugify from 'slugify';
import { sequelize } from '../config/db.js';

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product title is required',
        },
        len: {
          args: [3, 255],
          msg: 'Title must be between 3 and 255 characters',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product description is required',
        },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product image is required',
        },
      },
    },
    category: {
      type: DataTypes.ENUM(
        'Clothing',
        'Shoes',
        'Electronics',
        'Accessories',
        'Home & Garden',
        'Sports',
        'Books',
        'Toys'
      ),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product category is required',
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'Price must be a valid number',
        },
        min: {
          args: [0],
          msg: 'Price cannot be negative',
        },
      },
    },
    availability: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'products',
    hooks: {
      beforeValidate: (product) => {
        // Generate slug from title before validation
        if (product.title) {
          product.slug = slugify(product.title, { lower: true, strict: true });
        }
      },
    },
  }
);

export default Product;
