// Stato globale
let player = { name: '', credits: 10000000, bids: {} }; // 10M banane
let characters = []; // Tutti i personaggi
let filteredCharacters = []; // Personaggi filtrati/ordinati
let sortColumn = null; // Colonna corrente per ordinamento
let sortDirection = 'asc'; // Direzione: 'asc' o 'desc'

// Inizializzazione pagina
document.addEventListener('DOMContentLoaded', () => {
    fetch('data/characters.json')
        .then(response => {
            if (!response.ok) throw new Error('Errore nel caricamento di characters.json');
            return response.json();
        })
        .then(data => {
            characters = data;
            filteredCharacters = [...data]; // Copia iniziale
            updatePlayerInfo();
            updateCharacterList();
        })
        .catch(error => {
            console.error('Errore:', error);
            alert('Impossibile caricare i personaggi. Verifica che data/characters.json esista.');
        });
});

// Imposta il nome del giocatore
function setPlayerName() {
    const nameInput = document.getElementById('player-name-input').value.trim();
    if (!nameInput) {
        alert('Inserisci un nome valido!');
        return;
    }
    player.name = nameInput;
    document.getElementById('player-name-input').disabled = true;
    document.querySelector('button[onclick="setPlayerName()"]').disabled = true;
    document.getElementById('save-bids-btn').disabled = false;
    updatePlayerInfo();
}

// Aggiorna informazioni del giocatore
function updatePlayerInfo() {
    document.getElementById('player-name').textContent = player.name || 'Nessuno';
    const totalSpent = Object.values(player.bids).reduce((sum, bid) => sum + (bid || 0), 0);
    document.getElementById('credits').textContent = (player.credits - totalSpent).toLocaleString('it-IT');
}

// Filtra personaggi per posizione e nome
function filterCharacters() {
    const positionFilter = document.getElementById('position-filter').value;
    const nameFilter = document.getElementById('name-filter').value.toLowerCase();

    filteredCharacters = characters.filter(character => {
        const matchesPosition = !positionFilter || character.suggestedPosition === positionFilter;
        const matchesName = !nameFilter || character.name.toLowerCase().includes(nameFilter);
        return matchesPosition && matchesName;
    });

    // Mantieni ordinamento se attivo
    if (sortColumn) {
        sortCharacters(sortColumn, sortDirection);
    }

    updateCharacterList();
}

// Ordina tabella per colonna
function sortTable(column) {
    // Toggle direzione se stessa colonna
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    sortCharacters(column, sortDirection);
    updateCharacterList();

    // Aggiorna stile intestazioni
    document.querySelectorAll('th').forEach(th => {
        th.classList.remove('asc', 'desc');
        if (th.getAttribute('data-sort') === column) {
            th.classList.add(sortDirection);
        }
    });
}

// Funzione di ordinamento
function sortCharacters(column, direction) {
    filteredCharacters.sort((a, b) => {
        let valueA = a[column] || '';
        let valueB = b[column] || '';

        // Ordinamento per stringhe
        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
            return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }

        // Ordinamento numerico
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
    });
}

// Aggiorna lista personaggi
function updateCharacterList() {
    const characterList = document.getElementById('characters');
    characterList.innerHTML = '';
    filteredCharacters.forEach(character => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${character.name}</td>
            <td>${character.suggestedPosition || 'Nessuna'}</td>
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
        alert('L\'offerta non può essere negativa!');
        return;
    }
    const totalSpent = Object.values(player.bids).reduce((sum, b) => sum + (b || 0), 0) - (player.bids[characterId] || 0) + bid;
    if (totalSpent > player.credits) {
        alert('Non hai abbastanza banane!');
        return;
    }
    player.bids[characterId] = bid;
    updatePlayerInfo();
}

// Salva offerte in file JSON
function saveBids() {
    if (!player.name) {
        alert('Inserisci prima il tuo nome!');
        return;
    }
    const bidData = {
        playerName: player.name,
        bids: player.bids
    };
    const jsonStr = JSON.stringify(bidData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${player.name}_bids.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Carica e confronta file JSON
function loadAndCompareBids() {
    const fileInput = document.getElementById('json-files');
    const files = fileInput.files;
    if (files.length === 0) {
        alert('Carica almeno un file JSON!');
        return;
    }

    const resultsDiv = document.getElementById('auction-results');
    resultsDiv.innerHTML = '<h3>Risultati Aste</h3>';
    const allBids = [];
    let filesProcessed = 0;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
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

// Calcola risultati asta con limite di 10 personaggi
function computeAuctionResults(allBids) {
    const resultsDiv = document.getElementById('auction-results');
    const winners = {};
    const playerAssignments = {};
    const playerPotentialWins = {};

    // Inizializza strutture
    allBids.forEach(bid => {
        playerAssignments[bid.playerName] = [];
        playerPotentialWins[bid.playerName] = [];
    });

    // Determina vincitori iniziali per ogni personaggio
    characters.forEach(character => {
        const bids = allBids
            .map(bid => ({
                player: bid.playerName,
                amount: bid.bids[character.id] || 0,
                character
            }))
            .filter(bid => bid.amount > 0)
            .sort((a, b) => b.amount - a.amount);

        if (bids.length === 0) return;

        // Controlla se l'offerta più alta è unica
        const topBid = bids[0];
        const isUnique = bids.length === 1 || bids[0].amount > bids[1].amount;
        if (isUnique) {
            playerPotentialWins[topBid.player].push({
                character: topBid.character,
                bid: topBid.amount
            });
        }
    });

    // Assegna i migliori 10 personaggi per ogni giocatore
    for (const player of Object.keys(playerPotentialWins)) {
        // Ordina le vittorie potenziali per offerta decrescente
        const wins = playerPotentialWins[player].sort((a, b) => b.bid - a.bid);
        // Prendi solo i primi 10
        const assignedWins = wins.slice(0, 10);
        assignedWins.forEach(win => {
            winners[win.character.id] = {
                player,
                bid: win.bid,
                character: win.character
            };
            playerAssignments[player].push({
                character: win.character.name,
                bid: win.bid,
                position: win.character.suggestedPosition
            });
        });
    }

    // Mostra risultati
    const ul = document.createElement('ul');
    for (const [charId, result] of Object.entries(winners)) {
        const li = document.createElement('li');
        li.textContent = `${result.character.name} (${result.character.suggestedPosition || 'Nessuna'}) assegnato a ${result.player} per ${result.bid.toLocaleString('it-IT')} banane`;
        ul.appendChild(li);
    }
    resultsDiv.appendChild(ul);

    // Mostra riepilogo squadre
    const summary = document.createElement('div');
    summary.innerHTML = '<h4>Riepilogo Squadre</h4>';
    for (const [player, assignments] of Object.entries(playerAssignments)) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${player}</strong> (${assignments.length}/10 personaggi): ${assignments.length > 0 ? assignments.map(a => `${a.character} (${a.bid.toLocaleString('it-IT')} banane)`).join(', ') : 'Nessun personaggio assegnato'}`;
        summary.appendChild(p);
    }
    resultsDiv.appendChild(summary);
}
