// Carica personaggi (sottoinsieme per brevità)
const characters = [
    {"id":297,"name":"Rupert","speed":7,"kickPower":8,"heading":8,"sliding":8,"technique":9,"stamina":8,"strength":7,"catching":7,"total":62,"outfieldNoCNoSta":47,"outfieldNoC":55,"keeper":14,"suggestedPosition":"Defender"},
    {"id":282,"name":"Manuel","speed":8,"kickPower":8,"heading":8,"sliding":7,"technique":9,"stamina":7,"strength":7,"catching":7,"total":61,"outfieldNoCNoSta":47,"outfieldNoC":54,"keeper":14,"suggestedPosition":"Midfield"},
    {"id":103,"name":"Chris","speed":7,"kickPower":7,"heading":7,"sliding":8,"technique":7,"stamina":9,"strength":7,"catching":8,"total":60,"outfieldNoCNoSta":43,"outfieldNoC":52,"keeper":15,"suggestedPosition":""},
    {"id":81,"name":"Ledski","speed":9,"kickPower":7,"heading":9,"sliding":7,"technique":5,"stamina":9,"strength":6,"catching":8,"total":60,"outfieldNoCNoSta":43,"outfieldNoC":52,"keeper":14,"suggestedPosition":"Striker"},
    {"id":288,"name":"Boxer","speed":6,"kickPower":7,"heading":6,"sliding":6,"technique":9,"stamina":9,"strength":9,"catching":7,"total":59,"outfieldNoCNoSta":43,"outfieldNoC":52,"keeper":16,"suggestedPosition":""}
];

// Stato del giocatore
let player = { name: '', credits: 5000, bids: {} };

// Inizializza la pagina
document.addEventListener("DOMContentLoaded", () => {
    updatePlayerInfo();
    updateCharacterList();
});

// Imposta nome del giocatore
function setPlayerName() {
    const nameInput = document.getElementById("player-name-input").value.trim();
    if (nameInput) {
        player.name = nameInput;
        document.getElementById("player-name-input").disabled = true;
        document.querySelector("button[onclick='setPlayerName()']").disabled = true;
        document.getElementById("save-bids-btn").disabled = false;
        updatePlayerInfo();
    } else {
        alert("Inserisci un nome valido!");
    }
}

// Aggiorna informazioni giocatore
function updatePlayerInfo() {
    document.getElementById("player-name").textContent = player.name || "Nessuno";
    document.getElementById("credits").textContent = player.credits;
}

// Aggiorna lista personaggi
function updateCharacterList() {
    const characterList = document.getElementById("characters");
    characterList.innerHTML = "";
    characters.forEach(character => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${character.name}</td>
            <td>${character.suggestedPosition || "Nessuna"}</td>
            <td>${character.total}</td>
            <td>${character.speed}</td>
            <td>${character.kickPower}</td>
            <td>${character.heading}</td>
            <td>${character.sliding}</td>
            <td>${character.technique}</td>
            <td>${character /

System: Sembra che il messaggio si sia interrotto durante la fornitura del codice per `script.js`. Completerò il file `script.js` in modo coerente con le specifiche richieste, includendo la logica per:
- Visualizzare i personaggi con un campo per l'offerta.
- Salvare le offerte in un file JSON.
- Caricare e confrontare i file JSON per determinare i vincitori.

### **script.js (Completato)**
```javascript
// Carica personaggi (sottoinsieme per brevità)
const characters = [
    {"id":297,"name":"Rupert","speed":7,"kickPower":8,"heading":8,"sliding":8,"technique":9,"stamina":8,"strength":7,"catching":7,"total":62,"outfieldNoCNoSta":47,"outfieldNoC":55,"keeper":14,"suggestedPosition":"Defender"},
    {"id":282,"name":"Manuel","speed":8,"kickPower":8,"heading":8,"sliding":7,"technique":9,"stamina":7,"strength":7,"catching":7,"total":61,"outfieldNoCNoSta":47,"outfieldNoC":54,"keeper":14,"suggestedPosition":"Midfield"},
    {"id":103,"name":"Chris","speed":7,"kickPower":7,"heading":7,"sliding":8,"technique":7,"stamina":9,"strength":7,"catching":8,"total":60,"outfieldNoCNoSta":43,"outfieldNoC":52,"keeper":15,"suggestedPosition":""},
    {"id":81,"name":"Ledski","speed":9,"kickPower":7,"heading":9,"sliding":7,"technique":5,"stamina":9,"strength":6,"catching":8,"total":60,"outfieldNoCNoSta":43,"outfieldNoC":52,"keeper":14,"suggestedPosition":"Striker"},
    {"id":288,"name":"Boxer","speed":6,"kickPower":7,"heading":6,"sliding":6,"technique":9,"stamina":9,"strength":9,"catching":7,"total":59,"outfieldNoCNoSta":43,"outfieldNoC":52,"keeper":16,"suggestedPosition":""}
];

// Stato del giocatore
let player = { name: '', credits: 5000, bids: {} };

// Inizializza la pagina
document.addEventListener("DOMContentLoaded", () => {
    updatePlayerInfo();
    updateCharacterList();
});

// Imposta nome del giocatore
function setPlayerName() {
    const nameInput = document.getElementById("player-name-input").value.trim();
    if (nameInput) {
        player.name = nameInput;
        document.getElementById("player-name-input").disabled = true;
        document.querySelector("button[onclick='setPlayerName()']").disabled = true;
        document.getElementById("save-bids-btn").disabled = false;
        updatePlayerInfo();
    } else {
        alert("Inserisci un nome valido!");
    }
}

// Aggiorna informazioni giocatore
function updatePlayerInfo() {
    document.getElementById("player-name").textContent = player.name || "Nessuno";
    const totalSpent = Object.values(player.bids).reduce((sum, bid) => sum + (bid || 0), 0);
    document.getElementById("credits").textContent = player.credits - totalSpent;
}

// Aggiorna lista personaggi
function updateCharacterList() {
    const characterList = document.getElementById("characters");
    characterList.innerHTML = "";
    characters.forEach(character => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${character.name}</td>
            <td>${character.suggestedPosition || "Nessuna"}</td>
            <td>${character.total}</td>
            <td>${character.speed}</td>
            <td>${character.kickPower}</td>
            <td>${character.heading}</td>
            <td>${character.sliding}</td>
            <td>${character.technique}</td>
            <td>${character.stamina}</td>
            <td>${character.strength}</td>
            <td>${character.catching}</td>
            <td>
                <input type="number" min="0" placeholder="Offerta" 
                       onchange="updateBid(${character.id}, this.value)"
                       value="${player.bids[character.id] || ''}">
            </td>
        `;
        characterList.appendChild(tr);
    });
    updatePlayerInfo();
}

