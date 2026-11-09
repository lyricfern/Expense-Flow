const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const quantityInput = document.getElementById("expense-quantity");

const addButton = document.getElementById("add-button");
const expList = document.getElementById("expense-list");

const totalDisplay = document.getElementById("total");
const expCount = document.getElementById("count");

let total = 0;
let count = 0;
function deleteWeb(expense,item,subtotal,deleteButton){
    deleteButton.disabled = true;

    fetch("http://127.0.0.1:8000/expenses/" + expense.id, {
        method: "DELETE"
    })
        .then(function (response) {
            if (response.ok) {
                item.remove();

                count -= 1;
                expCount.textContent = count;

                total -= subtotal;
                totalDisplay.textContent = total.toFixed(2);
            } else {
                throw new Error("Could not delete the expense.");
            }
        })
        .catch(function (error) {
            alert(error.message);
        })
        .finally(function () {
            deleteButton.disabled = false;
        });
};
function edit(editButton,expense,item){
    editButton.disabled=true;
    const newName=document.createElement("input");
    const newAmount=document.createElement("input");
    const newQuantity=document.createElement("input")

    newName.value=expense.name;
    newAmount.value=expense.amount;
    newQuantity.value=expense.quantity;
}

function addWeb(expense){
    console.log("Saved expense:", expense);

    const subtotal = expense.amount * expense.quantity;

    const item = document.createElement("li");
    item.textContent =
        `${expense.name} Rs.${expense.amount} x ${expense.quantity} = Rs.${subtotal} `;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "🗑️ Delete";
    deleteButton.classList.add("delete-button");

    const editButton=document.createElement("button")
    editButton.type="button";
    editButton.textContent="✏️ Edit";
    editButton.classList.add("delete-button")

    item.appendChild(editButton)
    item.appendChild(deleteButton);
    expList.appendChild(item);

    count += 1;
    expCount.textContent = count;

    total += subtotal;
    totalDisplay.textContent = total.toFixed(2);

    // This button remembers the ID in data.id.
    deleteButton.addEventListener("click", function(){
        deleteWeb(expense, item, subtotal, deleteButton )
    })
    editButton.addEventListener("click", function(){
        edit(editButton,expense,item )
    })
        

    // Clear the fields after a successful save.
   
    
}

addButton.addEventListener("click", function () {
    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);
    const quantity = Number(quantityInput.value);

    if (
        name === "" ||
        amountInput.value === "" ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        quantityInput.value === "" ||
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {
        alert("Please enter a name, a valid price and a whole-number quantity.");
    } else {
        // Prevent another click while the expense is being saved.
        addButton.disabled = true;

        fetch("http://127.0.0.1:8000/expenses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                amount: amount,
                quantity: quantity
            })
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Could not save the expense.");
                }
            })
            .then(function(expense){
                addWeb(expense);
                nameInput.value = "";
                amountInput.value = "";
                quantityInput.value = "";
            })
                // data is the saved expense returned by Python.
                
            .catch(function (error) {
                console.error("Request failed:", error);
                alert(error.message);
            })
            .finally(function () {
                addButton.disabled = false;
            });
    }
});
fetch("http://127.0.0.1:8000/expenses")
    .then(function(response){
        if (response.ok){
            return response.json();
        
        }else{
            throw new Error("Could not load the expenses.")
        }


    })
    .then(function(expenses){
        for (const expense of expenses){
            addWeb(expense)

        }
    })
