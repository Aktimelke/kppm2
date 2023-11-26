const context = document.getElementById("data-set").getContext("2d");
let line = new Chart(context, {});

const intialAmount = document.getElementById("initialamount");
const years = document.getElementById("years");
const rates = document.getElementById("rates");
const compound = document.getElementById("compound");

const message = document.getElementById("message");

const button = document.querySelector(".input-group button");

button.addEventListener("click", calculateGrowth);

const data = [];
const labels = [];
const history = [];

function calculateGrowth(e) {
    e.preventDefault();
    data.length = 0;
    labels.length = 0;

    try {
        const initial = parseFloat(intialAmount.value);
        const period = parseFloat(years.value);
        const interest = parseFloat(rates.value);
        const comp = parseInt(compound.value);

        if (initial < 0 || period < 0 || interest < 0 || comp < 0) {
            throw new Error("Please enter positive values for all fields.");
        }

        if (isNaN(initial) || isNaN(period) || isNaN(interest) || isNaN(comp)) {
            throw new Error("Please fill in all fields with valid numeric values.");
        }

        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = ''; 

        for (let i = 1; i <= period * comp; i++) {
            const time = i * (1 / comp);
            const final = initial * Math.pow(1 + ((interest / 100) / comp), comp * time);
            data.push(toDecimal(final, 2));
            labels.push("Year " + time.toFixed(2));
            growth = toDecimal(final, 2);

            
            const row = document.createElement("tr");
            row.innerHTML = `<td>${labels[i - 1]}</td><td>${data[i - 1]}</td>`;
            tableBody.appendChild(row);
        }

        message.innerText = `You will have this amount ${growth} after ${period} years`;

        history.push({ initial, period, interest, comp, growth});

        drawGraph();
    } catch (error) {
        message.innerText = error.message;
        console.error(error);
    }
}

function showHistory() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = '';

    history.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>Calculation ${index + 1}:</strong> 
                              Initial: ${entry.initial}, 
                              Period: ${entry.period}, 
                              Interest(%): ${entry.interest}, 
                              Compound: ${entry.comp},
                              Result: ${entry.growth}`;
        historyList.appendChild(listItem);
    });
}

function drawGraph() {
    line.destroy();
    line = new Chart(context, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: "compound",
                data,
                fill: true,
                backgroundColor: "rgba(12, 141, 0, 0.7)",
                borderWidth: 3
            }]
        }
    });
}

function toDecimal(value, decimals) {
    return +value.toFixed(decimals);
}
