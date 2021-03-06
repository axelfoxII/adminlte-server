const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {

  try {
    mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log('DB onLine');
    
  } catch (error) {

    console.log(error);
    throw new Error('Error al iniciar la BD ver logs');
    
  }
}

module.exports = {
  dbConnection
}