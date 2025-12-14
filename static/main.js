let socket = null;
let selectedStocks = [];
let loggedEmail = "";

const loginCard = document.getElementById("loginCard");
const subscribeCard = document.getElementById("subscribeCard");
const dashboardCard = document.getElementById("dashboardCard");

document.getElementById("loginBtn").addEventListener("click", () => {
    const emailInput = document.getElementById("emailInput");
    const email = emailInput.value.trim();
    if (!email) {
        alert("Please enter an email address.");
        return;
    }
    loggedEmail = email;
    document.getElementById("userEmail").innerText = email;
    loginCard.classList.add("hidden");
    subscribeCard.classList.remove("hidden");
});

document.getElementById("startBtn").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#stocksList input[type=checkbox]");
    selectedStocks = [];
    checkboxes.forEach(cb => {
        if (cb.checked) selectedStocks.push(cb.value);
    });
    if (selectedStocks.length === 0) {
        alert("Please select at least one stock.");
        return;
    }

    subscribeCard.classList.add("hidden");
    dashboardCard.classList.remove("hidden");
    document.getElementById("dashEmail").innerText = loggedEmail;
    renderSubscribedPills();
    setupTable();
    connectSocket();
});

document.getElementById("changeStocksBtn").addEventListener("click", () => {
    // allow user to re-choose stocks without reloading
    dashboardCard.classList.add("hidden");
    subscribeCard.classList.remove("hidden");
    if (socket) {
        socket.disconnect();
        socket = null;
    }
});

function renderSubscribedPills() {
    const container = document.getElementById("subscribedPills");
    container.innerHTML = "";
    selectedStocks.forEach(s => {
        const span = document.createElement("span");
        span.className = "pill";
        span.textContent = s;
        container.appendChild(span);
    });
}

function setupTable() {
    const tbody = document.getElementById("pricesBody");
    tbody.innerHTML = "";
    selectedStocks.forEach(s => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-stock", s);

        const tdName = document.createElement("td");
        tdName.textContent = s;

        const tdPrice = document.createElement("td");
        tdPrice.textContent = "-";
        tdPrice.className = "price-cell";

        const tdTime = document.createElement("td");
        tdTime.textContent = "-";

        tr.appendChild(tdName);
        tr.appendChild(tdPrice);
        tr.appendChild(tdTime);
        tbody.appendChild(tr);
    });
}

function connectSocket() {
    socket = io();

    socket.on("connect", () => {
        console.log("Connected to WebSocket server");
    });

    socket.on("price_update", (prices) => {
        // prices is an object: { "GOOG": 123.45, ... }
        const tbody = document.getElementById("pricesBody");
        selectedStocks.forEach(stock => {
            const row = tbody.querySelector(`tr[data-stock="${stock}"]`);
            if (!row) return;
            const priceCell = row.querySelector(".price-cell");
            const timeCell = row.children[2];

            if (prices[stock] !== undefined) {
                priceCell.textContent = prices[stock].toFixed(2);
                const now = new Date();
                timeCell.textContent = now.toLocaleTimeString();
            }
        });
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
    });
}
