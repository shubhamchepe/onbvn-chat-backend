require("dotenv/config")

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const port = process.env.PORT || 8080;
server.listen(port);

const connectDb = require('./utils/connectDb');     
connectDb();


var Chat = require('./models/Chat.model');
var users = [];
users.length = 2;


{/*
                  888                              888                        888                             888 
                  888                              888                        888                             888 
                  888                              888                        888                             888 
 .d88b.  88888b.  88888b.  888  888 88888b.        88888b.   8888b.   .d8888b 888  888  .d88b.  88888b.   .d88888 
d88""88b 888 "88b 888 "88b 888  888 888 "88b       888 "88b     "88b d88P"    888 .88P d8P  Y8b 888 "88b d88" 888 
888  888 888  888 888  888 Y88  88P 888  888       888  888 .d888888 888      888888K  88888888 888  888 888  888 
Y88..88P 888  888 888 d88P  Y8bd8P  888  888       888 d88P 888  888 Y88b.    888 "88b Y8b.     888  888 Y88b 888 
 "Y88P"  888  888 88888P"    Y88P   888  888       88888P"  "Y888888  "Y8888P 888  888  "Y8888  888  888  "Y88888 
 
 
  ▄▄▄▄ ▓██   ██▓     ██████  ██░ ██  █    ██  ▄▄▄▄    ██░ ██  ▄▄▄       ███▄ ▄███▓        ▄████  ▒█████   █    ██ ▄▄▄█████▓ ▄▄▄       ███▄ ▄███▓
▓█████▄▒██  ██▒   ▒██    ▒ ▓██░ ██▒ ██  ▓██▒▓█████▄ ▓██░ ██▒▒████▄    ▓██▒▀█▀ ██▒       ██▒ ▀█▒▒██▒  ██▒ ██  ▓██▒▓  ██▒ ▓▒▒████▄    ▓██▒▀█▀ ██▒
▒██▒ ▄██▒██ ██░   ░ ▓██▄   ▒██▀▀██░▓██  ▒██░▒██▒ ▄██▒██▀▀██░▒██  ▀█▄  ▓██    ▓██░      ▒██░▄▄▄░▒██░  ██▒▓██  ▒██░▒ ▓██░ ▒░▒██  ▀█▄  ▓██    ▓██░
▒██░█▀  ░ ▐██▓░     ▒   ██▒░▓█ ░██ ▓▓█  ░██░▒██░█▀  ░▓█ ░██ ░██▄▄▄▄██ ▒██    ▒██       ░▓█  ██▓▒██   ██░▓▓█  ░██░░ ▓██▓ ░ ░██▄▄▄▄██ ▒██    ▒██ 
░▓█  ▀█▓░ ██▒▓░   ▒██████▒▒░▓█▒░██▓▒▒█████▓ ░▓█  ▀█▓░▓█▒░██▓ ▓█   ▓██▒▒██▒   ░██▒      ░▒▓███▀▒░ ████▓▒░▒▒█████▓   ▒██▒ ░  ▓█   ▓██▒▒██▒   ░██▒
░▒▓███▀▒ ██▒▒▒    ▒ ▒▓▒ ▒ ░ ▒ ░░▒░▒░▒▓▒ ▒ ▒ ░▒▓███▀▒ ▒ ░░▒░▒ ▒▒   ▓▒█░░ ▒░   ░  ░       ░▒   ▒ ░ ▒░▒░▒░ ░▒▓▒ ▒ ▒   ▒ ░░    ▒▒   ▓▒█░░ ▒░   ░  ░
▒░▒   ░▓██ ░▒░    ░ ░▒  ░ ░ ▒ ░▒░ ░░░▒░ ░ ░ ▒░▒   ░  ▒ ░▒░ ░  ▒   ▒▒ ░░  ░      ░        ░   ░   ░ ▒ ▒░ ░░▒░ ░ ░     ░      ▒   ▒▒ ░░  ░      ░
 ░    ░▒ ▒ ░░     ░  ░  ░   ░  ░░ ░ ░░░ ░ ░  ░    ░  ░  ░░ ░  ░   ▒   ░      ░         ░ ░   ░ ░ ░ ░ ▒   ░░░ ░ ░   ░        ░   ▒   ░      ░   
 ░     ░ ░              ░   ░  ░  ░   ░      ░       ░  ░  ░      ░  ░       ░               ░     ░ ░     ░                    ░  ░       ░   
      ░░ ░                                        ░                                                                                            
                                                                                                                  
*/}

app.get('/', (req, res) => res.send('Welcome to onbvn-chat-backend'));


// io.on('connection', socket => {
//        console.log(socket.id);
//        socket.on('Chat Message', msg => {
//               console.log(msg);
//        io.emit('Chat Message', msg)
//        });
// })

// io.configure(function () { 
//        io.set("transports", ["xhr-polling"]); 
//        io.set("polling duration", 10); 
//      });

io.on('connection', (socket) => {
       console.log("User connected", socket.id);

       socket.on('user_connected', (username) => {
              console.log("Username :" + username);
              users[username] = socket.id;
              console.log(users);

       io.emit('user_connected', username);   

       socket.on('send_message', (data) => {
             var socketId = users[data.ToUser];
             var socketId1 = users[data.FromUser];
             console.log(io.sockets.adapter.rooms[socketId])
             io.to(socketId1).emit('new_message', data)
             data.type = 'in'
             io.to(socketId).emit('new_message', data)
             var chat = new Chat(data)
             chat.save((err,data) => {
                    if(err){
                           console.log('Error Occured Saving Chat')
                    } else{
                           console.log('Chat Saved')
                    }
             })
            
       })    
       })
})



//app.listen(port, () => console.log(`onbvn-chat-backend listening on port ${port}!`))


