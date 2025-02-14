# Relazioone Progettazione Web e Mobile 2025

1. Gestione del profilo utente:
- registrazione profilo con acquisizione dati 
    - nome utente
    - indirizzo email
    - password
    - super eroe preferito
    - etc...
- modifica
- rimozione profilo
- dopo registrazione può creare album figurine vuoto

2. Acquisto di crediti da spendere in piattaforma e pacchetti
   di figurine
- gestione pagina per acquistare crediti
- pagina per acquistare pacchetti
    - pacchetti contengono 5 carte random
    - ogni figurina rappresenta un supereroe

3. Gestione dello scambio di figurine
- ogni utente registrato può proporre le sue figurine doppie in 
  cambio di altre

FRONT-END

Operazioni base:
- registrazione e login
- acquisto crediti
- acquisto pacchetti
- visualizzazione di informazioni relative a ongi supereroe
    - nome 
    - descirizone
    - immagine (ed altro)
- ogni supereroe trovato ha anche
    - series
    - events
    - comics
- insermineto di proposte di scambio
- visualizzazione di baratti disponibili

Operazioni aggiuntive (almeno 3):
- baratti più complessi con più figurine
- vendere figurine per crediti
- (amministratore che crea pacchid i figurine speciali)
- controlli di integrità negli scambi dove non si possano
  accettare figurine già ottenute o scambiare due figurine uguali

----------------------------------------------------------

BACK-END

REST, mongodb e nodejs


Pagine da creare:
- home 
    - titolo
    - descrizione piattaforma
    - collegamenti: login, register

- register
    - form con:
        - nome
        - email
        - password
        - eroe preferito
        - serie preferita
        - (immagine)
    - collegamenti: login

- login
    - email
    - password
    - collegamenti: register

- profilo

- album (singolo)

- figurina (singolo)

- acquisto crediti

- acquisto figurine

- scambi

- (profilo altri utenti)


## Analisi dei requisiti

## Identificazione delle funzionalità

## Progettazione della struttura e della presentazione delle pagine web

## Progettazione della sorgente di informazioni statica o dinamica

## Implementazione dell'applicazione stessa