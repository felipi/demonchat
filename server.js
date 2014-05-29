var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs')

    app.listen(80);

function handler (req, res) {
    var page = __dirname + '/index.html';
      fs.readFile(page, function(err, data){
              res.writeHead(200);
      res.end(data);  });
}

available_names = ["King Baal", "Duke Agares", "Prince Vassago", "Marquis Samigina", "President Barbas", "Duke Valefar", "Marquis Aamon", "Duke Barbatos", "King Paimon", "President Buer", "Duke Gusion", "Prince Sitri", "King Beleth", "Marquis Leraje", "Duke Eligos", "Duke Zepar", "Count Botis", "Duke Bathin", "Duke Sallos", "King Purson", "Count/President Marax", "Count/Prince Ipos", "Duke Aim", "Marquis Naberius", "Count/President Glasya-Labolas", "Duke Buné", "Marquis/Count Ronové", "Duke Berith", "Duke Astaroth", "Marquis Forneus", "President Foras", "King Asmodeus", "Prince/President Gäap", "Count Furfur", "Marquis Marchosias", "Prince Stolas", "Marquis Phenex", "Count Halphas", "President Malphas", "Count Räum", "Duke Focalor", "Duke Vepar", "Marquis Sabnock", "Marquis Shax", "King/Count Viné", "Count Bifrons", "Duke Vual", "President Häagenti", "Duke Crocell", "Knight Furcas", "King Balam", "Duke Alloces", "President Camio", "Duke/Count Murmur", "Prince Orobas", "Duke Gremory", "President Ose", "President Amy", "Marquis Orias", "Duke Vapula", "King/President Zagan", "President Valac", "Marquis Andras", "Duke Flauros", "Marquis Andrealphus", "Marquis Cimeies", "King Amdusias", "King Belial", "Marquis Decarabia", "Prince Seere", "Duke Dantalion", "Count Andromalius", "Heir Apparent Capiroto"];
connected_users = [];

io.sockets.on('connection', function (socket) {
    name_index = Math.floor(Math.random() * available_names.length );
    name = available_names[name_index];
    connected_users.push(name);

    socket.set('nickname', name, function () {});
    socket.emit('connection', {name:name});
    socket.emit("user_list", {users: connected_users});
    socket.broadcast.emit("user_list", {users: connected_users});

    socket.on('send_message', function (msg) {
        socket.emit("new_message", { message: name + ":" + msg.message});
        socket.broadcast.emit("new_message", { message: name + ": " + msg.message});
    });

    socket.on('disconnect', function(){
        socket.get("nickname", function(err, name) {
            console.log(connected_users.indexOf(name) );
            connected_users = connected_users.splice(connected_users.indexOf(name), 1);
            io.sockets.emit("user_list", {users: connected_users});
        });
    });
});

