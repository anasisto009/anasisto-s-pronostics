import clientPromise from "./db.js";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée" });

    try {
        const client = await clientPromise;
        const db = client.db("pronostics");

        // Récupérer tous les utilisateurs et trier par points décroissants
        const users = await db.collection("users")
            .find()
            .sort({ points: -1 })
            .toArray();

        const classement = users.map(user => ({
            username: user.username,
            points: user.points
        }));

        res.status(200).json(classement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
