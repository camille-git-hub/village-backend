import mongoose from 'mongoose';

export async function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('No Mongo DB Connection String present');
  }

  const client = await mongoose.connect(mongoURI, {
    dbName: process.env.DB_NAME || 'village',
  });

  console.log(
    `Connected to MongoDB database at ${client.connection.host}:${client.connection.port}`
  );
}