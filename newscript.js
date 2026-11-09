addButton.addEventListener("click", function () {
    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);
    const quantity = Number(quantityInput.value);

    if (
        name === "" ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {
        alert("Enter a name, a positive price and a whole-number quantity.");
    } else {
        // Prevent repeated clicks while saving.
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
            .then(function (data) {
                // Python has saved the expense and returned its ID.
                const subtotal = data.amount * data.quantity;

                const item = document.createElement("li");
                item.textContent =
                    `${data.name} Rs.${data.amount} × ${data.quantity} = Rs.${subtotal} `;

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.textContent = "🗑️ Delete";
                deleteButton.classList.add("delete-button");

                item.appendChild(deleteButton);
                expList.appendChild(item);

                total += subtotal;
                count += 1;

                totalDisplay.textContent = total.toFixed(2);
                expCount.textContent = count;

                deleteButton.addEventListener("click", function () {
                    deleteButton.disabled = true;

                    fetch(
                        "http://127.0.0.1:8000/expenses/" + data.id,
                        {
                            method: "DELETE"
                        }
                    )
                        .then(function (response) {
                            if (response.ok) {
                                // Python deleted it successfully.
                                item.remove();

                                total -= subtotal;
                                count -= 1;

                                totalDisplay.textContent = total.toFixed(2);
                                expCount.textContent = count;
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
                });

                nameInput.value = "";
                amountInput.value = "";
                quantityInput.value = "";
            })
            .catch(function (error) {
                alert(error.message);
            })
            .finally(function () {
                addButton.disabled = false;
            });
    }
});