const mongoose = require('mongoose');

let cached = global.__MONGOOSE_CONN__;
if (!cached) cached = global.__MONGOOSE_CONN__ = { conn: null, promise: null };

async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    if (!uri) throw new Error('Missing MONGODB_URI');
    if (!dbName) throw new Error('Missing DB_NAME');

    cached.promise = mongoose.connect(uri, {
      dbName,
      maxPoolSize: 10
    }).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectDb };
