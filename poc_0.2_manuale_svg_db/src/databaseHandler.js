const mysql = require('mysql2');

var db = null;

function setConnectionInformation(hostUrl, username, password, databaseName, port) {
    db = mysql.createConnection({
        host: hostUrl,
        user: username,
        password: password,
        database: databaseName,
        port: port
    });
}

function connectToDatabase(){
    db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database');
        throw err;
    }
    console.log('Connected to MySQL database');
});
}

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

module.exports = {
    setConnectionInformation,
    connectToDatabase,
    executeQuery
};