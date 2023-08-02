body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 800px;
    margin: 50px auto;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    padding: 20px;
    display: flex;
}

.user-form {
    flex: 1;
}

.user-form h1 {
    font-size: 24px;
    margin-bottom: 20px;
}

form {
    display: flex;
    flex-wrap: wrap;
}

form label,
form input,
form select,
form button {
    margin: 5px;
}

form label {
    font-weight: bold;
}

form input,
form select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

form input[type="radio"] {
    margin: 0 5px;
}

form button {
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
}

form button:hover {
    background-color: #0056b3;
}

.passenger-table {
    flex: 1;
    margin-left: 20px;
}

#passengerTable {
    width: 100%;
    border-collapse: collapse;
}

#passengerTable th,
#passengerTable td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

#passengerTable th {
    background-color: #f2f2f2;
}

#addPassengerBtn {
    display: block;
    margin-top: 10px;
    cursor: pointer;
}