// Aggiorna offerta per un personaggio
function updateBid(characterId, value) {
    const bid = parseInt(value) || 0;
    if (bid < 0) {
        alert("L'offerta non può essere negativa!");
        return;
    }
    const totalSpent = Object.values(player.bids).reduce((sum, b) => sum + (b || 0), 0) - (player.bids[characterId] || 0) + bid;
    if (totalSpent > player.credits) {
        alert("Non hai abbastanza crediti!");
        return;
    }
    player.bids[characterId] = bid;
    updatePlayerInfo();
}

// Salva offerte in un file JSON
function saveBids() {
    if (!player.name) {
        alert("Inserisci prima il tuo nome!");
        return;
    }
    const bidData = {
        playerName: player.name,
        bids: player.bids
    };
    const jsonStr = JSON.stringify(bidData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${player.name}_bids.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Carica e confronta file JSON
function loadAndCompareBids() {
    const fileInput = document.getElementById("json-files");
    const files = fileInput.files;
    if (files.length === 0) {
        alert("Carica almeno un file JSON!");
        return;
    }

    const resultsDiv = document.getElementById("auction-results");
    resultsDiv.innerHTML = "<h3>Risultati Aste</h3>";
    const allBids = [];
    let filesProcessed = 0;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.playerName && data.bids) {
                    allBids.push(data);
                } else {
                    alert(`File ${file.name} non valido!`);
                }
            } catch (err) {
                alert(`Errore nel leggere ${file.name}: ${err.message}`);
            }
            filesProcessed++;
            if (filesProcessed === files.length) {
                computeAuctionResults(allBids);
            }
        };
        reader.readAsText(file);
    });
}

// Calcola i vincitori delle aste
function computeAuctionResults(allBids) {
    const resultsDiv = document.getElementById("auction-results");
    const winners = {};
    const playerAssignments = {};

    // Inizializza assegnazioni per ogni giocatore
    allBids.forEach(bid => {
        playerAssignments[bid.playerName] = [];
    });

    // Determina il vincitore per ogni personaggio
    characters.forEach(character => {
        let maxBid = 0;
        let winner = null;
        allBids.forEach(bid => {
            const bidAmount = bid.bids[character.id] || 0;
            if (bidAmount > maxBid) {
                maxBid = bidAmount;
                winner = bid.playerName;
            } else if (bidAmount === maxBid && bidAmount > 0) {
                winner = null; // Pareggio
            }
        });
        if (winner && maxBid > 0) {
            winners[character.id] = { player: winner, bid: maxBid, character };
            playerAssignments[winner].push({ character: character.name, bid: maxBid, position: character.suggestedPosition });
        }
    });

    // Mostra risultati
    const ul = document.createElement("ul");
    for (const [charId, result] of Object.entries(winners)) {
        const li = document.createElement("li");
        li.textContent = `${result.character.name} (${result.character.suggestedPosition || "Nessuna"}) assegnato a ${result.player} per ${result.bid} crediti`;
        ul.appendChild(li);
    }
    resultsDiv.appendChild(ul);

    // Mostra riepilogo per giocatore
    const summary = document.createElement("div");
    summary.innerHTML = "<h4>Riepilogo Squadre</h4>";
    for (const [player, assignments] of Object.entries(playerAssignments)) {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${player}</strong>: ${assignments.length > 0 ? assignments.map(a => `${a.character} (${a.bid} crediti)`).join(", ") : "Nessun personaggio assegnato"}`;
        summary.appendChild(p);
    }
    resultsDiv.appendChild(summary);
}
