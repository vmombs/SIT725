const PizzaService = require('../models/pizza_service');
const Pizza = require('../models/pizza_model');

class PizzaController {

    async createPizza(req) {
        const { name, ingredients, price } = req.body;

        const pizzaService = new PizzaService("mongodb://localhost:27017/");
        await pizzaService.connect();

        try {
            const newPizza = new Pizza({
                name,
                ingredients,
                price
            });

            const savedPizza = await pizzaService.insertPizza(newPizza);

            // Accessing the actual pizza object:
            const pizza = savedPizza._doc; // The actual pizza data is under the _doc property

            return pizza; // Return the actual pizza

        } catch (err) {
            console.error('Error creating pizza:', err);
            throw err; // Re-throw the error
        } finally {
            await pizzaService.close();
        }
    }

    async fetchPizzas(req, res) {

        const pizzaService = new PizzaService("mongodb://localhost:27017/");
        await pizzaService.connect();

        try {
            const pizzas = await pizzaService.fetchAllPizzas();
            console.log(pizzas);
            res.render('index', { pizzas }); // We're using EJS templating engine
        } catch (err) {
            console.error('Error fetching pizzas:', err);
            res.status(500).send('Error fetching pizzas');
        } finally {
            await pizzaService.close();
        }

      }
}

module.exports = PizzaController;