import mongoose from "mongoose";
import { env } from "../config/env";
import { Category } from "../models/Category";
import { MenuItem } from "../models/MenuItem";

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log("Connected for seeding...");

  await Category.deleteMany({});
  await MenuItem.deleteMany({});

  const categories = await Category.insertMany([
    { name: "Starters", restaurantId: "r1" },
    { name: "Main Dishes", restaurantId: "r1" },
    { name: "Pizza & Pasta", restaurantId: "r1" },
    { name: "Burgers & Sandwiches", restaurantId: "r1" },
    { name: "Desserts", restaurantId: "r1" },
    { name: "Drinks", restaurantId: "r1" },
  ]);

  const [starters, mains, pizzaPasta, burgers, desserts, drinks] = categories;

  await MenuItem.insertMany([
    // --- Starters ---
    {
      name: "Brik à l'oeuf",
      description: "Crispy pastry filled with egg, tuna, and parsley",
      price: 6.5,
      categoryId: starters._id.toString(),
      allergens: ["egg", "gluten", "fish"],
      tags: ["trending"],
    },
    {
      name: "Salade Mechouia",
      description: "Grilled pepper and tomato salad",
      price: 5,
      categoryId: starters._id.toString(),
      isVegetarian: true,
      isVegan: true,
      tags: ["vegetarian", "vegan"],
    },
    {
      name: "Bruschetta",
      description: "Toasted bread topped with tomato, basil, and olive oil",
      price: 7,
      categoryId: starters._id.toString(),
      isVegetarian: true,
      allergens: ["gluten"],
      tags: ["vegetarian"],
    },
    {
      name: "Spring Rolls",
      description: "Crispy rolls filled with vegetables, served with sweet chili sauce",
      price: 6,
      categoryId: starters._id.toString(),
      isVegetarian: true,
      isVegan: true,
      allergens: ["gluten"],
      tags: ["vegetarian", "vegan"],
    },
    {
      name: "Hummus & Pita",
      description: "Creamy chickpea hummus served with warm pita bread",
      price: 5.5,
      categoryId: starters._id.toString(),
      isVegetarian: true,
      isVegan: true,
      allergens: ["gluten", "sesame"],
      tags: ["vegetarian", "vegan"],
    },

    // --- Main Dishes ---
    {
      name: "Couscous Royal",
      description: "Traditional couscous with lamb, chicken, and merguez",
      price: 18,
      categoryId: mains._id.toString(),
      tags: ["chef-recommendation", "spicy"],
    },
    {
      name: "Grilled Lamb Chops",
      description: "Tender lamb chops grilled with herbs, served with roasted potatoes",
      price: 22,
      categoryId: mains._id.toString(),
      tags: ["chef-recommendation"],
    },
    {
      name: "Chicken Tagine",
      description: "Slow-cooked chicken with olives, preserved lemon, and spices",
      price: 16,
      categoryId: mains._id.toString(),
      tags: ["trending"],
    },
    {
      name: "Beef Steak Frites",
      description: "Grilled beef steak served with crispy fries",
      price: 20,
      categoryId: mains._id.toString(),
      tags: [],
    },
    {
      name: "Grilled Salmon",
      description: "Fresh salmon fillet grilled with lemon butter sauce",
      price: 19,
      categoryId: mains._id.toString(),
      allergens: ["fish"],
      tags: ["healthy"],
    },
    {
      name: "Chicken Shawarma Plate",
      description: "Marinated chicken shawarma with rice, salad, and garlic sauce",
      price: 14,
      categoryId: mains._id.toString(),
      tags: ["trending"],
    },
    {
      name: "Kefta Mkaouara",
      description: "Spiced meatballs simmered in tomato sauce with baked eggs",
      price: 15,
      categoryId: mains._id.toString(),
      allergens: ["egg"],
      tags: ["spicy"],
    },

    // --- Pizza & Pasta ---
    {
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12,
      categoryId: pizzaPasta._id.toString(),
      isVegetarian: true,
      allergens: ["gluten", "dairy"],
      tags: ["vegetarian"],
    },
    {
      name: "Pepperoni Pizza",
      description: "Pizza topped with pepperoni and mozzarella cheese",
      price: 14,
      categoryId: pizzaPasta._id.toString(),
      allergens: ["gluten", "dairy"],
      tags: ["best-seller"],
    },
    {
      name: "Spaghetti Bolognese",
      description: "Spaghetti with slow-cooked beef and tomato ragu",
      price: 13,
      categoryId: pizzaPasta._id.toString(),
      allergens: ["gluten"],
      tags: [],
    },
    {
      name: "Fettuccine Alfredo",
      description: "Creamy parmesan sauce tossed with fettuccine pasta",
      price: 13.5,
      categoryId: pizzaPasta._id.toString(),
      isVegetarian: true,
      allergens: ["gluten", "dairy"],
      tags: ["vegetarian"],
    },
    {
      name: "Penne Arrabbiata",
      description: "Penne pasta in a spicy tomato and chili sauce",
      price: 12.5,
      categoryId: pizzaPasta._id.toString(),
      isVegetarian: true,
      isVegan: true,
      allergens: ["gluten"],
      tags: ["vegetarian", "vegan", "spicy"],
    },

    // --- Burgers & Sandwiches ---
    {
      name: "Classic Beef Burger",
      description: "Beef patty with lettuce, tomato, cheese, and house sauce",
      price: 11,
      categoryId: burgers._id.toString(),
      allergens: ["gluten", "dairy"],
      tags: ["best-seller"],
    },
    {
      name: "Chicken Burger",
      description: "Crispy chicken fillet burger with mayo and pickles",
      price: 10.5,
      categoryId: burgers._id.toString(),
      allergens: ["gluten", "egg"],
      tags: [],
    },
    {
      name: "Veggie Burger",
      description: "Grilled vegetable and chickpea patty with tahini sauce",
      price: 10,
      categoryId: burgers._id.toString(),
      isVegetarian: true,
      isVegan: true,
      allergens: ["gluten", "sesame"],
      tags: ["vegetarian", "vegan"],
    },
    {
      name: "Club Sandwich",
      description: "Triple-layer sandwich with chicken, egg, lettuce, and tomato",
      price: 9.5,
      categoryId: burgers._id.toString(),
      allergens: ["gluten", "egg"],
      tags: [],
    },
    {
      name: "Falafel Wrap",
      description: "Crispy falafel wrapped with fresh veggies and tahini sauce",
      price: 8,
      categoryId: burgers._id.toString(),
      isVegetarian: true,
      isVegan: true,
      allergens: ["gluten", "sesame"],
      tags: ["vegetarian", "vegan"],
    },

    // --- Desserts ---
    {
      name: "Makroudh",
      description: "Semolina cake filled with dates, fried and dipped in honey",
      price: 4,
      categoryId: desserts._id.toString(),
      isVegetarian: true,
      allergens: ["gluten"],
      tags: [],
    },
    {
      name: "Tiramisu",
      description: "Classic Italian dessert with mascarpone and coffee-soaked ladyfingers",
      price: 6,
      categoryId: desserts._id.toString(),
      isVegetarian: true,
      allergens: ["dairy", "egg", "gluten"],
      tags: ["best-seller"],
    },
    {
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
      price: 7,
      categoryId: desserts._id.toString(),
      isVegetarian: true,
      allergens: ["dairy", "egg", "gluten"],
      tags: ["chef-recommendation"],
    },
    {
      name: "Baklava",
      description: "Layered filo pastry with honey and crushed pistachios",
      price: 5,
      categoryId: desserts._id.toString(),
      isVegetarian: true,
      allergens: ["gluten", "nuts"],
      tags: [],
    },
    {
      name: "Fruit Salad",
      description: "Fresh seasonal fruit medley",
      price: 5,
      categoryId: desserts._id.toString(),
      isVegetarian: true,
      isVegan: true,
      tags: ["vegetarian", "vegan", "healthy"],
    },

    // --- Drinks ---
    {
      name: "Citronnade",
      description: "Fresh Tunisian lemonade with mint",
      price: 3,
      categoryId: drinks._id.toString(),
      isVegetarian: true,
      isVegan: true,
      tags: ["vegetarian", "vegan"],
    },
    {
      name: "Mint Tea",
      description: "Traditional Tunisian mint tea with pine nuts",
      price: 2.5,
      categoryId: drinks._id.toString(),
      isVegetarian: true,
      isVegan: true,
      allergens: ["nuts"],
      tags: ["vegetarian", "vegan"],
    },
    {
      name: "Fresh Orange Juice",
      description: "Freshly squeezed orange juice",
      price: 4,
      categoryId: drinks._id.toString(),
      isVegetarian: true,
      isVegan: true,
      tags: ["vegetarian", "vegan", "healthy"],
    },
    {
      name: "Cola",
      description: "Chilled soft drink",
      price: 2.5,
      categoryId: drinks._id.toString(),
      isVegetarian: true,
      isVegan: true,
      tags: ["vegetarian", "vegan"],
    },
    {
      name: "Sparkling Water",
      description: "Chilled sparkling mineral water",
      price: 2,
      categoryId: drinks._id.toString(),
      isVegetarian: true,
      isVegan: true,
      tags: ["vegetarian", "vegan"],
    },
  ]);

  console.log("Seed complete!");
  await mongoose.disconnect();
}

seed();