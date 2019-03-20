var socket = io();

var params = new URLSearchParams(window.location.search);



if (!params.has('nombre') || !params.has('sala') || params.get('sala').length < 1) {
    window.location = 'index.html';
    throw new Error('El nombre y sala es necesario');
}

var usuario = { nombre: params.get('nombre'), sala: params.get('sala') };

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('login', usuario, function(conectados) {
        console.log('conectados: ', conectados);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log(mensaje);

});

// Escuchar lista
socket.on('listaPersonas', function(lista) {

    console.log('Servidor:', lista);

});

// escuchar mensaje privado
socket.on('pm', function(pm) {

    console.log('PM', pm);

});