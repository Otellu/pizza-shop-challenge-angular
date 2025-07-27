const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Pizza = require('./src/models/Pizza');
const Order = require('./src/models/Order');
require('dotenv').config();

// Pizza name generators
const vegPizzaNames = [
  'Margherita Classic', 'Veggie Delight', 'Cheese Burst', 'Garden Fresh',
  'Mediterranean Veggie', 'Spinach & Feta', 'Four Cheese', 'Pesto Paradise',
  'Roasted Vegetable', 'Caprese', 'Truffle Mushroom', 'Artichoke Delight',
  'Greek Goddess', 'Veggie Supreme', 'Farm Fresh', 'Paneer Tikka',
  'Mexican Veggie', 'Thai Veggie', 'Corn & Capsicum', 'Olive Special',
  'Zucchini Zoom', 'Avocado Dream', 'Ultimate Veggie', 'Yellow Pepper Special',
  'Zero Meat Hero'
];

const nonVegPizzaNames = [
  'Pepperoni Classic', 'BBQ Chicken', 'Meat Lovers', 'Hawaiian',
  'Bacon Ranch', 'Buffalo Chicken', 'Supreme', 'Chicken Tikka',
  'Sausage Sensation', 'Ham & Pineapple', 'Spicy Italian', 'Chicken Fajita',
  'Seafood Special', 'Prawn Delight', 'Tuna Melt', 'Beef Bonanza',
  'Pulled Pork', 'Chorizo Fire', 'Duck Deluxe', 'Lamb Kofta',
  'Smoky BBQ Beef', 'Triple Meat', 'Ultimate Non-Veg', 'Xtra Meat Xplosion',
  'Zesty Chicken'
];

const descriptions = [
  'A classic Italian favorite with fresh ingredients',
  'Loaded with premium toppings and extra cheese',
  'Our signature recipe passed down through generations',
  'Hand-tossed dough with authentic flavors',
  'Made with locally sourced ingredients',
  'A perfect blend of spices and fresh herbs',
  'Crispy crust with generous toppings',
  'Chef\'s special recipe with secret sauce',
  'Traditional wood-fired oven baked',
  'A delightful combination of flavors'
];

async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://pizzauser:pizzapass@localhost:27017/testdb?authSource=testdb';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Pizza.deleteMany({});
  await Order.deleteMany({});
  console.log('Database cleared');
}

async function seedUsers() {
  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('test1234', 10);
  
  const users = [
    {
      _id: new mongoose.Types.ObjectId(),
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'user',
      address:'123 Main St, Anytown, USA'
    },
    {
      _id: new mongoose.Types.ObjectId(),
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      address:'123 Main St, Anytown, USA'
    },
    {
      _id: new mongoose.Types.ObjectId(),
      email: 'testuser1@example.com',
      password: hashedPassword,
      name: 'Test User 1',
      role: 'user',
      address:'123 Main St, Anytown, USA'
    },
    {
      _id: new mongoose.Types.ObjectId(),
      email: 'testuser2@example.com',
      password: hashedPassword,
      name: 'Test User 2',
      role: 'user',
      address:'123 Main St, Anytown, USA'
    }
  ];

  await User.insertMany(users);
  console.log(`Created ${users.length} users`);
  return users;
}

