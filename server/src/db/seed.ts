import { db, client } from "./index.js";
import { menuItems, orders, orderItems } from "./schema.js";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...\n");

  // Create tables if they don't exist
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      available INTEGER NOT NULL DEFAULT 1,
      image_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      table_number TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      total REAL NOT NULL,
      notes TEXT,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id),
      menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
      menu_item_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      subtotal REAL NOT NULL
    );
  `);

  // Clear existing data
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(menuItems);

  console.log("📋 Inserting menu items...");

  const menuData = [
    { name: "Samosa", description: "Crispy golden pastry filled with spiced potatoes and peas, served with tangy mint chutney", price: 60, category: "Starters" },
    { name: "Paneer Tikka", description: "Cubes of cottage cheese marinated in yogurt and spices, chargrilled in tandoor", price: 220, category: "Starters" },
    { name: "Chicken Tikka", description: "Tender chicken pieces marinated in aromatic spices and grilled to smoky perfection", price: 280, category: "Starters" },
    { name: "Aloo Tikki", description: "Crispy spiced potato patties topped with yogurt, chutneys and sev", price: 80, category: "Starters" },
    { name: "Hara Bhara Kabab", description: "Spinach and green pea patties with a hint of mint, pan-fried until golden", price: 180, category: "Starters" },
    { name: "Butter Chicken", description: "Tender chicken in a rich, creamy tomato-butter gravy with fenugreek and spices", price: 320, category: "Main Course" },
    { name: "Dal Makhani", description: "Slow-cooked black lentils simmered overnight in butter and cream", price: 220, category: "Main Course" },
    { name: "Palak Paneer", description: "Silky spinach gravy with cubes of fresh cottage cheese and aromatic spices", price: 240, category: "Main Course" },
    { name: "Rogan Josh", description: "Tender lamb slow-cooked in a rich Kashmiri chili and yogurt gravy", price: 380, category: "Main Course" },
    { name: "Chicken Biryani", description: "Fragrant basmati rice layered with marinated chicken, saffron and dum-cooked spices", price: 300, category: "Main Course" },
    { name: "Chana Masala", description: "Hearty chickpeas simmered in a tangy tomato-onion gravy with cumin and coriander", price: 180, category: "Main Course" },
    { name: "Kadai Paneer", description: "Paneer cubes tossed with bell peppers in a spicy kadai masala", price: 260, category: "Main Course" },
    { name: "Fish Curry", description: "Fresh fish fillets simmered in a coastal-style coconut and tamarind curry", price: 340, category: "Main Course" },
    { name: "Mutton Rogan Josh", description: "Succulent mutton pieces braised in a fiery Kashmiri-style red gravy", price: 420, category: "Main Course" },
    { name: "Butter Naan", description: "Soft leavened bread brushed with melted butter, baked in clay tandoor", price: 50, category: "Breads" },
    { name: "Tandoori Roti", description: "Whole-wheat flatbread baked on the walls of a blazing tandoor oven", price: 30, category: "Breads" },
    { name: "Paratha", description: "Flaky layered flatbread, lightly pan-fried with ghee on a hot tawa", price: 45, category: "Breads" },
    { name: "Puri", description: "Deep-fried puffed bread, golden and light — perfect with any curry", price: 25, category: "Breads" },
    { name: "Garlic Naan", description: "Pillowy naan studded with roasted garlic and fresh coriander", price: 60, category: "Breads" },
    { name: "Veg Biryani", description: "Aromatic basmati rice layered with seasonal vegetables, saffron and whole spices", price: 240, category: "Rice & Biryani" },
    { name: "Mutton Biryani", description: "Royal dum biryani with succulent mutton, fragrant rice, and crispy fried onions", price: 380, category: "Rice & Biryani" },
    { name: "Jeera Rice", description: "Steamed basmati rice tempered with cumin seeds and ghee", price: 120, category: "Rice & Biryani" },
    { name: "Pulao", description: "Mildly spiced rice with mixed vegetables, cashews and raisins", price: 160, category: "Rice & Biryani" },
    { name: "Gulab Jamun", description: "Soft milk-solid dumplings soaked in warm rose and cardamom sugar syrup", price: 80, category: "Desserts" },
    { name: "Kheer", description: "Creamy rice pudding slow-cooked with milk, saffron, cardamom and dry fruits", price: 100, category: "Desserts" },
    { name: "Jalebi", description: "Crispy spiral-shaped sweet, deep-fried and soaked in saffron sugar syrup", price: 70, category: "Desserts" },
    { name: "Rasgulla", description: "Spongy cottage-cheese balls simmered in light sugar syrup", price: 90, category: "Desserts" },
    { name: "Lassi", description: "Thick and creamy yogurt drink churned with sugar and a touch of cardamom", price: 80, category: "Drinks" },
    { name: "Masala Chai", description: "Strong Indian tea brewed with ginger, cardamom and fresh whole milk", price: 40, category: "Drinks" },
    { name: "Fresh Lime Water", description: "Refreshing lime juice with a pinch of rock salt and cumin", price: 50, category: "Drinks" },
  ];

  for (const item of menuData) {
    await db.insert(menuItems).values(item);
  }
  console.log(`  ✅ Inserted ${menuData.length} menu items`);

  console.log("\n📦 Inserting sample orders...");
  const sampleOrders = [
    { customerName: "Rahul Sharma", customerPhone: "9876543210", tableNumber: "5", status: "completed", total: 710, notes: "Extra spicy butter chicken", paymentStatus: "paid" },
    { customerName: "Priya Patel", customerPhone: "9876543211", tableNumber: "3", status: "completed", total: 450, paymentStatus: "paid" },
    { customerName: "Amit Kumar", customerPhone: "9876543212", tableNumber: "8", status: "preparing", total: 840, notes: "No onion no garlic", paymentStatus: "pending" },
    { customerName: "Sneha Gupta", customerPhone: "9876543213", status: "pending", total: 320, notes: "Takeaway order", paymentStatus: "pending" },
    { customerName: "Vikram Singh", customerPhone: "9876543214", tableNumber: "1", status: "ready", total: 1150, notes: "Birthday party", paymentStatus: "paid" },
  ];
  for (const order of sampleOrders) {
    await db.insert(orders).values(order);
  }

  const orderItemsData = [
    { orderId: 1, menuItemId: 6, menuItemName: "Butter Chicken", quantity: 1, unitPrice: 320, subtotal: 320 },
    { orderId: 1, menuItemId: 15, menuItemName: "Butter Naan", quantity: 3, unitPrice: 50, subtotal: 150 },
    { orderId: 1, menuItemId: 28, menuItemName: "Lassi", quantity: 2, unitPrice: 80, subtotal: 160 },
    { orderId: 1, menuItemId: 24, menuItemName: "Gulab Jamun", quantity: 1, unitPrice: 80, subtotal: 80 },
    { orderId: 2, menuItemId: 7, menuItemName: "Dal Makhani", quantity: 1, unitPrice: 220, subtotal: 220 },
    { orderId: 2, menuItemId: 22, menuItemName: "Jeera Rice", quantity: 1, unitPrice: 120, subtotal: 120 },
    { orderId: 2, menuItemId: 29, menuItemName: "Masala Chai", quantity: 2, unitPrice: 40, subtotal: 80 },
    { orderId: 2, menuItemId: 16, menuItemName: "Tandoori Roti", quantity: 1, unitPrice: 30, subtotal: 30 },
    { orderId: 3, menuItemId: 2, menuItemName: "Paneer Tikka", quantity: 1, unitPrice: 220, subtotal: 220 },
    { orderId: 3, menuItemId: 12, menuItemName: "Kadai Paneer", quantity: 1, unitPrice: 260, subtotal: 260 },
    { orderId: 3, menuItemId: 19, menuItemName: "Garlic Naan", quantity: 2, unitPrice: 60, subtotal: 120 },
    { orderId: 3, menuItemId: 20, menuItemName: "Veg Biryani", quantity: 1, unitPrice: 240, subtotal: 240 },
    { orderId: 4, menuItemId: 6, menuItemName: "Butter Chicken", quantity: 1, unitPrice: 320, subtotal: 320 },
    { orderId: 5, menuItemId: 10, menuItemName: "Chicken Biryani", quantity: 2, unitPrice: 300, subtotal: 600 },
    { orderId: 5, menuItemId: 3, menuItemName: "Chicken Tikka", quantity: 1, unitPrice: 280, subtotal: 280 },
    { orderId: 5, menuItemId: 15, menuItemName: "Butter Naan", quantity: 4, unitPrice: 50, subtotal: 200 },
    { orderId: 5, menuItemId: 26, menuItemName: "Jalebi", quantity: 1, unitPrice: 70, subtotal: 70 },
  ];
  for (const item of orderItemsData) {
    await db.insert(orderItems).values(item);
  }
  console.log(`  ✅ Inserted ${sampleOrders.length} orders with ${orderItemsData.length} order items`);
  console.log("\n🎉 Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); });
