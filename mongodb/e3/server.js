const express = require("express");
const http = require("http");
const app = express();

const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/html", { extensions: ["html"] }));
app.use(
    "/js",
    express.static(__dirname + "/node_modules/socket.io/client-dist")
);

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");
    socket.on("addNewMessage", (message, user) => {
        io.emit("paintMessage", message, user);
    });

    /*
        socket.on("disconnect", () => {
            console.log("Usuario desconectado");
            io.emit("userDisconnect");
        });*/
});

server.listen(2008, () => {
    console.log("Servidor chat corriendo en puerto 2008");
});