let count = 0;
document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("editId");
  displayAllElement();
});

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

//   getting value from form
  const amount = form.amount.value;
  const description = form.description.value;
  const category = form.category.value;

//   if it is edited then getting it from session storage
  const editId = JSON.parse(sessionStorage.getItem("editId"));

//   generating id for expense
  const id = editId || Date.now();

//   generating obj of data for expense
  const obj = { id, amount, description, category };

//   if it is editing expense or not
  if (editId) {
    updateExpense(obj);
    sessionStorage.removeItem("editId");
  } else {
    addExpense(obj);
  }

// updating form field value to empty   
  form.amount.value = null;
  form.description.value = "";
  form.category.value = "";
});

function addExpense(data) {
  // add expense to localstorage & display
  let expensesList = JSON.parse(localStorage.getItem("expensesList")) || [];
  expensesList.push(data);

  localStorage.setItem("expensesList", JSON.stringify(expensesList));

  displaySingleElement(data);
}

function displayAllElement() {
  const tbody = document.querySelector("#expenseList");

  //   getting expenses from local storage
  const expensesList = JSON.parse(localStorage.getItem("expensesList")) || [];

  //   updating HTML of table body to empty before displaying all expenses. So that expenses do not repeat.
  tbody.innerHTML = "";

  //   displaying expenses one by one
  for (const expense of expensesList) {
    displaySingleElement(expense);
  }
}

function displaySingleElement(data) {
  // selecting table body
  const tbody = document.querySelector("#expenseList");

  //   creating table row element
  const tr = document.createElement("tr");

  //   updating html of row element
  tr.innerHTML = `<td>${++count}</td>
                <td>${data.amount}</td>
                <td>${data.description}</td>
                <td>${data.category}</td>
                <td>
                    <button type="button" class="edit-btn">Edit Expense</button>
                </td>
                <td>
                    <button type="button" class="delete-btn">Delete Expense</button>
                </td>`;
  // adding id to row element
  tr.id = data.id;

  //   adding eventListener to both buttons in row element
  const deleteBtn = tr.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => deleteExpense(data.id));
  const editBtn = tr.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => editExpense(data));

  //   appending row element to table body
  tbody.appendChild(tr);
}

function deleteExpense(id) {
  // selecting table row of same id
  const tr = document.getElementById(String(id));

  //   deleting expense from localStorage
  let expensesList = JSON.parse(localStorage.getItem("expensesList")) || [];

  expensesList = expensesList.filter((expense) => expense.id !== id);

  localStorage.setItem("expensesList", JSON.stringify(expensesList));

  //   removing table row from DOM
  tr.remove();

  // again displaying all expenses to keep count also updated
  count = 0;
  displayAllElement();
}

function editExpense(data) {
  // changing values of form elements
  form.amount.value = data.amount;
  form.description.value = data.description;
  form.category.value = data.category;

  //   adding edit id to session storage in keep id known for further processing
  sessionStorage.setItem("editId", data.id);
}

function updateExpense(data) {
  const tr = document.getElementById(String(data.id));
  const td = tr.querySelectorAll("td");

  //   only changing content so that count does not change
  td[1].textContent = data.amount;
  td[2].textContent = data.description;
  td[3].textContent = data.category;

  //  again adding event Listeners on both buttons with updated data
  const deleteBtn = tr.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => deleteExpense(data.id));
  const editBtn = tr.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => editExpense(data));

  //   update localStorage
  let expensesList = JSON.parse(localStorage.getItem("expensesList")) || [];

  for (const index in expensesList) {
    if (expensesList[index].id === data.id) {
      expensesList[index].amount = data.amount;
      expensesList[index].description = data.description;
      expensesList[index].category = data.category;
    }
  }
  localStorage.setItem("expensesList", JSON.stringify(expensesList));
}
