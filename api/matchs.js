import clientPromise from "./db.js";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée" });

    try {
        const client = await clientPromise;
        const db = client.db("pronostics");

        // Ici on peut créer des matchs par défaut si la collection est vide
        const matchs = await db.collection("matchs").find().toArray();

        if (matchs.length === 0) {
            const defaultMatchs = [
                { id: 1, teamA: "Real Madrid", teamB: "Barcelona", date: new Date() },
                { id: 2, teamA: "PSG", teamB: "Marseille", date: new Date() },
                { id: 3, teamA: "Liverpool", teamB: "Man City", date: new Date() }
            ];
            await db.collection("matchs").insertMany(defaultMatchs);
            return res.status(200).json(defaultMatchs);
        }

        res.status(200).json(matchs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}