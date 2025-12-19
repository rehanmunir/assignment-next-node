// Simple authentication controller with hardcoded admin credentials
// In production, use proper password hashing and database storage

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hardcoded admin credentials (from environment variables)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // In production, use JWT or session management
      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          username: ADMIN_USERNAME,
          role: 'admin',
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: error.message });
  }
};
