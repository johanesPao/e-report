import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

async function bukaDatabaseBCMongo() {
  dotenv.config({ path: `${__dirname}/../.env` });
  const mongodbUrl = process.env.MONGODB_URL;

  if (!mongodbUrl) {
    throw new Error("Gagal membaca MONGODB_URL pada variabel environment");
  }

  const klien: mongoDB.MongoClient = new mongoDB.MongoClient(mongodbUrl);
  await klien.connect();

  return klien.db(process.env.NAMA_DB);
}

export async function koleksi_pengguna() {
  const db = await bukaDatabaseBCMongo();
  const pengguna = process.env.KOLEKSI_PENGGUNA;
  if (!pengguna) {
    throw new Error("Gagal membaca KOLEKSI_PENGGUNA pada variabel environment");
  }
  const koleksi = await db.collection(pengguna);
  return koleksi;
}
