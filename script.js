


// Para abrir o modal sala
document.getElementById('createRoomBtn').addEventListener('click', function() {
    document.getElementById('createRoomModal').classList.add('show');
});

// Para fechar o modal sala
document.getElementById('createRoomModal').querySelector('.close').addEventListener('click', function() {
    document.getElementById('createRoomModal').classList.remove('show');
});


// Abrir o modal de entrada
document.getElementById('joinRoomBtn').addEventListener('click', function() {
    document.getElementById('joinRoomModal').classList.add('show');
});

// Fechar o modal de entrada
document.getElementById('joinRoomModal').querySelector('.close').addEventListener('click', function() {
    document.getElementById('joinRoomModal').classList.remove('show');
});

// Fechar o modal ao clicar fora dele (opcional)
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});
