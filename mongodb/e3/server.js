const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const app = express();
//const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const server = http.createServer(app);
const io = require("socket.io")(server);
//const jwt = require("jsonwebtoken");
//const MY_SEED_AUTH = "MY_SEED_AUTH";
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
    app.options("*", (req, res) => {
        // allowed XHR methods
        res.header(
            "Access-Control-Allow-Methods",
            "GET, PATCH, PUT, POST, DELETE, OPTIONS"
        );
        res.send();
    });
});
app.post("/index/login", (request, response) => {
    response.cookie("userCookie", request.body.name).send();
});
io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");
    socket.on("addNewMessage", (message, name) => {
        io.emit("paintMessage", message, name);
    });
});

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/html", { extensions: ["html"] }));
app.use(
    "/js",
    express.static(__dirname + "/node_modules/socket.io/client-dist")
);

server.listen(2008, () => {
    console.log("Servidor chat corriendo en puerto 2008");
});