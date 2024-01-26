

// Variável global para armazenar o ID da sala atual
let currentRoomId = null;

// Eventos para abrir e fechar modais
document.getElementById('createRoomBtn').addEventListener('click', function() {
    document.getElementById('createRoomModal').classList.add('show');
});

document.getElementById('joinRoomBtn').addEventListener('click', function() {
    document.getElementById('joinRoomModal').classList.add('show');
});

// Eventos para fechar modais pelo botão de fechar ou clicando fora do modal
document.querySelectorAll('.modal .close').forEach(closeButton => {
    closeButton.addEventListener('click', function() {
        closeButton.closest('.modal').classList.remove('show');
    });
});

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});

// Criação da sala
document.getElementById('createRoomForm').addEventListener('submit', function(e) {
    e.preventDefault();
    createRoom();
});

// Entrar na sala
document.getElementById('joinRoomForm').addEventListener('submit', function(e) {
    e.preventDefault();
    joinRoom();
});

// Função para criar uma nova sala
function createRoom() {
    var roomName = document.getElementById('roomName').value;
    var roomsRef = firebase.database().ref('rooms');

    roomsRef.orderByChild('name').equalTo(roomName).once('value', snapshot => {
        if (snapshot.exists()) {
            alert('Uma sala com este nome já existe. Escolha outro nome.');
        } else {
            var newRoomRef = roomsRef.push();
            newRoomRef.set({name: roomName}).then(() => {
                currentRoomId = newRoomRef.key;
                document.getElementById('playerManagementSection').style.display = 'block';
                document.getElementById('createRoomModal').classList.remove('show');
            }).catch(error => console.error('Erro ao criar sala:', error));
        }
    });
}

// Função para entrar em uma sala existente
function joinRoom() {
    var roomName = document.getElementById('roomNameJoin').value;
    var roomsRef = firebase.database().ref('rooms');

    roomsRef.orderByChild('name').equalTo(roomName).once('value', snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(roomSnapshot => {
                currentRoomId = roomSnapshot.key;
                document.getElementById('playerManagementSection').style.display = 'block';
                displayPlayersForRoom(currentRoomId);
                document.getElementById('joinRoomModal').classList.remove('show');
            });
        } else {
            console.log('Sala não encontrada');
        }
    }).catch(error => console.error('Erro ao entrar na sala:', error));
}

// Função para mostrar os jogadores de uma sala e seus pontos
function displayPlayersForRoom(roomId) {
    var playersRef = firebase.database().ref('rooms/' + roomId + '/players');
    var playersList = document.getElementById('playersList');
    playersList.innerHTML = ''; // Limpa a lista de jogadores existente

    playersRef.once('value', snapshot => {
        snapshot.forEach(playerSnapshot => {
            var playerData = playerSnapshot.val();
            var playerId = playerSnapshot.key;
            // Use os valores de nível e força do banco de dados
            addPlayerBox(playerData.name, playerId, playerData.level, playerData.strength);
        });
    }).catch(error => console.error('Erro ao buscar jogadores:', error));
}


function addPlayer() {
    var playerName = document.getElementById('playerName').value;

    if (!currentRoomId) {
        console.error('ID da sala não definido. Certifique-se de que você está em uma sala.');
        return;
    }

    var playersRef = firebase.database().ref('rooms/' + currentRoomId + '/players');
    var newPlayerRef = playersRef.push();
    newPlayerRef.set({
        name: playerName,
        level: 1,
        strength: 1
    }).then(() => {
        addPlayerBox(playerName, newPlayerRef.key);
    }).catch(error => console.error('Erro ao adicionar jogador:', error));
}

// Função para adicionar a box do jogador na interface, incluindo nível e força
function addPlayerBox(playerName, playerId, level = 1, strength = 1) {
    var playerBox = document.createElement('div');
    playerBox.classList.add('player-box');
    playerBox.id = 'player-' + playerId;

    var nameDiv = document.createElement('div');
    nameDiv.classList.add('player-name');
    nameDiv.textContent = playerName;
    playerBox.appendChild(nameDiv);

    // Agora passamos os valores de 'level' e 'strength' para 'createStat'
    var levelStat = createStat('level', 'Nível', level, playerId);
    var strengthStat = createStat('strength', 'Força', strength, playerId);
    playerBox.appendChild(levelStat);
    playerBox.appendChild(strengthStat);

    document.getElementById('playersList').appendChild(playerBox);
}


