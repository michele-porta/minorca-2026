# 🏝️ Minorca 2026 - Itinerario di Viaggio Interattivo

Un'applicazione web moderna, reattiva e ricca di dettagli sviluppata per la gestione dell'itinerario di viaggio a Minorca.

🌐 **Sito Live**: [https://michele-porta.github.io/minorca-2026/](https://michele-porta.github.io/minorca-2026/)

---

## 🌟 Caratteristiche Principali

- 🗺️ **Mappa Interattiva (Leaflet.js)**: Visualizzazione dinamica con marker dedicati per Hotel (RVHotels Sea Club Menorca), Aeroporto, Punti Panoramici (Fari e Tramonti) e le 7 Spiagge principali. Mappa ad auto-zoom per ciascun giorno dell'itinerario.
- 💨 **Consulente Vento (Regola di Minorca)**: Selettore in tempo reale per valutare la direzione del vento del giorno (Tramontana vs Scirocco/Ostro) e ricevere consigli/alternative sulle calette ottimali.
- 📅 **Programma Giorno per Giorno**: Cronoprogramma completo con tappe quotidiane, noleggio scooter 125cc, consigli sui ristoranti tipici a Ciutadella e tempi di percorrenza.
- 🔒 **Protezione con PIN & SHA-256**: Schermata d'accesso riservata e protetta da hashing crittografico a senso unico (lato client).
- 🌓 **Tema Chiaro / Scuro (Dark Mode)**: Commutazione nativa della palette visiva e delle mappe (Carto Voyager / Carto Dark Matter).
- 🎒 **Checklist & Progressi**: Gestione dello stato di completamento giorni, spiagge visitate e checklist bagagli/documenti con memoria in `localStorage`.

---

## 📂 Struttura del Progetto

- `index.html` - Struttura HTML5, layout responsive e schermata di autenticazione PIN.
- `styles.css` - Design system Vanilla CSS (Glassmorphism, variabili CSS, animazioni).
- `data.js` - Database delle coordinate geografiche, dati delle cale ed itinerario.
- `script.js` - Motore logico (gestione mappa, consulente vento, eventi e persistenza).

---

## 💻 Esecuzione in Locale

Per avviare la pagina sul tuo computer in locale:

```bash
python -m http.server 8080
```

Apri quindi il browser all'indirizzo: `http://localhost:8080/index.html`.

---

*Buon viaggio nell'isola della calma! 🌴☀️*
