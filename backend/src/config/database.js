const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove deprecated options (Mongoose 6+ doesn't need them)
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Job_Matcher');
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;