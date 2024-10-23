const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017", {
        user: "admin",
        pass: "root",
        dbName: "notifications",
});
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB');
    process.exit(1);
  }
};

module.exports = connectDB;
