document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmount = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const totalAmountDisplay = document.getElementById("total-amount");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || []; // Array to store the expenses added by the user
  let totalAmount = calculateTotalAmount(); // Variable to store the total amount of expenses added by the user and initialize it to 0  by calling the calculateTotalAmount function  which will calculate the total amount of expenses  in the expenses array

  renderExpenses(); // Call the renderExpenses function to update the expense list display with the expenses in the expenses array  and display it to the user

  expenseForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const name = expenseNameInput.value.trim(); // Get the name of the expense entered by the user and remove any leading or trailing whitespace
    const amount = parseFloat(expenseAmount.value.trim()); // Get the amount of the expense entered by the user, remove any leading or trailing whitespace, and convert it to a floating-point number

    if (name && amount) {
      const newExpense = {
        id: Date.now(),
        name: name,
        amount: amount,
      }; // Create a new expense object with a unique ID, name, and amount entered by the user and store it in a variable called newExpense  to add it to the expenses array later on  when the user submits the form  if the name and amount are valid  (not empty or NaN)

      expenses.push(newExpense); // Add the new expense to the expenses array  to store it for later use
      saveExpensesToLocalStorage(); // Call the saveExpensesToLocalStorage function to save the expenses to local storage  so that they persist even after the page is reloaded

      renderExpenses(); // Call the renderExpenses function to update the expense list display with the new expense added by the user and update the total amount of expenses displayed to the user
      updateTotalAmount(); // Call the updateTotalAmount function to update the total amount of expenses displayed to the user  when a new expense is added

      expenseNameInput.value = "";
      expenseAmount.value = "";
    } else {
      alert("Please enter a valid name and amount for the expense.");
    }
  });

  function renderExpenses() {
    expenseList.innerHTML = ""; // Clear the expense list display

    expenses.forEach((expense) => {
      const expenseItem = document.createElement("li");
      expenseItem.innerHTML = `
        <span>${expense.name} - $${expense.amount.toFixed(2)}</span>
        <button class="remove-expense" data-id="${expense.id}">Remove</button>
      `; // Create an expense list item for each expense in the expenses array  with the expense name, amount, and a "Remove" button that has a data-id attribute with the expense ID  to identify the expense when the user clicks the button

      expenseList.appendChild(expenseItem);
    }); // Loop through the expenses array and create an expense list item for each expense  with the expense name, amount, and a "Remove" button that has a data-id attribute with the expense ID  to identify the expense when the user clicks the button
  } // Function to update the expense list display with the expenses in the expenses array  and display it to the user

  function calculateTotalAmount() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  } // Function to calculate the total amount of expenses in the expenses array and return the total amount  to be displayed to the user  when the page loads

  function saveExpensesToLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  } // Function to save the expenses array to local storage  by converting it to a JSON string using JSON.stringify and storing it in the "expenses" key  so that the expenses persist even after the page is reloaded

  function updateTotalAmount() {
    totalAmount = calculateTotalAmount(); // Update the total amount variable by calling the calculateTotalAmount function  to recalculate the total amount of expenses  in the expenses array
    totalAmountDisplay.textContent = `$${totalAmount.toFixed(2)}`; // Update the total amount display with the new total amount of expenses  formatted as a currency value
  } // Function to update the total amount of expenses displayed to the user  when a new expense is added or an expense is removed

  expenseList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-expense")) {
      const expenseId = parseInt(event.target.getAttribute("data-id")); // Get the expense ID from the data-id attribute of the button  that was clicked by the user
      expenses = expenses.filter((expense) => expense.id !== expenseId); // Filter out the expense with the matching ID from the expenses array  and update the expenses array to remove the expense  when the user clicks the "Remove" button

      saveExpensesToLocalStorage(); // Call the saveExpensesToLocalStorage function to save the updated expenses array to local storage  so that the changes persist even after the page is reloaded

      renderExpenses(); // Call the renderExpenses function to update the expense list display with the expense removed by the user
      updateTotalAmount(); // Call the updateTotalAmount function to update the total amount of expenses displayed to the user  when an expense is removed
    }
  }); // Add an event listener to the expense list to handle the "Remove" button click event and remove the expense from the expenses array when the user clicks the button  and update the expense list display with the expense removed and update the total amount of expenses and display it to the user
});
