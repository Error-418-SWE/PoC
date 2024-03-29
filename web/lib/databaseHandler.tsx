/**
 * Questo modulo si occupa di gestire l'interazione con il database MySQL.
 * L'obiettivo è rendere modulare l'interazione con il database, in modo da poter comunicare con il database in modo 
 * indipendente dalla tecnologia utilizzata.
 * Questo modulo verrà utilizzato da server.js per comunicare con il database.
 */

// Importo il modulo pg, che permette di comunicare con il database MySQL
const {Client} = require('pg');
// Inizializzazione della variabile che rappresenta la connessione al database
var db = null;

// Funzione che permette di impostare le informazioni di connessione al database
function setConnectionInformation(hostUrl, username, password, databaseName, port) {
    db = new Client({
        host: hostUrl,
        user: username,
        password: password,
        database: databaseName,
        port: port
    });
}

// Funzione che permette di connettersi al database
function connectToDatabase(){
    db.connect((err) => {
    if (err) {
        console.error('Error connecting to Postgress database');
    }else console.log('Connected to Postgress database');
});
}

// Funzione che permette di eseguire una query sul database
// al momento la query è passata come semplice stringa (non è parametrica)
function executeQuery(query){
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// Export delle funzioni, in modo che possano essere utilizzate dal modulo server.js
// è una cosa nativa di Node.js
module.exports = {
    setConnectionInformation,
    connectToDatabase,
    executeQuery
};