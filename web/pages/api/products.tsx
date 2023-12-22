

var db = require("@/lib/databaseHandler.tsx");
db.setConnectionInformation("postgres", "db_user", "root", "test_swe", 5432);
db.connectToDatabase();

export default async function handler(req, res) {
  // Connessione al database
  const query = 'SELECT * FROM prodotti';
  console.log(query);
  
  try {
    const results = await db.executeQuery(query);
    console.log(results);
    res.status(200).json(results["rows"]);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error Executing the query ' + query);
  }
}
