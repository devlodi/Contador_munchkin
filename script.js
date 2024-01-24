let players = JSON.parse(localStorage.getItem('players')) || [];
let logs = JSON.parse(localStorage.getItem('logs')) || [];

function getContrastYIQ(color){
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

function updateLocalStorage() {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('logs', JSON.stringify(logs));
}

function addPlayer() {
    const playerName = document.getElementById('playerName').value;
    const playerColor = document.getElementById('playerColor').value;
    if (playerName && playerColor) { // Verifica se ambos, nome e cor, são fornecidos
        players.push({ name: playerName, level: 1, strength: 0, color: playerColor });
        updateLocalStorage();
        updatePlayersList();
        logs.push(`Added player: ${playerName} with color ${playerColor}`);
        document.getElementById('playerName').value = '';
        document.getElementById('playerColor').value = '#ffffff'; // Reset para a cor padrão após adicionar
    } else {
        // Você pode querer adicionar alguma mensagem de erro aqui para o usuário
        console.error('Player name or color is missing');
    }
}

function updatePlayersList() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    players.forEach((player, index) => {
        // Certifique-se de que a cor está definida, caso contrário, defina um valor padrão
        const playerColor = player.color || '#ffffff';
        const textColor = getContrastYIQ(playerColor);
        
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.style.backgroundColor = playerColor;
        playerDiv.style.color = textColor;
        playerDiv.innerHTML = `
            <span>${player.name} - Level: ${player.level} - Strength: ${player.strength}</span>
            <div>
                <button onclick="editAttribute(${index}, 'level', 1)">+1 Level</button>
                <button onclick="editAttribute(${index}, 'level', -1)">-1 Level</button>
                <button onclick="editAttribute(${index}, 'strength', 1)">+1 Strength</button>
                <button onclick="editAttribute(${index}, 'strength', -1)">-1 Strength</button>
                <button onclick="removePlayer(${index})">Remove</button>
            </div>
        `;
        playersList.appendChild(playerDiv);
    });
}


function resetScores() {
    // Mostra uma caixa de diálogo de confirmação antes de resetar os scores
    const confirmReset = confirm("Are you sure you want to reset all scores?");
    if (confirmReset) {
        players = players.map(player => ({ ...player, level: 1, strength: 0 }));
        updateLocalStorage();
        updatePlayersList();
        logs.push("Scores reset for all players.");
    }
}


function clearLogs() {
    // Mostra uma caixa de diálogo de confirmação antes de limpar os logs
    const confirmClear = confirm("Are you sure you want to clear all logs?");
    if (confirmClear) {
        logs = [];
        updateLocalStorage();
        document.getElementById('logs').innerHTML = '';
    }
}


function editAttribute(index, attribute, amount) {
    players[index][attribute] += amount;
    if (players[index][attribute] < 0) players[index][attribute] = 0; // Evitar valores negativos
    updateLocalStorage();
    updatePlayersList();
    logs.push(`Edited ${attribute} of ${players[index].name}, ${amount > 0 ? '+' : ''}${amount}`);
}

function removePlayer(index) {
    const player = players[index];
    // Mostra uma caixa de diálogo de confirmação antes de excluir o jogador
    const confirmDelete = confirm(`Are you sure you want to remove ${player.name}?`);
    if (confirmDelete) {
        logs.push(`Removed player: ${player.name}`);
        players.splice(index, 1);
        updateLocalStorage();
        updatePlayersList();
    }
}

function confirmColor() {
    const color = document.getElementById('playerColor').value;
    document.getElementById('colorPreview').style.backgroundColor = color;
}

function showLogs() {
    const logsDiv = document.getElementById('logs');
    if (logsDiv.style.display === 'block') {
        logsDiv.style.display = 'none';
    } else {
        logsDiv.style.display = 'block';
        logsDiv.innerHTML = '<h2>Logs</h2>';
        logs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.innerText = log;
            logsDiv.appendChild(logEntry);
        });
    }
}

updatePlayersList();
