# PoC 0.1 (Silvio)
- npm init\
- Install Parcel by typing the following command: npm install parcel -g\
- Make sure to install dependencies: open project in VSCode -> open command line -> type: npm install\\
- per usare dat.gui sevo fare npm install dat.gui (con parcel che non sta runnando)\
- Run Parcel by typing this command: npx parcel ./poc_0.1/src/index.html

# PoC 0.1.1 (Rosario)

Il seguente PoC ha come base il PoC 0.1, a cui sono state aggiunte alcune funzionalità, come la possibilità di creare degli scaffali con dei piani e di creare e collocare dei bin su questi piani.
\
Funzionalità da implementare:
- gestione collisione bin/bin e bin/piano
- possibilità di inserire i bin anche nei piani superiori dello scaffale (per ora si inseriscono solo al piano inferiore)

## Installazione
- Installare Nodejs;
- scaricare e posizionarsi sulla cartella del PoC;
- aprire il terminale e lanciare i seguenti comandi:
  - `npm install --save three`
  - `npm install --save-dev vite`
  - `npm install dat.gui`
  - `npx vite`
  
Se tutto è andato bene, comparirà un URL come http://localhost:5173 sul terminale, dal quale si potrà accedere all'applicazione.

Documentazione seguita per l'installazione:
https://threejs.org/docs/#manual/en/introduction/Installation

