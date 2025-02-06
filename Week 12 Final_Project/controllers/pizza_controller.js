const PizzaService = require("../models/pizza_service");
const Pizza = require("../models/pizza_model");

class PizzaController {

  async fetchPizzas(req, res) {
    const pizzaService = new PizzaService();
    try {
      await pizzaService.connect(); // Wait for the connection to complete
      const pizzas = await pizzaService.fetchAllPizzas();
      res.render("index", { pizzas });
    } catch (err) {
      console.error("Error fetching pizzas:", err);
      res.status(500).send("Error fetching pizzas");
    } finally {
      await pizzaService.close(); // Close the connection
    }
  }

  async createPizza(req) {
    const { name, ingredients, price } = req.body;
    const pizzaService = new PizzaService();

    try {
      await pizzaService.connect(); // Connect using the centralized connection
      const newPizza = new Pizza({
        name,
        ingredients,
        price,
      });

      const savedPizza = await pizzaService.insertPizza(newPizza);
      const pizza = savedPizza._doc;
      return pizza;
    } catch (err) {
      console.error("Error creating pizza:", err);
      throw err;
    } finally {
      await pizzaService.close();
    }
  }
}

module.exports = PizzaController;
