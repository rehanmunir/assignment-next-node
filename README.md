# Product Catalog Application

A full-stack product catalog application with separate admin panel and user shop interface. Built with Next.js, Node.js, MySQL, and Docker.

## Tech Stack

### Frontend
- **Next.js 16** with TypeScript and App Router
- **SASS** (indentation-based) for styling
- **Redux Toolkit Query** for state management and API calls
- **Formik & Yup** for form handling and validation
- **Next.js Image** optimization

### Backend
- **Node.js** with Express
- **MySQL 8.0** with Sequelize ORM
- **Multer** for image uploads
- **Slugify** for generating URL-friendly slugs
- **Hardcoded authentication** for admin access

### DevOps
- **Docker** and **Docker Compose** for containerization
- **Development mode** with hot reload for both frontend and backend

## Features

### User Shop Interface (/)
- Modern gradient design with product grid layout
- Search functionality by product title
- Category filters with checkboxes
- Price range filtering (min/max)
- Sort by price (Low to High, High to Low)
- Product cards with images, titles, prices, and availability
- Click on products to view details
- "Admin Panel" button in header

### Product Detail Page (/products/[slug])
- Full product information display
- Product image, title, description, category, price, and availability
- Related products section (3-4 items from the same category)
- User-friendly view (no admin actions visible to regular users)

### Admin Panel (/admin)
**Authentication Required** - Hardcoded credentials:
- **Username**: `admin`
- **Password**: `admin123`

**Features:**
- Dashboard with statistics (Total Products, In Stock, Out of Stock)
- Table view of all products
- Product management:
  - **Create** new products with image upload
  - **Edit** existing products (optional image update)
  - **Delete** products with confirmation
- "View Shop" button to switch to user interface
- Logout functionality
- Purple gradient login page design

### Product Management
- Form validation with Formik and Yup
- Auto-generated slugs from product titles
- Image preview during upload
- Full CRUD operations
- Real-time updates with RTK Query cache invalidation

## Database Schema

Product Table (MySQL):
- `id` (INTEGER, AUTO_INCREMENT, PRIMARY KEY)
- `title` (VARCHAR(255), required) - Product name
- `description` (TEXT, required) - Product description
- `image` (VARCHAR(255), required) - Product image path/URL
- `category` (ENUM, required) - Product category (Clothing, Shoes, Electronics, Accessories, Home & Garden, Sports, Books, Toys)
- `price` (DECIMAL(10,2), required) - Product price
- `availability` (BOOLEAN, required, default: true) - Stock availability
- `slug` (VARCHAR(255), required, unique) - URL-friendly identifier (auto-generated)
- `createdAt` (DATETIME) - Creation timestamp
- `updatedAt` (DATETIME) - Last update timestamp

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your system
- OR Node.js (v20+), npm/pnpm, and MySQL 8.0

### Docker Setup (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd assignment-next-node
```

2. Build and start all services:
```bash
docker compose up --build
```

Or with sudo if you have permission issues:
```bash
sudo docker compose up --build
```

3. Wait for all services to start (backend will retry MySQL connection automatically)

4. Access the application:
- **User Shop**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
  - Username: `admin`
  - Password: `admin123`
- **Backend API**: http://localhost:5000/api
- **MySQL**: localhost:3307 (mapped from container port 3306)

5. Stop the application:
```bash
docker compose down
```

To stop and remove all data:
```bash
docker compose down -v
```

### Development Mode

The Docker setup runs in development mode with hot reload enabled:
- **Frontend**: Changes to `.tsx`, `.ts`, `.sass` files will automatically refresh
- **Backend**: Changes to `.js` files will automatically restart the server with nodemon
- Volume mounts enable live code updates without rebuilding containers

### Local Development Setup (Without Docker)

#### Backend Setup

1. Install and start MySQL:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Create database
sudo mysql -u root
CREATE DATABASE product_catalog;
EXIT;
```

