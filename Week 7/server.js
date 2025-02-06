// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

const express = require("express");

// Creating express app and configuring middleware below
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketManager = require('./socketManager');

socketManager.initialize(server); // Initialize io

const io = socketManager.getIO();

const path = require('path');
const ejs = require("ejs");
const PizzaController = require('./controllers/pizza_controller');

// global.io = io; // Make socket.io available globally

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pizzaController = new PizzaController();

// app.post('/create-pizza', async (req, res) => {
//   try {
//     const pizza = await pizzaController.createPizza(req, res); // Save to DB

//     //Check if io is available globally first
//     if (global.io) {
//       global.io.emit('pizzaAdded', pizza);
//     } else {
//       console.error("Socket.IO server not found");
//     }
//     res.status(201).json(pizza); 
//   } catch (error) {
//     console.log("Error: ", error);
//     res.status(500).json({ error: 'Failed to create pizza' });
//   }
// });

app.post('/create-pizza', async (req, res) => {
  try {
    const pizza = await pizzaController.createPizza(req, res); // Save to DB

    try {
      io.emit('pizzaAdded', pizza);
      console.log("io object present in route"); 
    } catch (error) {
      console.error("Socket.IO server not initialized:", error.message);
      // Send a status code message
      res.status(500).json({ error: 'Failed to create pizza (real-time update unavailable)' });
    }

    res.status(201).json(pizza); 
  } catch (error) {
    console.error("Error creating pizza:", error);
    res.status(500).json({ error: 'Failed to create pizza' });
  }
});

app.get('/', pizzaController.fetchPizzas);

const port = process.env.PORT || 3000;
server.listen(port, () => { // Important: Only start listening AFTER setting up Socket.IO
  console.log(`Server listening on port ${port}`);
});