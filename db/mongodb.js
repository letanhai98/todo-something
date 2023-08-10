import mongoose from 'mongoose';

const connectMongoDB = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    dbName: process.env.MONGODB_NAME,
  });

  const connection = mongoose.connection;

  connection.on('error', (error) => {
    console.log(error);
  });

  // enable this to debug.
  // mongoose.set('debug', true);
  connection.once('connected', () => {
    console.log('database connected');
  });

  return connection;
};

export default connectMongoDB;
