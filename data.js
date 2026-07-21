// ==========================================
// Menorca Itinerary Static Data
// ==========================================

const hotelCoords = [40.0039, 3.8011]; // RVHotels Sea Club Menorca (Cala'n Blanes)
const airportCoords = [39.8626, 4.2183]; // Menorca Airport (MAH)

const beaches = [
    {
        id: "turqueta",
        name: "Cala Turqueta",
        coords: [39.9320, 3.9150],
        type: "South Coast",
        desc: "Una delle spiagge vergini più celebri dell'isola. Sabbia bianca finissima, acque di un azzurro intenso e una pineta retrostante che offre ombra naturale nelle ore più calde. Parcheggio a circa 15 minuti a piedi.",
        img: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Cala_en_Turqueta_%2816234699877%29.jpg",
        difficulty: "Facile",
        time: "32 min in scooter",
        tags: ["Sabbia Bianca", "Selvaggia", "Pineta"],
        day: 2
    },
    {
        id: "pregonda",
        name: "Cala Pregonda",
        coords: [40.0560, 4.0402],
        type: "North Coast",
        desc: "Spiaggia leggendaria per il suo aspetto lunare: sabbia rossa/dorata e scogli vulcanici che la proteggono dal mare aperto creando una piscina naturale. Richiede una camminata di circa 20-25 minuti dal parcheggio di Binimel-là.",
        img: "https://upload.wikimedia.org/wikipedia/commons/0/01/Cala_Pregonda_4.jpg",
        difficulty: "Medio (Trek a piedi)",
        time: "42 min in scooter",
        tags: ["Sabbia Rossa", "Lunare", "Snorkeling"],
        day: 3
    },
    {
        id: "mitjana",
        name: "Cala Mitjana",
        coords: [39.9344, 3.9723],
        type: "South Coast",
        desc: "Una grandiosa baia naturale nel sud, racchiusa da alte scogliere calcaree ricoperte di pini. Accanto si trova la deliziosa e più piccola Cala Mitjaneta. Il sentiero dal parcheggio è asfaltato e pianeggiante (15 min).",
        img: "https://upload.wikimedia.org/wikipedia/commons/1/14/Cala_Mitjana.jpg",
        difficulty: "Facile",
        time: "35 min in scooter",
        tags: ["Sabbia Bianca", "Scogliere", "Ombra"],
        day: 4
    },
    {
        id: "algaiarens",
        name: "Cala Algaiarens (La Vall)",
        coords: [40.0467, 3.9213],
        type: "North-West Coast",
        desc: "Situata in un'area naturale protetta, offre due ampie spiagge di sabbia fine e dune. È una delle spiagge del nord più facili da raggiungere, ideale quando soffia vento forte da sud. Parcheggio a 5 minuti.",
        img: "https://upload.wikimedia.org/wikipedia/commons/e/ec/La_Vall.JPG",
        difficulty: "Facile",
        time: "20 min in scooter",
        tags: ["Selvaggia", "Dune", "Facile Accesso"],
        day: 5
    },
    {
        id: "saura",
        name: "Son Saura",
        coords: [39.9268, 3.8943],
        type: "South Coast",
        desc: "Una spiaggia lunghissima divisa in due insenature (Es Banyuls e Bellavista). Caratterizzata da fondali bassi e sabbiosi ideali per rilassarsi. Ampio parcheggio gratuito a soli 5 minuti a piedi dalla spiaggia.",
        img: "https://upload.wikimedia.org/wikipedia/commons/b/b0/SON_SAURA_10.jpg",
        difficulty: "Facile",
        time: "28 min in scooter",
        tags: ["Sabbia Bianca", "Basso Fondale", "Parcheggio Vicino"],
        day: 6
    },
    {
        id: "presili",
        name: "Cala Presili",
        coords: [39.9918, 4.2548],
        type: "North-East Coast",
        desc: "Spiaggia incontaminata di sabbia fine situata all'interno del Parco Naturale di s'Albufera des Grau. Offre una vista indimenticabile sul Faro di Favàritx e la sua silhouette bicolore. Camminata di circa 20 minuti.",
        img: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Cala_Presili_%28122327099%29.jpeg",
        difficulty: "Medio (Sentiero sterrato)",
        time: "48 min in scooter",
        tags: ["Sabbia Fine", "Vista Faro", "Parco Naturale"],
        day: 7
    },
    {
        id: "brut",
        name: "Cala en Brut",
        coords: [40.0016, 3.8058],
        type: "West Coast (Cala)",
        desc: "Una cala rocciosa senza sabbia, famosa per le sue piattaforme levigate in cemento da cui tuffarsi nell'acqua incredibilmente trasparente. Soprannominata la 'piscina naturale' di Minorca. Si trova a pochissimi passi dal vostro hotel.",
        img: "https://upload.wikimedia.org/wikipedia/commons/4/40/Cala%27n_Brut_Menorca.JPG",
        difficulty: "Nessuna camminata",
        time: "3 min in scooter / 15 min a piedi",
        tags: ["Piattaforme", "Tuffi", "Acqua Cristallina"],
        day: 8
    }
];

