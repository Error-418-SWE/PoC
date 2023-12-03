# PoC Silvio (poc_0.1)
- npm init
-  Install Parcel by typing the following command: npm install parcel -g
- Make sure to install dependencies: open project in VSCode -> open command line -> type: npm install
- per usare dat.gui sevo fare npm install dat.gui (con parcel che non sta runnando)
- Run Parcel by typing this command: npx parcel ./poc_0.1/src/index.html

# PoC Riccardo (poc_0.2_manuale_svg_db)
## PoC contente creazione manuale, SVG e conttatto con il database
Per l'utilizzo si consiglia al momento windows con ambiente WSL (io ho ubuntu), tutto utilizzabile mediante visual studio code.
Necessario installare node e mysql nell'ambiente.

Installato node, per importare tutte le dependencies necessarie (elencate dentro package.json) sarà sufficiente eseguire il comando "npm install" (nella stessa cartella del file package.json obv).

### Controlli
Visuale isometrica! 
Al momento solo possibilità di ruotare la telecamera e zoomare/dezoomare.

### Creazione manuale
Premendo sul pulsante "Manual Creation" si aprirà un form dove inserire le dimensioni larghezze e lunghezza del magazzino, e verrà creato un piano delle dimensioni specificate.
Vi verrà chiesto "dimensin 1" e "dimension 2": per il momento mette valori compresi tra 0 e 20 (se no diventa troppo grande, si tratta solo di una demo al momento, ovviamente poi si potranno mettere dimensioni più grandi).

### Importazione file SVG
Premendo sul pulsante "Import SVG" sarà possibile caricare un file svg, o mediante selezione del file mediante l'esplora risorse, oppure tramite drag and drop nell'area dedicata. L'ambiente sarà caricato automaticamente. Nella cartella lascio i 2 file SVG mandati di esempio dalla proponente.

### Contatto con il database
Il database sarà necessario caricarlo in locale. Io ho utilizzato un sistema Ubuntu in cui ho installato mysql da linea di comando e creato un mini database con una sola tabella "prodotti". 

Durante la configurazione iniziale di mysql mettete i seguenti parametri:
- username: db_user
- password: root
- database name (quando lo create): test_swe

Lascio nella cartella anche il back up del mio database. Per poterlo importare sarà necessario seguire i seguenti passaggi:
- intallare mysql nel sistema;
- accedere alla console mysql mediante il comando "mysql -u username -p"
- creare il nuovo database con il comando "CREATE DATABASE test_swe"
- usare il comando "USE test_swe"
- importare il file .sql mediante "source ./backup_database.sql"

Per permettere all'applicativo di comunicare con il database è necessario impostare un mini server, impostabile mediante "Express".
Dalla cartella poc_02 sarà sufficiente farlo partire con il comando "node ./src/server.js". Dovrebbe comparire un messaggio di conferma di running del server.

### Pannello di ricerca dati
A sinistra della schermata è presente un pannello di ricerca NON funzionante: al momento si limita a mostrare solamente tutti i prodotti presenti nel database.

### Avvio dell'applicativo
A questo punto aprite un altro terminale (sempre in ambiente ubuntu) e fate il comando "npx vite". Ora sul terminale, salvo errori, vi comparirà l'indirizzo a cui collegarvi per vedere l'app. Enjoy.

Se il collegamento con il database andrà a buon fine, vedrete nel pannello laterale sinistro "prodotto n1".. etc fino a "prodotto n4".
