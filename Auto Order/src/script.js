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
var travelDetails = {
    source: "DELHI - DLI (NEW DELHI)",
    destination: "AGRA CANTT - AGC (AGRA)",
    date: "2023-07-25",
    clas: "First Class",
    confirmBirth:false
};

// Function to display travel details
function displayTravelDetails() {
  chrome.storage.sync.get("travelDetails", function (data) {
  console.log("123141");
  console.log(data);
  if(data === undefined)
  {
    initializeTravralsDetails();
    return;
  }
  if(data.travelDetails === undefined)
  {
    initializeTravralsDetails();
    return;
  }
  travelDetails = data.travelDetails;

  console.log(travelDetails);
  document.getElementById("source").innerText = travelDetails.source;
  document.getElementById("destination").innerText = travelDetails.destination;
  document.getElementById("date").innerText = travelDetails.date;
  document.getElementById("class").innerText = travelDetails.clas;
  document.getElementById("confirmBirth").checked = travelDetails.confirmBirth;
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

function initializeTravralsDetails()
{
    chrome.storage.sync.set({travelDetails:travelDetails}, function (data) {});
    displayTravelDetails();
}

var paymentDetails = {
    enableUPIPayment:false,
    upiAddress:"123456789@ybl",
    clickOnContinue:false
};

function initializePaymentDetails()
{
 chrome.storage.sync.set({paymentDetails:paymentDetails}, function (data) {});
 displayPaymentDetails();   
}


function displayPaymentDetails() {
  chrome.storage.sync.get("paymentDetails", function (data) {
    console.log("123");
    console.log(data);
    if(data === undefined)
    {
        initializePaymentDetails();
        return;
    }
    if(data.paymentDetails === undefined)
    {
        initializePaymentDetails();
        return;
    }
    
    paymentDetails = data.paymentDetails;
    document.getElementById("upiAddress").value = paymentDetails.upiAddress;
    SetPaymentOption(paymentDetails.enableUPIPayment);
    //document.getElementById("bhimCheckbox").checked = paymentDetails.enableUPIPayment;
  })
}

displayTravelDetails();
displaySelectedPassengers();
displayPaymentDetails();

document.getElementById("confirmBirth").addEventListener('change', function() {
    travelDetails.confirmBirth = document.getElementById("confirmBirth").checked;
    chrome.storage.sync.set({travelDetails:travelDetails}, function (data) {});
});

document.getElementById("savePaymentDetails").addEventListener('click', function() {
    
    paymentDetails.upiAddress = document.getElementById("upiAddress").value;
    
    paymentDetails.enableUPIPayment = GetPaymentOption() ;
    
    chrome.storage.sync.set({paymentDetails:paymentDetails}, function (data) {});
});

function GetPaymentOption()
{
 var radios = document.getElementsByName('paymentOptions');
    // Loop through the radio buttons to find the selected one
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            // Return the value of the selected radio button
                return radios[i].value;
        }
    }
   
   return 0;   
}

function SetPaymentOption(op)
{
 var radios = document.getElementsByName('paymentOptions');
 radios[op].checked = true;
}