2. Navigate to the backend folder:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=product_catalog
DB_USER=root
DB_PASSWORD=your_mysql_password
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000 and automatically create the database tables.

#### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login with hardcoded credentials

### Products
- `GET /api/products` - Get all products (with filters)
  - Query params: `search`, `category`, `minPrice`, `maxPrice`, `sortBy`, `page`, `limit`
- `GET /api/products/:slug` - Get product by slug
- `GET /api/products/:slug/related` - Get related products
- `POST /api/products` - Create new product (with image upload)
- `PUT /api/products/:id` - Update product (optional image update)
- `DELETE /api/products/:id` - Delete product

### Health Check
- `GET /api/health` - Check server status

## Project Structure

```
assignment-next-node/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MySQL connection with retry logic
│   │   ├── controllers/
│   │   │   ├── authController.js      # Admin authentication
│   │   │   └── productController.js   # CRUD logic
│   │   ├── middleware/
│   │   │   └── upload.js              # Multer config
│   │   ├── models/
│   │   │   └── Product.js             # Sequelize model
│   │   ├── routes/
│   │   │   ├── authRoutes.js          # Auth endpoints
│   │   │   └── productRoutes.js       # Product endpoints
│   │   └── server.js                  # Express app
│   ├── uploads/                       # Uploaded images
│   ├── .env                           # Environment variables
│   ├── .gitignore
│   ├── Dockerfile.dev                 # Development Dockerfile
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   ├── page.tsx           # Admin login page
│   │   │   │   └── page.module.sass
│   │   │   ├── page.tsx               # Admin dashboard
│   │   │   └── page.module.sass
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx           # Product detail (user view)
│   │   │       └── page.module.sass
│   │   ├── globals.sass
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # User shop homepage
│   │   └── page.module.sass
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddProductDialog.tsx   # Create product form
│   │   │   ├── UpdateProductDialog.tsx # Update product form
│   │   │   ├── ProductCard.tsx        # Product card component
│   │   │   ├── ProductFilters.tsx     # Filter sidebar
│   │   │   ├── Providers.tsx          # Redux provider
│   │   │   └── *.module.sass
│   │   └── store/
│   │       ├── api.ts                 # RTK Query API
│   │       └── store.ts               # Redux store
│   ├── .env.local
│   ├── Dockerfile.dev                 # Development Dockerfile
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

## Usage Guide

### Admin Access

1. Navigate to http://localhost:3000
2. Click "Admin Panel" button in the header
3. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`
4. You'll be redirected to the admin dashboard

### Managing Products (Admin)

#### Adding a Product
1. In the admin panel, click "Add Product" button
2. Fill in the form:
   - Title (required, min 3 characters)
   - Image (required, max 5MB, JPG/PNG/GIF/WebP)
   - Category (required, select from dropdown)
   - Price (required, positive number)
   - Availability (checkbox for stock status)
   - Description (required, min 10 characters)
3. The slug is auto-generated from the title
4. Click "Add Product" to save

#### Updating a Product
1. In the admin panel table, click "Edit" on any product
2. Modify the desired fields
3. Optionally upload a new image (leave empty to keep current)
4. Click "Update Product" to save changes

#### Deleting a Product
1. In the admin panel table, click "Delete" on any product
2. Confirm the deletion in the popup dialog

### Browsing Products (User Side)

#### Searching and Filtering
- **Search**: Type in the search box to filter by product title
- **Category**: Check/uncheck categories to filter products
- **Price Range**: Enter min and/or max price values
- **Sort**: Select sorting option from the dropdown

#### Viewing Product Details
- Click on any product card to view full details
- View related products from the same category at the bottom
- Click "Back to Products" to return to the shop

## Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=mysql
DB_PORT=3306
DB_NAME=product_catalog
DB_USER=root
DB_PASSWORD=rootpassword
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
INTERNAL_API_URL=http://backend:5000/api
```

### Docker Compose Environment
The `docker-compose.yml` file configures all environment variables automatically.

## Development Notes

### Hot Reload
- **Frontend**: Running in Next.js dev mode with `pnpm dev`
- **Backend**: Running with nodemon for automatic server restarts
- **Volume Mounts**: Code changes reflect immediately without rebuilding containers

### Data Persistence
- MySQL data is persisted in a Docker volume named `mysql_data`
- Uploaded images are stored in `backend/uploads/` directory
- Data persists between container restarts

### Authentication
- Admin credentials are hardcoded in environment variables
- Login state stored in browser localStorage
- No JWT or session management (simplified for development)

### Cache Management
- RTK Query `keepUnusedDataFor: 0` ensures fresh data
- Cache invalidation on create/update/delete operations
- `refetchOnReconnect` and `refetchOnMountOrArgChange` enabled

### Database Connection
- Backend retries MySQL connection 5 times with 5-second delays
- Ensures MySQL is fully initialized before connecting
- Automatic table creation and schema sync on startup

## Docker Configuration

### Services

1. **MySQL** (mysql:8.0)
   - Port: 3307:3306 (host:container)
   - Healthcheck with mysqladmin ping
   - Volume: mysql_data

2. **Backend** (Node.js)
   - Port: 5000:5000
   - Depends on MySQL healthcheck
   - Development mode with nodemon
   - Volume mounts for hot reload

3. **Frontend** (Next.js)
   - Port: 3000:3000
   - Depends on backend
   - Development mode with pnpm dev
   - Volume mounts for hot reload

### Networks
All services communicate via `app-network` bridge network.

## Troubleshooting

### Docker Issues

If containers fail to start:
```bash
docker compose down -v
docker compose up --build
```

### Port Already in Use

The application uses these ports:
- `3000` - Frontend (Next.js)
- `5000` - Backend API
- `3307` - MySQL (mapped from container's 3306)

If any port is in use:
- Stop the conflicting service
- OR modify the ports in `docker-compose.yml`

### MySQL Connection Failed

Check if MySQL container is running:
```bash
docker ps | grep mysql
```

View MySQL logs:
```bash
docker compose logs mysql
```

The backend will automatically retry connection 5 times.

### Authentication Issues

If you can't login to admin panel:
- Verify credentials: `admin` / `admin123`
- Check browser console for errors
- Verify backend is running: http://localhost:5000/api/health
- Clear localStorage and try again

### Code Changes Not Reflecting

If your code changes don't appear:
1. Check if containers are running: `docker ps`
2. View frontend logs: `docker compose logs frontend`
3. View backend logs: `docker compose logs backend`
4. Restart containers: `docker compose restart`

### Image Upload Issues

Check that the `backend/uploads` directory exists:
```bash
ls -la backend/uploads
```

Fix permissions if needed:
```bash
chmod 755 backend/uploads
```

### Permission Denied (Docker)

Add your user to the docker group:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

Or run with sudo:
```bash
sudo docker compose up --build
```

### MySQL Port Conflict

If port 3307 is also in use, edit `docker-compose.yml`:
```yaml
mysql:
  ports:
    - "3308:3306"  # Change to any available port
```

## Production Deployment

For production deployment:

1. Create production Dockerfiles without dev dependencies
2. Use environment-based configuration
3. Implement proper authentication (JWT, sessions)
4. Enable HTTPS/SSL
5. Use proper secrets management
6. Configure CORS properly
7. Set up proper logging and monitoring
8. Use production-ready MySQL configuration
9. Enable database backups

## Security Notes

- Admin credentials are hardcoded (development only)
- No password hashing (development only)
- LocalStorage authentication (development only)
- For production, implement proper authentication with JWT/sessions
- Enable HTTPS in production
- Sanitize all user inputs
- Implement rate limiting
- Use environment variables for all secrets

## License

ISC

## Author

Product Catalog Application with Admin Panel and User Shop Interface
