import express from 'express';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4444;

const app = express();

const expressServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

expressServer.on('error', (error) => {
  console.log(`Server error: ${error}`);
});

const UserState = {
  users: [],
  setUsers: function (newUsers) {
    this.users = newUsers;
  }
};

const io = new Server(expressServer, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('enterRoom', ({ name, room }) => {
    const rooms = getRooms();

    if (!rooms.includes(room)) {
      socket.emit('roomAlert', `${room} room does not exist`);
      return;
    } else if (getRoomUsers(room).length >= 2) {
      socket.emit('roomAlert', `${room} room is full`);
      return;
    }
    const previousRoom = getUser(socket.id)?.room;

    if (previousRoom) {
      socket.leave(previousRoom);
      io.to(previousRoom).emit('leftRoom', `${name} has left this room`);
      io.to(previousRoom).emit('userList', {
        users: getRoomUsers(previousRoom)
      });
    }

    const user = activateUser(socket.id, name, room);

    socket.join(user.room);

    socket.emit('joinedRoom', user.room);

    socket.emit('joinAlert', `You have joined room ${user.room}`);

    socket.broadcast
      .to(user.room)
      .emit('newUserAlert', `${name} has joined this room`);
  });

  socket.on('createRoom', ({ name, room }) => {
    const previousRoom = getUser(socket.id)?.room;

    if (previousRoom) {
      socket.leave(previousRoom);
      io.to(previousRoom).emit('leftRoom', `${name} has left this room`);
      io.to(previousRoom).emit('userList', {
        users: getRoomUsers(previousRoom)
      });
    }

    const user = activateUser(socket.id, name, room);

    socket.join(user.room);

    socket.emit('joinAlert', `You have created room ${user.room}`);

    socket.broadcast
      .to(user.room)
      .emit('newUserAlert', `${name} has joined this room`);
  });

  socket.on('disconnect', () => {
    const user = getUser(socket.id);

    deactivateUser(socket.id);

    if (user) {
      io.to(user.room).emit('userList', {
        users: getRoomUsers(user.room)
      });
      io.to(user.room).emit('leftRoom', `${user.name} has left this room`);
    }

    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on('message', ({ name, message }) => {
    console.log(`Message: ${message}: ${name}`);

    const room = getUser(socket.id)?.room;

    if (room) {
      const id = socket.id;

      io.to(room).emit('message', buildMessage(name, message, id));
    }
  });

  socket.on('activity', (data) => {
    const room = getUser(socket.id)?.room;

    if (room) {
      socket.broadcast.to(room).emit('activity', `${data} is typing`);
    }
  });
});

function buildMessage(name, message, id) {
  return {
    name: name,
    message: message,
    id: id,
    time: new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).format(new Date())
  };
}

function activateUser(id, name, room) {
  const user = { id, name, room };
  UserState.setUsers([...UserState.users.filter((u) => u.id !== id), user]);
  return user;
}

function deactivateUser(id) {
  UserState.setUsers(UserState.users.filter((u) => u.id !== id));
}

function getUser(id) {
  return UserState.users.find((u) => u.id === id);
}

function getRoomUsers(room) {
  return UserState.users.filter((u) => u.room === room);
}

function getRooms() {
  return UserState.users.map((u) => u.room);
}
