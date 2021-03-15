const socket = io();
const sendMessage = () => {
    const inputMessage = document.getElementById("inputMessage").value;
    const inputUser = document.getElementById("inputUser").value;
    socket.emit("addNewMessage", inputMessage, inputUser);
};

socket.on("paintMessage", (message, user) => {
    const li = document.createElement("li");
    li.innerText = user + ":" + message;
    const ul = document.getElementById("ulMessages");
    ul.appendChild(li);
});