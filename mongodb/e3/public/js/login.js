const register = () => {
    const inputUser = document.getElementById("inputUser");
    const URL = "http://localhost:2008/index/login";
    const nameCookie = { name: inputUser.value };
    const opts = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(nameCookie),
    };

    fetch(URL, opts).then((data) => {
        window.location.href = "/chat";
    });
};

//const button = document.getElementById("button");
document.getElementById("inputUser").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        register();
    }
});