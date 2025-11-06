import clientPromise from "./db.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "Champs manquants" });

  try {
    const client = await clientPromise;
    const db = client.db("pronostics");
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({ username, email, password: hashedPassword, points: 0 });
    res.status(201).json({ message: "Utilisateur créé avec succès" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
