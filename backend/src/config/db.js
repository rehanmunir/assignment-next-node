import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'product_catalog',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting to connect to database... (Attempt ${i + 1}/${retries})`);
      await sequelize.authenticate();
      console.log('MySQL Connected successfully');

      // Sync database (create tables if they don't exist)
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      console.log('Database synchronized');
      return;
    } catch (error) {
      console.error(`Unable to connect to the database (Attempt ${i + 1}/${retries}):`, error.message);

      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
};

export { sequelize, connectDB };
export default connectDB;
