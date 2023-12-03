const DBHandler = require('./databaseHandler.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());

const HOST_URL = "127.0.0.1";
const DB_USER = "db_user";
const DB_PASSWORD = "root";
const DB_NAME = "test_swe";
const DB_PORT = 3306;

DBHandler.setConnectionInformation(HOST_URL, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT);
DBHandler.connectToDatabase();

// API endpoint to fetch data
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM prodotti';
  DBHandler.executeQuery(query)
  .then(results => {
    res.json(results);
  }).catch(err => {
    console.error('Error executing query:', err);
    res.status(500).send('Error Executing the query ' + query);
  });
});

//A fini del tutto esemplificativi si simula il cmportmento dell'api di spostamento
app.get("/requestMoveApproved", (req, res) => {
  return res.status(200).send("OK");
});

app.get("/requestMoveRejected", (req, res) => {
  return res.status(200).send("Spostamento non possibile");
});

app.get("/InternalServerError", (req, res) => {
  return res.status(500).send("Internal error");
});


// ... other API endpoints ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