const itinerary = {
    1: {
        title: "Arrivo & Primo Tramonto",
        date: "Giovedì, 23 Luglio 2026",
        mapFocus: [40.007, 3.800],
        mapZoom: 14,
        schedule: [
            { time: "17:30", title: "Arrivo in Aeroporto", desc: "Atterraggio a Mahón (MAH). Ritiro bagagli.", icon: "plane-landing", type: "transport" },
            { time: "18:15", title: "Shared Shuttle Transfer", desc: "Trasferimento condiviso dall'aeroporto a Cala'n Blanes (circa 50-60 min). Rilassati e goditi i primi scorci dell'isola.", icon: "bus", type: "transport" },
            { time: "19:15", title: "Check-in Hotel", desc: "Arrivo al RVHotels Sea Club Menorca. Sistemazione in camera e inizio vacanza.", icon: "hotel", type: "hotel" },
            { time: "20:00", title: "Passeggiata al Pont d'en Gil", desc: "Cammina fino a questa scogliera spettacolare (15 min a piedi dall'hotel). Qui vedrai uno dei tramonti più famosi di Minorca, con il sole che cala dietro un arco naturale di roccia.", icon: "sunset", type: "sightseeing", coords: [40.0108, 3.7925] },
            { time: "21:00", title: "Cena in Hotel", desc: "Prima cena inclusa nel trattamento di Mezza Pensione presso il ristorante a buffet del Sea Club.", icon: "utensils", type: "hotel" }
        ]
    },
    2: {
        title: "Noleggio Scooter & Calette del Sud",
        date: "Venerdì, 24 Luglio 2026",
        mapFocus: [39.965, 3.860],
        mapZoom: 12,
        schedule: [
            { time: "08:30", title: "Colazione in Hotel", desc: "Carica le energie con il buffet della colazione.", icon: "coffee", type: "hotel" },
            { time: "09:30", title: "Ritiro Scooter 125cc", desc: "Noleggio dello scooter a Cala'n Blanes. Firma del contratto, caschi e check iniziale dello scooter.", icon: "bike", type: "scooter" },
            { time: "10:15", title: "Cala Turqueta", desc: "Prima spiaggia della vacanza! Guida verso sud-ovest (32 min). La spiaggia è magnifica. Ricorda che lo scooter ti garantisce di trovare posto facilmente.", icon: "palmtree", type: "beach", beachId: "turqueta" },
            { time: "16:30", title: "Esplorazione Ciutadella", desc: "Sulla via del ritorno, fermati nell'antica capitale. Passeggia tra le vie medievali, visita il porto storico e ammira la Cattedrale di Santa Maria.", icon: "compass", type: "sightseeing", coords: [40.0022, 3.8407] },
            { time: "20:30", title: "Cena Speciale a Ciutadella", desc: "Cena fuori in uno dei rinomati ristoranti sul porto di Ciutadella (consigliato Café Balear o S'Amarador per pesce fresco, o Es Tast de na Silvia per cucina tipica minorchina). Prenota con largo anticipo!", icon: "utensils", type: "sightseeing", coords: [40.0022, 3.8407] }
        ]
    },
    3: {
        title: "Rocce Rosse & Fornells",
        date: "Sabato, 25 Luglio 2026",
        mapFocus: [40.065, 4.090],
        mapZoom: 12,
        schedule: [
            { time: "08:30", title: "Colazione", desc: "Colazione a buffet in hotel.", icon: "coffee", type: "hotel" },
            { time: "09:30", title: "Rotta verso Nord: Cala Pregonda", desc: "Guida verso il nord selvaggio dell'isola (circa 42 min). Parcheggia a Binimel-là ed effettua il bellissimo cammino a piedi (20 min) sul sentiero Camí de Cavalls fino a Cala Pregonda.", icon: "palmtree", type: "beach", beachId: "pregonda" },
            { time: "14:30", title: "Pranzo a Fornells", desc: "Visita questo tipico villaggio di pescatori dalle case bianche. Se vuoi viziarvi, assaggia la leggendaria Caldereta de Langosta (zuppa d'aragosta).", icon: "utensils", type: "sightseeing", coords: [40.0573, 4.1311] },
            { time: "17:00", title: "Faro di Cavalleria", desc: "Guida fino all'estremo nord. Scogliere alte 90 metri e panorama selvaggio. Visita la caverna naturale vicina al faro.", icon: "compass", type: "sightseeing", coords: [40.0883, 4.0911] },
            { time: "20:30", title: "Cena in Hotel", desc: "Cena a buffet e relax a bordo piscina.", icon: "utensils", type: "hotel" }
        ]
    },
    4: {
        title: "Il Gioiello del Sud: Cala Mitjana",
        date: "Domenica, 26 Luglio 2026",
        mapFocus: [39.940, 3.960],
        mapZoom: 12,
        schedule: [
            { time: "08:30", title: "Colazione", desc: "Colazione in hotel.", icon: "coffee", type: "hotel" },
            { time: "09:30", title: "Cala Mitjana & Mitjaneta", desc: "35 min di scooter verso la costa sud. Una baia mozzafiato protetta da pini. Goditi i riflessi turchesi e l'ombra naturale della pineta.", icon: "palmtree", type: "beach", beachId: "mitjana" },
            { time: "13:30", title: "Trek a Cala Trebalúger", desc: "Per i più avventurosi: un sentiero sul Camí de Cavalls parte da Cala Mitjana e porta in 35-40 min a Cala Trebalúger, una spiaggia vergine e isolatissima dove sfocia un piccolo fiume.", icon: "navigation", type: "sightseeing", coords: [39.9322, 3.9877] },
            { time: "18:00", title: "Rientro in Hotel", desc: "Tempo per rilassarsi in camera o godersi il solarium dell'hotel.", icon: "hotel", type: "hotel" },
            { time: "20:30", title: "Cena", desc: "Cena e pernottamento.", icon: "utensils", type: "hotel" }
        ]
    },
    5: {
        title: "Dune Selvagge & Tramonto a Punta Nati",
        date: "Lunedì, 27 Luglio 2026",
        mapFocus: [40.040, 3.860],
        mapZoom: 12,
        schedule: [
            { time: "09:00", title: "Colazione in Hotel", desc: "Fai colazione con calma.", icon: "coffee", type: "hotel" },
            { time: "10:00", title: "Cala Algaiarens (La Vall)", desc: "Spiaggia magnifica nel nord-ovest. Più vicina e facile da raggiungere in scooter (20 min). Sabbia fine e mare calmo se soffia vento da sud.", icon: "palmtree", type: "beach", beachId: "algaiarens" },
            { time: "16:00", title: "Relax in Hotel / Pool Time", desc: "Rientro in hotel per un bagno in piscina e relax pomeridiano.", icon: "hotel", type: "hotel" },
            { time: "19:30", title: "Sunset a Punta Nati", desc: "Prendi lo scooter per una breve corsa (10 min) verso il Faro di Punta Nati. Un paesaggio arido, roccioso, costellato di vecchie capanne in pietra (barracas). Il tramonto qui è spettacolare e selvaggio.", icon: "sunset", type: "sightseeing", coords: [40.0483, 3.8239] },
            { time: "21:00", title: "Cena tardiva", desc: "Cena a buffet in hotel.", icon: "utensils", type: "hotel" }
        ]
    },
    6: {
        title: "La Distesa di Sabbia di Son Saura",
        date: "Martedì, 28 Luglio 2026",
        mapFocus: [39.940, 3.880],
        mapZoom: 12,
        schedule: [
            { time: "08:30", title: "Colazione in Hotel", desc: "Inizia la giornata.", icon: "coffee", type: "hotel" },
            { time: "09:30", title: "Son Saura", desc: "Guida per 28 minuti fino a questa enorme spiaggia doppia nel sud. La sabbia è bianchissima e l'acqua ha sfumature incredibili. C'è anche una pineta protetta alle spalle.", icon: "palmtree", type: "beach", beachId: "saura" },
            { time: "16:30", title: "Passeggiata Rurale", desc: "Rientrando con lo scooter, percorri le pittoresche strade rurali delimitate dai caratteristici muretti a secco minorchini (paredes secas).", icon: "bike", type: "scooter" },
            { time: "20:30", title: "Cena in Hotel", desc: "Cena a buffet dell'hotel.", icon: "utensils", type: "hotel" }
        ]
    },
    7: {
        title: "Favàritx & Spiagge del Parco Naturale",
        date: "Mercoledì, 29 Luglio 2026",
        mapFocus: [39.960, 4.180],
        mapZoom: 11,
        schedule: [
            { time: "08:00", title: "Colazione anticipata", desc: "Colazione presto per affrontare la giornata più lunga.", icon: "coffee", type: "hotel" },
            { time: "08:45", title: "Grande Viaggio a Est: Cala Presili", desc: "Un tragitto panoramico attraverso l'isola fino alla punta nord-est (48 min di scooter). Parcheggia vicino al faro e cammina sul Camí de Cavalls fino a Cala Presili, una spiaggia selvaggia e magnifica con vista sul faro.", icon: "palmtree", type: "beach", beachId: "presili" },
            { time: "15:00", title: "Faro di Favàritx", desc: "Esplora lo spettacolare paesaggio lunare circostante il faro. Scogliere di lavagna scura e onde impetuose.", icon: "compass", type: "sightseeing", coords: [39.9983, 4.2655] },
            { time: "17:00", title: "Breve sosta a Mahón", desc: "Visita veloce della capitale e del suo porto naturale, il secondo più grande d'Europa.", icon: "compass", type: "sightseeing", coords: [39.8890, 4.2625] },
            { time: "20:30", title: "Cena di fine viaggio", desc: "Ultima cena a buffet in hotel, celebrando la splendida settimana trascorsa.", icon: "utensils", type: "hotel" }
        ]
    },
    8: {
        title: "Tuffi a Cala en Brut & Rientro",
        date: "Giovedì, 30 Luglio 2026",
        mapFocus: [40.0039, 3.8011],
        mapZoom: 14,
        schedule: [
            { time: "08:30", title: "Ultima Colazione", desc: "Fai colazione e prepara i bagagli.", icon: "coffee", type: "hotel" },
            { time: "09:30", title: "Tuffi a Cala en Brut", desc: "Prendi lo scooter per un'ultima corsa (3 minuti). Cala en Brut ha fantastiche piattaforme in cemento da cui tuffarsi nell'acqua color smeraldo. Divertimento puro!", icon: "palmtree", type: "beach", beachId: "brut" },
            { time: "11:30", title: "Riconsegna Scooter", desc: "Riconsegna lo scooter noleggiato entro le ore 12:00 in agenzia.", icon: "bike", type: "scooter" },
            { time: "12:30", title: "Relax in Hotel / Pranzo leggero", desc: "Deposita i bagagli in reception. Goditi le ultime ore a bordo piscina dell'hotel.", icon: "hotel", type: "hotel" },
            { time: "15:15", title: "Shuttle Transfer per Aeroporto", desc: "Lo shuttle condiviso vi raccoglie in hotel per portarvi all'aeroporto (ritrovo circa 2.5/3 ore prima del volo).", icon: "bus", type: "transport" },
            { time: "18:00", title: "Volo di Rientro", desc: "Decollo del volo per l'Italia. Fine del viaggio da sogno a Minorca!", icon: "plane-departure", type: "transport" }
        ]
    }
};
