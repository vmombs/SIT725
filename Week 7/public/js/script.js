const socket = io("http://localhost:3000");

const pizzaForm = document.getElementById("pizzaForm");

pizzaForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent page refresh

  const pizzaName = document.getElementById("name").value;
  const pizzaIngredients = document
    .getElementById("ingredients")
    .value.split(",");
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
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      // Uncomment the line below to show an alert message
      // alert("Pizza added successfully!"); 
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

socket.on("pizzaAdded", (newPizzaData) => {
  console.log("New pizza added from server:", newPizzaData);
  const pizzaList = document.getElementById("pizza-list");
  if (!pizzaList) {
    console.error("Pizza list element not found!");
    return; // Important: Exit early if the element isn't found
  }

  const newPizza = document.createElement("li");
  newPizza.innerHTML = `
    <p>Pizza Name: ${newPizzaData.name}</p>
    <p>Ingredients: ${newPizzaData.ingredients.join(", ")}</p>
    <p>Price: ${newPizzaData.price}</p>
    <p>-------------------------</p>
  `;
  pizzaList.appendChild(newPizza);
});
