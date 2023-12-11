# PoC docker compose

## Obiettivo

Esplorare la containerizzazione di Next.js e DBMS SQL con Docker.

## Funzionamento

1. Clonare la repository in locale e spostarsi nella root del repository;
1. `docker compose watch` (richiede Docker 4.23+) oppure `docker compose up -d`;
1. L'applicazione è disponibile su [localhost:3000](http://localhost:3000);
1. Terminare l'esecuzione con `docker compose down`.

## Dettagli tecnici

Il docker compose è composto da due container:

1. `postgres`: database SQL di supporto;
1. `web`: applicazione Next.js.