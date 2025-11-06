import clientPromise from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Champs manquants" });

  try {
    const client = await clientPromise;
    const db = client.db("pronostics");
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(400).json({ error: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ message: "Connexion réussie", token, username: user.username, points: user.points, userId: user._id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
