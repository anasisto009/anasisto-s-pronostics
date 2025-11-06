import clientPromise from "./db.js";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

    const { userId, matchId, scoreA, scoreB } = req.body;
    if (!userId || !matchId || scoreA === undefined || scoreB === undefined)
        return res.status(400).json({ error: "Champs manquants" });

    try {
        const client = await clientPromise;
        const db = client.db("pronostics");

        // Vérifier si l'utilisateur a déjà pronostiqué ce match
        const existing = await db.collection("pronostics").findOne({ userId, matchId });
        if (existing) {
            await db.collection("pronostics").updateOne(
                { userId, matchId },
                { $set: { scoreA, scoreB } }
            );
            return res.status(200).json({ message: "Pronostic mis à jour !" });
        }

        await db.collection("pronostics").insertOne({ userId, matchId, scoreA, scoreB });
        res.status(201).json({ message: "Pronostic enregistré !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}