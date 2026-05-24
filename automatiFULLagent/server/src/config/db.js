import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env.js";

let memoryServer;

export async function connectDatabase() {
  const uri = env.mongoUri || (await getMemoryMongoUri());

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);

  return mongoose.connection;
}

async function getMemoryMongoUri() {
  memoryServer = await MongoMemoryServer.create();
  return memoryServer.getUri();
}

export async function disconnectDatabase() {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
  }
}
