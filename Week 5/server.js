const express = require('express');
const path = require('path');
const ejs = require("ejs");
const PizzaController = require('./controllers/pizza_controller');

const app = express();

app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.set('view engine', 'ejs'); // Set EJS as the view engine

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.port || 3000;

app.listen(port,()=>{
  console.log("App listening to: "+port)
})

const pizzaController = new PizzaController();

// Handle form submission
app.post('/create-pizza', pizzaController.createPizza);

// Define a route to render the index.ejs. The actual rendering is done in the pizza controller
app.get('/', pizzaController.fetchPizzas);