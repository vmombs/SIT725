const socket = io("http://localhost:3000");

const pizzaForm = document.getElementById("pizzaForm");
const pizzaList = document.getElementById("pizza-list");

if (!pizzaList) {
  console.error("Pizza list element not found!");
}

pizzaForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const pizzaName = document.getElementById("name").value;
  const pizzaIngredients = document.getElementById("ingredients").value.split(",");
  const pizzaPrice = document.getElementById("price").value;

  fetch("/create-pizza", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: pizzaName,
      ingredients: pizzaIngredients,
      price: pizzaPrice,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {throw new Error(err.error || 'Server error')});
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);

      // Clear the form fields after successful submission
      pizzaForm.reset();

    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message); // Display an alert with the error message
    });
});


socket.on("pizzaAdded", (newPizzaData) => {
  console.log("Received pizzaAdded event:", newPizzaData);

  if (!pizzaList) return;

  const newPizza = document.createElement("li");

  const name = newPizzaData.name || "N/A";
  const ingredients = Array.isArray(newPizzaData.ingredients)
    ? newPizzaData.ingredients.join(", ")
    : newPizzaData.ingredients ? newPizzaData.ingredients : "No ingredients listed";
  const price = newPizzaData.price || "N/A";

  // Access properties DIRECTLY (no _doc needed):
  newPizza.innerHTML = `
    <p>Pizza Name: ${name}</p>
    <p>Ingredients: ${ingredients}</p>
    <p>Price: ${price}</p>
    <p>-------------------------</p>
  `;
  pizzaList.appendChild(newPizza);
});