const passengers = JSON.parse(localStorage.getItem("passengers")) || [];
let selectedPassengers = JSON.parse(localStorage.getItem("selectedPassengers")) || [];

function addPassenger() {
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const foodChoice = document.getElementById("foodChoice").value;
    const berthChoice = document.getElementById("berthChoice").value; // Get the selected BerthChoice

    const passenger = {
        name: name,
        age: age,
        gender: gender,
        foodChoice: foodChoice,
        berthChoice: berthChoice, // Add the BerthChoice to the passenger object
        checked: true // Initially checked
    };

    passengers.push(passenger);
    updateTable();
    saveToLocalStorage();
}

function updateTable() {
    const table = document.getElementById("passengerTable");
    table.innerHTML = `
        <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Berth Choice</th> <!-- Add the column for Berth Choice -->
            <th>Food Choice</th>
            <th>Delete</th>
        </tr>
    `;

    passengers.forEach((passenger, index) => {
        const row = table.insertRow();
        const checkboxCell = row.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = passenger.checked;
        checkbox.onchange = function () {
            passengers[index].checked = checkbox.checked;
        };
        checkboxCell.appendChild(checkbox);

        row.insertCell().innerText = passenger.name;
        row.insertCell().innerText = passenger.age;
        row.insertCell().innerText = passenger.gender;
        row.insertCell().innerText = passenger.berthChoice; // Display the BerthChoice value
        row.insertCell().innerText = passenger.foodChoice;
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = function () {
            passengers.splice(index, 1);
            updateTable();
            saveToLocalStorage();
        };
        row.insertCell().appendChild(deleteButton);
    });
}
function saveToLocalStorage() {
    localStorage.setItem("passengers", JSON.stringify(passengers));
}

function saveToLocalStorageSelectedPassenger()
{
 localStorage.setItem("selectedPassengers", JSON.stringify(selectedPassengers));   
 chrome.storage.sync.set({PassengersDetails:selectedPassengers}, function (data) {
 });
 chrome.storage.sync.get('PassengersDetails', function (data){
        console.log(data.PassengersDetails.length);
        console.log(data.PassengersDetails);
    });
}


// On page load, update the table from local storage
updateTable();

// Add event listener to "Add More Passenger" button
document.getElementById("addPassengerBtn").addEventListener("click", addPassenger);
document.getElementById("chagneDetails").addEventListener("click", function(){
    window.open("https://www.irctc.co.in/nget/train-search");
});




function saveData(event) {
    event.preventDefault();
    selectedPassengers = passengers.filter(passenger => passenger.checked);
    saveToLocalStorageSelectedPassenger();
    displaySelectedPassengers();
}


function displaySelectedPassengers() {
  const passengerDetailsContainer = document.getElementById("passengerDetails");
    passengerDetailsContainer.innerHTML = ""; // Clear previous content
    selectedPassengers.forEach(passenger => {
        const detailsLine = document.createElement("p");
        detailsLine.innerText = `Name: ${passenger.name}, Age: ${passenger.age}, Gender: ${passenger.gender}, Food Choice: ${passenger.foodChoice},Berth Choice: ${passenger.berthChoice}`;
        passengerDetailsContainer.appendChild(detailsLine);
    });

    // Print selected passenger details to the console
    console.log(selectedPassengers);
}

// Travel details object with pre-filled data
const travelDetails = {
    source: "New York",
    destination: "Los Angeles",
    date: "2023-07-25",
    class: "First Class"
};

// Function to display travel details
function displayTravelDetails() {
  chrome.storage.sync.get("travelDetails", function (data) {
  console.log(data);
  travelDetails.source = data.travelDetails.source;
  travelDetails.destination = data.travelDetails.destination;
  travelDetails.date = data.travelDetails.date;
  document.getElementById("source").innerText = travelDetails.source;
  document.getElementById("destination").innerText = travelDetails.destination;
  document.getElementById("date").innerText = travelDetails.date;
  document.getElementById("class").innerText = travelDetails.class;
});
  
}

// Add event listener to the Submit button
const submitButton = document.getElementById("submitBtn");
submitButton.addEventListener("click", function () {
    event.preventDefault(); // Prevent the form from submitting (if the button is inside a form)
    saveData(event);
    displayTravelDetails();    
    displaySelectedPassengers();
});

// Display travel details on page load

displayTravelDetails();
displaySelectedPassengers()