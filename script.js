// Stato globale
let player = { name: '', credits: 21000000, bids: {} };
let characters = [];
let filteredCharacters = [];
let sortColumn = null;
let sortDirection = 'asc';

// Inizializzazione pagina
document.addEventListener('DOMContentLoaded', () => {
    fetch('scimmie.csv')
        .then(response => {
            if (!response.ok) throw new Error('File non trovato');
            return response.text();
        })
        .then(csvData => {
            parseCSV(csvData);
            updateCharacterList();
        })
        .catch(error => {
            console.error('Errore:', error);
            alert('Errore nel caricamento scimmie.csv: ' + error.message);
        });
});

// Parsing del CSV (rimane identico alla versione precedente)
function parseCSV(csvData) {
    const rows = csvData.split('\n').filter(row => row.trim() !== '');
    const headers = rows[0].split(',').map(h => h.trim());
    
    characters = rows.slice(1).map(row => {
        const cells = row.split(',');
        const char = {};
        
        headers.forEach((header, index) => {
            let value = cells[index]?.trim() || '';
            const numericValue = parseInt(value, 10);
            
            switch(header) {
                case 'id': char.id = numericValue; break;
                case 'name': char.name = value; break;
                case 'speed': char.speed = numericValue; break;
                case 'Kick P': char.kickPower = numericValue; break;
                case 'Heading': char.heading = numericValue; break;
                case 'Sliding': char.sliding = numericValue; break;
                case 'Technique': char.technique = numericValue; break;
                case 'Stamina': char.stamina = numericValue; break;
                case 'Strength': char.strength = numericValue; break;
                case 'Catching': char.catching = numericValue; break;
                case 'Total': char.total = numericValue; break;
            }
        });
        
        return char;
    });
    
    filteredCharacters = [...characters];
}


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

// Filtra personaggi per nome
function filterCharacters() {
    const nameFilter = document.getElementById('name-filter').value.toLowerCase();
    filteredCharacters = characters.filter(character => 
        character.name.toLowerCase().includes(nameFilter)
    );
    if (sortColumn) sortCharacters(sortColumn, sortDirection);
    updateCharacterList();
}

// Ordina tabella per colonna
function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    sortCharacters(column, sortDirection);
    updateCharacterList();

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

        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
            return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }

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

// Calcola risultati asta
function computeAuctionResults(allBids) {
    const resultsDiv = document.getElementById('auction-results');
    resultsDiv.innerHTML = '<h3>Risultati Aste</h3>';
    const winners = {};
    const playerAssignments = {};
    const playerPotentialWins = {};

    allBids.forEach(bid => {
        playerAssignments[bid.playerName] = [];
        playerPotentialWins[bid.playerName] = [];
    });

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

        const topBid = bids[0];
        const isUnique = bids.length === 1 || bids[0].amount > bids[1].amount;
        if (isUnique) {
            playerPotentialWins[topBid.player].push({
                character: topBid.character,
                bid: topBid.amount
            });
        }
    });

    for (const player of Object.keys(playerPotentialWins)) {
        const wins = playerPotentialWins[player].sort((a, b) => b.bid - a.bid);
        const assignedWins = wins.slice(0, 10);
        assignedWins.forEach(win => {
            winners[win.character.id] = {
                player,
                bid: win.bid,
                character: win.character
            };
            playerAssignments[player].push({
                id: win.character.id,
                character: win.character.name,
                bid: win.bid
            });
        });
    }

    const ul = document.createElement('ul');
    for (const [charId, result] of Object.entries(winners)) {
        const li = document.createElement('li');
        li.textContent = `ID: ${result.character.id} - ${result.character.name} assegnato a ${result.player} per ${result.bid.toLocaleString('it-IT')} banane`;
        ul.appendChild(li);
    }
    resultsDiv.appendChild(ul);

    const summary = document.createElement('div');
    summary.innerHTML = '<h4>Riepilogo Squadre</h4>';
    for (const [player, assignments] of Object.entries(playerAssignments)) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${player}</strong> (${assignments.length}/10 personaggi): ${assignments.length > 0 ? assignments.map(a => `ID: ${a.id} - ${a.character}`).join(', ') : 'Nessun personaggio assegnato'}`;
        summary.appendChild(p);
    }
    resultsDiv.appendChild(summary);

    const exportButton = document.createElement('button');
    exportButton.textContent = 'Esporta Squadre in JSON';
    exportButton.onclick = () => exportTeams(playerAssignments);
    resultsDiv.appendChild(exportButton);
}

// Esporta le squadre in JSON
function exportTeams(playerAssignments) {
    const teamsData = {
        teams: Object.entries(playerAssignments).map(([playerName, assignments]) => ({
            player: playerName,
            characters: assignments.map(a => ({
                id: a.id,
                name: a.character,
                bid: a.bid
            }))
        })),
        timestamp: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(teamsData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teams_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
