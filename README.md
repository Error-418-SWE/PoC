# PoC docker compose

## Obiettivo

Esplorare la containerizzazione di Node.js e DBMS SQL con Docker.

## Funzionamento

1. Clonare la repository in locale e spostarsi nella root del repository;
1. `docker compose watch`
1. L'applicazione è disponibile su [localhost:3000](http://localhost:3000) e la connessione al DB è verificabile [qui](http://localhost:3000/persons/all);
1. Terminare l'esecuzione con `docker compose down`.

## Dettagli tecnici

Il docker compose è composto da due container:

1. `postgres`: database SQL di supporto;
1. `addressbook`: applicazione Node.js che espone un set di API Restful.

### Pacchetti npm

- three
- express
- pg
- sequelize
- jest

### Struttura delle directory

```bash
.
├── docker-compose.yml
├── Dockerfile
├── README.md
└── src
    ├── app.js
    ├── bin
    │   ├── migrate.js
    │   └── www
    ├── database.js
    ├── database.test.js
    ├── package.json
    ├── package-lock.json
    ├── public
    │   ├── images
    │   ├── index.html
    │   ├── javascripts
    │   └── stylesheets
    │       └── style.css
    └── routes
        ├── index.js
        ├── persons.js
        └── users.js
```