// Função para criar o contador de nível e força
function createStat(statType, statName, initialValue, playerId) {
    var statDiv = document.createElement('div');
    statDiv.classList.add('stat', statType);

    var img = document.createElement('img');
    img.src = statType === 'level' ? 'https://raw.githubusercontent.com/devlodi/Contador_munchkin/main/Imagens/NIVEL.png' : 'https://raw.githubusercontent.com/devlodi/Contador_munchkin/main/Imagens/FOR%C3%87A.png';
    statDiv.appendChild(img);

    var decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.classList.add('decrease');
    statDiv.appendChild(decreaseButton);

    var statValue = document.createElement('span');
    statValue.textContent = initialValue;
    statDiv.appendChild(statValue);

    var increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.classList.add('increase');
    statDiv.appendChild(increaseButton);

    // Eventos para botões de aumentar e diminuir
    decreaseButton.addEventListener('click', function() {
        updateStat(statDiv, -1, playerId, statType);
    });

    increaseButton.addEventListener('click', function() {
        updateStat(statDiv, 1, playerId, statType);
    });

    return statDiv;
}

// Função para atualizar o nível e a força
function updateStat(statDiv, change, playerId, statType) {
    var valueSpan = statDiv.querySelector('span');
    var newValue = parseInt(valueSpan.textContent) + change;

    if (newValue >= 1) { // Garante que o valor não fique abaixo de 1
        valueSpan.textContent = newValue;
        
        // Atualiza o valor no Firebase
        var playerRef = firebase.database().ref('rooms/' + currentRoomId + '/players/' + playerId);
        var updateData = {};
        updateData[statType] = newValue;
        playerRef.update(updateData);
    }
}

// Função para adicionar a box do jogador na interface
function addPlayerBox(playerName, playerId, level = 1, strength = 1) {
    var playerBox = document.createElement('div');
    playerBox.classList.add('player-box');
    playerBox.id = 'player-' + playerId;

    var nameDiv = document.createElement('div');
    nameDiv.classList.add('player-name');
    nameDiv.textContent = playerName;
    playerBox.appendChild(nameDiv);

    var levelStat = createStat('level', 'Nível', level, playerId);
    var strengthStat = createStat('strength', 'Força', strength, playerId);
    playerBox.appendChild(levelStat);
    playerBox.appendChild(strengthStat);

    document.getElementById('playersList').appendChild(playerBox);
}

// Função para adicionar um jogador à sala
document.getElementById('addPlayerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var playerName = document.getElementById('playerName').value;

    if (!currentRoomId) {
        console.error('ID da sala não definido. Certifique-se de que você está em uma sala.');
        return;
    }

    var playersRef = firebase.database().ref('rooms/' + currentRoomId + '/players');
    var newPlayerRef = playersRef.push();
    newPlayerRef.set({
        name: playerName,
        level: 1,
        strength: 1
    }).then(() => {
        addPlayerBox(playerName, newPlayerRef.key, 1, 1);
    }).catch(error => console.error('Erro ao adicionar jogador:', error));
});


// ESCONDE HEADER

document.getElementById('toggleHeaderBtn').addEventListener('click', function() {
    var header = document.querySelector('header'); // Seleciona o cabeçalho
    var managementSection = document.getElementById('managementSection'); // Seleciona a seção de gerenciamento

    // Alternar a classe 'hidden' em ambos os elementos
    header.classList.toggle('hidden');
    managementSection.classList.toggle('hidden');

    // Atualizar o texto do botão com base na visibilidade do cabeçalho
    this.textContent = header.classList.contains('hidden') ? 'Mostrar⚙️sala ⮉' : 'Esconder⚙️sala ⮉';
});



