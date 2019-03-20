const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');

const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('login', (usuario, callback) => {
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                message: 'El nombre/sala es necesario.'
            });
        }
        client.join(usuario.sala);
        let personas = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);


        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));

        return callback(usuarios.getPersonasPorSala(usuario.sala));
    });

    client.on('disconnect', () => {
        let borrado = usuarios.dropPersona(client.id);
        console.log(borrado);
        let name = 'Unknown';
        if (borrado) {
            name = borrado.nombre;
        }

        client.broadcast.to(borrado.sala).emit('crearMensaje', crearMensaje('Administrador', `${name} abandonó el chat.`));
        client.broadcast.to(borrado.sala).emit('listaPersonas', usuarios.getPersonasPorSala(borrado.sala));
    });

    client.on('crearMensaje', (data) => {
        let user = usuarios.getPersona(client.id);
        client.broadcast.to(user.sala).emit('crearMensaje', crearMensaje(user.nombre, data.mensaje));
    });

    //mensajes privados
    client.on('pm', (data) => {
        console.log('PM');
        client.broadcast.to(data.para).emit('pm', crearMensaje(usuarios.getPersona(client.id).nombre, data.mensaje));

    });

});