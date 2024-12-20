import { expect } from 'chai';
import mongoose from 'mongoose'; 
import Pizza from '../models/pizza_model.js';

describe('Pizza Model', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_db', { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should create a new pizza document', async () => {
    const pizza = new Pizza({ 
      name: 'Margherita', 
      ingredients: ['tomato', 'mozzarella', 'basil'], 
      price: 10 
    });

    await pizza.save();
    expect(pizza._id).to.exist; 
  });

  it('should validate minimum price', async () => {
    const pizza = new Pizza({ 
      name: 'Margherita', 
      ingredients: ['tomato', 'mozzarella', 'basil'], 
      price: -10 
    });

    try {
      await pizza.save();
      throw new Error('Validation should have failed');
    } catch (err) {
      expect(err.errors.price).to.exist; 
    }

  });

  // More tests for other validations, data transformations, etc.
});