async function seedPizzas() {
  console.log('Seeding pizzas...');
  const pizzas = [];
  
  // Create vegetarian pizzas
  for (let i = 0; i < vegPizzaNames.length; i++) {
    const basePrice = 8.99 + (i * 0.6);
    const price = Math.round(basePrice * 100) / 100;
    const daysAgo = Math.floor(Math.random() * 60);
    
    pizzas.push({
      _id: new mongoose.Types.ObjectId(),
      name: vegPizzaNames[i],
      price: price,
      description: descriptions[i % descriptions.length],
      imageUrl: `https://images.unsplash.com/photo-${1565299624 + i}-pizza?w=400&h=300&fit=crop`,
      isVegetarian: true,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    });
  }
  
  // Create non-vegetarian pizzas
  for (let i = 0; i < nonVegPizzaNames.length; i++) {
    const basePrice = 10.99 + (i * 0.7);
    const price = Math.round(basePrice * 100) / 100;
    const daysAgo = Math.floor(Math.random() * 60);
    
    pizzas.push({
      _id: new mongoose.Types.ObjectId(),
      name: nonVegPizzaNames[i],
      price: price,
      description: descriptions[i % descriptions.length],
      imageUrl: `https://images.unsplash.com/photo-${1574126154 + i}-pizza?w=400&h=300&fit=crop`,
      isVegetarian: false,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    });
  }
  
  // Add edge case pizzas
  pizzas.push(
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Super Long Pizza Name That Tests UI Boundaries And Text Wrapping In Components',
      price: 15.99,
      description: 'A pizza with an extremely long name to test UI limits',
      imageUrl: 'https://images.unsplash.com/photo-1565299624-pizza?w=400&h=300&fit=crop',
      isVegetarian: true,
      createdAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Special @#$% Characters Pizza!',
      price: 0.01,
      description: 'Testing special characters and minimum price',
      imageUrl: 'https://images.unsplash.com/photo-1565299625-pizza?w=400&h=300&fit=crop',
      isVegetarian: false,
      createdAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Premium Luxury Pizza',
      price: 999.99,
      description: 'The most expensive pizza for testing price boundaries',
      imageUrl: 'https://images.unsplash.com/photo-1565299626-pizza?w=400&h=300&fit=crop',
      isVegetarian: true,
      createdAt: new Date()
    }
  );
  
  await Pizza.insertMany(pizzas);
  console.log(`Created ${pizzas.length} pizzas`);
  return pizzas;
}

async function seedOrders(users, pizzas) {
  console.log('Seeding orders...');
  const orders = [];
  const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  const statusCounts = { pending: 5, confirmed: 3, preparing: 2, out_for_delivery: 2, delivered: 5, cancelled: 1 };
  
  let orderIndex = 0;
  
  for (const [status, count] of Object.entries(statusCounts)) {
    for (let i = 0; i < count; i++) {
      const user = users[orderIndex % users.length];
      const itemCount = Math.floor(Math.random() * 4) + 1;
      const items = [];
      let totalAmount = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const pizza = pizzas[Math.floor(Math.random() * pizzas.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = pizza.price * quantity;
        totalAmount += itemTotal;
        
        items.push({
          id: pizza._id.toString(),
          name: pizza.name,
          price: pizza.price,
          quantity: quantity
        });
      }
      
      const daysAgo = status === 'pending' ? Math.random() * 0.01 : Math.random() * 30;
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const updatedAt = new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000);
      
      const order = {
        _id: new mongoose.Types.ObjectId(),
        user: user._id,
        items: items,
        status: status,
        deliveryAddress: `${100 + orderIndex} Main Street, City, State ${10000 + orderIndex}`,
        totalAmount: Math.round(totalAmount * 100) / 100,
        createdAt: createdAt,
        updatedAt: updatedAt
      };
      
      // Add complaints to some delivered orders
      if (status === 'delivered' && i < 2) {
        order.complaint = {
          complaintType: ['Quality Issue', 'Delivery Problem', 'Wrong Order'][i % 3],
          description: 'This is a test complaint for e2e testing purposes with more than 20 characters',
          email: user.email,
          phone: '+919876543210',
          createdAt: new Date(updatedAt.getTime() + 24 * 60 * 60 * 1000)
        };
      }
      
      orders.push(order);
      orderIndex++;
    }
  }
  
  // Add some very recent orders for polling tests
  for (let i = 0; i < 3; i++) {
    const user = users[i % users.length];
    const pizza = pizzas[i];
    
    orders.push({
      _id: new mongoose.Types.ObjectId(),
      user: user._id,
      items: [{
        id: pizza._id.toString(),
        name: pizza.name,
        price: pizza.price,
        quantity: 1
      }],
      status: 'pending',
      deliveryAddress: `${200 + i} Test Avenue, Test City, TS 20000`,
      totalAmount: pizza.price,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  await Order.insertMany(orders);
  console.log(`Created ${orders.length} orders`);
}

async function seed() {
  try {
    await connectDB();
    await clearDatabase();
    
    const users = await seedUsers();
    const pizzas = await seedPizzas();
    await seedOrders(users, pizzas);
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Pizzas: ${pizzas.length} (${vegPizzaNames.length} veg, ${nonVegPizzaNames.length} non-veg, 3 edge cases)`);
    console.log('- Orders: 21 (various statuses including recent ones for polling)');
    console.log('\nTest credentials:');
    console.log('- User: user@example.com / test1234');
    console.log('- Admin: admin@example.com / test1234');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seed();