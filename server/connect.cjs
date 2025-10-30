const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: "config.env" });

async function main() {
    const uri = process.env.ATLAS_URI;
    const client = new MongoClient(uri);
    
    try {
        await client.connect();

        const db = client.db("go-shrimp-app");
        const collections = await db.listCollections().toArray();

        collections.forEach((collection) => {
            console.log(collection.name);
        });
    } catch (e) {
        console.error("MongoDB connection error:", e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);