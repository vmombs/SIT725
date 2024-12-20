import { expect } from 'chai';
import mongoose from 'mongoose'; 
import PizzaService from '../models/pizza_service.js';

describe('PizzaService', () => {
  let pizzaService;

  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_db', { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    pizzaService = new PizzaService('mongodb://localhost:27017/test_db'); 
    await pizzaService.connect();
  });

  afterEach(async () => {
    await pizzaService.close();
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should insert a new pizza', async () => {
    const pizza = { 
      name: 'Pepperoni', 
      ingredients: ['tomato', 'mozzarella', 'pepperoni'], 
      price: 12 
    };
    const result = await pizzaService.insertPizza(pizza);
    expect(result.insertedId).to.exist;
  });

  it('should fetch all pizzas', async () => {
    const pizzas = await pizzaService.fetchAllPizzas();
    expect(pizzas).to.be.an('array'); 
  });

  // More tests for other service methods
});