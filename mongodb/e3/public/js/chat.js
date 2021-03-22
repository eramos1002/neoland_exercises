const socket = io();

let user = document.cookie.substring(11);
console.log(user);
const sendMessage = () => {
    const inputMessage = document.getElementById("inputMessage").value;

    socket.emit("addNewMessage", inputMessage, user);
};

socket.on("paintMessage", (message, user) => {
    const ul = document.getElementById("ulMessages");
    const li = document.createElement("li");
    li.innerText = user + ":" + message;

    ul.appendChild(li);
});