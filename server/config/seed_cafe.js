const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const menuItems = [
  // Breakfast
  { item_name: "Idli (2 Pcs) with Sambar & Chutney", item_type: "breakfast", price: 20.00, is_available: true },
  { item_name: "Dosa with Chutney", item_type: "breakfast", price: 25.00, is_available: true },
  { item_name: "Masala Dosa", item_type: "breakfast", price: 35.00, is_available: true },
  { item_name: "Pongal", item_type: "breakfast", price: 30.00, is_available: true },
  { item_name: "Poori (2 Pcs) with Masala", item_type: "breakfast", price: 30.00, is_available: true },
  { item_name: "Vada (1 Pc)", item_type: "breakfast", price: 10.00, is_available: true },
  
  // Lunch
  { item_name: "South Indian Meals (Unlimited)", item_type: "lunch", price: 60.00, is_available: true },
  { item_name: "Vegetable Biryani", item_type: "lunch", price: 50.00, is_available: true },
  { item_name: "Lemon Rice", item_type: "lunch", price: 35.00, is_available: true },
  { item_name: "Curd Rice", item_type: "lunch", price: 30.00, is_available: true },
  { item_name: "Chapathi (2 Pcs) with Kurma", item_type: "lunch", price: 40.00, is_available: true },
  { item_name: "Paneer Butter Masala & Roti", item_type: "lunch", price: 70.00, is_available: false },
  
  // Snacks
  { item_name: "Samosa", item_type: "snacks", price: 15.00, is_available: true },
  { item_name: "Puff (Veg)", item_type: "snacks", price: 20.00, is_available: true },
  { item_name: "Puff (Egg)", item_type: "snacks", price: 25.00, is_available: true },
  { item_name: "Bajji / Bonda", item_type: "snacks", price: 10.00, is_available: true },
  
  // Beverages
  { item_name: "Tea", item_type: "beverage", price: 10.00, is_available: true },
  { item_name: "Coffee", item_type: "beverage", price: 15.00, is_available: true },
  { item_name: "Fresh Lime Juice", item_type: "beverage", price: 20.00, is_available: true },
  { item_name: "Rose Milk", item_type: "beverage", price: 25.00, is_available: true }
];

async function seedCafeMenu() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("Connected to DB. Seeding Cafe Menu...");
    
    // Clear existing menu to prevent duplicates during testing
    await connection.query("TRUNCATE TABLE canteen_menu");

    const query = "INSERT INTO canteen_menu (item_name, item_type, price, is_available) VALUES (?, ?, ?, ?)";
    
    for (const item of menuItems) {
      await connection.query(query, [item.item_name, item.item_type, item.price, item.is_available]);
    }

    console.log("Cafe Menu seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding cafe menu:", err);
    process.exit(1);
  }
}

seedCafeMenu();


process.exit(0);
