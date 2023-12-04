/**
 * Questo modulo è il vero è proprio server middleware che permette di far interagire la nostra
 * applicazione (lato client) con il database MySQL (lato server).
 * 
 * Il modulo è stato scritto utilizzando il framework Express.js, che permette di creare un server HTTP
 */

// Importo il modulo databaseHandler.js, che permette di comunicare con il database MySQL
// questi sono una serie di moduli, quelli importanti sono DBHandler e express
const DBHandler = require('./databaseHandler.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// app è il nostro server
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());

// Imposto le informazioni di connessione al database
const HOST_URL = "127.0.0.1";
const DB_USER = "db_user";
const DB_PASSWORD = "root";
const DB_NAME = "test_swe";
const DB_PORT = 3306;

// Connessione al database
DBHandler.setConnectionInformation(HOST_URL, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT);
DBHandler.connectToDatabase();

// API endpoint
// in questo caso si tratta di un'operazione di get che restituisce tutti i prodotti presenti nel database
// con endpoint "/products" (vedi main.js riga 9)
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
//questa parte non è necessaria, era solamente per dei test
app.get("/requestMoveApproved", (req, res) => {
  return res.status(200).send("OK");
});

app.get("/requestMoveRejected", (req, res) => {
  return res.status(200).send("Spostamento non possibile");
});

app.get("/InternalServerError", (req, res) => {
  return res.status(500).send("Internal error");
});


// API endpoint di debug
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
