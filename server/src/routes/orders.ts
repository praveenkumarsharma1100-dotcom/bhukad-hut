import { Router, Request, Response } from "express";
import { db } from "../db/index.js";
import { orders, orderItems, menuItems } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, limit } = req.query;
    const lim = limit ? parseInt(limit as string) : 100;
    const result = status && typeof status === "string"
      ? await db.select().from(orders).where(eq(orders.status, status)).orderBy(desc(orders.createdAt)).limit(lim)
      : await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(lim);
    res.json(result);
  } catch (err) { console.error("Error fetching orders:", err); res.status(500).json({ error: "Failed to fetch orders" }); }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const rows = await db.select().from(orders).where(eq(orders.id, id));
    if (rows.length === 0) { res.status(404).json({ error: "Order not found" }); return; }
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    res.json({ ...rows[0], items });
  } catch (err) { res.status(500).json({ error: "Failed to fetch order" }); }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, tableNumber, notes, items } = req.body;
    if (!customerName || !customerPhone || !items || items.length === 0) {
      res.status(400).json({ error: "Customer name, phone, and at least one item required" }); return;
    }
    let total = 0;
    const resolvedItems = [];
    for (const item of items) {
      const rows = await db.select().from(menuItems).where(eq(menuItems.id, item.menuItemId));
      if (rows.length === 0) { res.status(400).json({ error: `Menu item ${item.menuItemId} not found` }); return; }
      const menuItem = rows[0];
      if (!menuItem.available) { res.status(400).json({ error: `${menuItem.name} is currently unavailable` }); return; }
      const subtotal = menuItem.price * item.quantity;
      total += subtotal;
      resolvedItems.push({ menuItemId: menuItem.id, menuItemName: menuItem.name, quantity: item.quantity, unitPrice: menuItem.price, subtotal });
    }
    const orderResult = await db.insert(orders).values({ customerName, customerPhone, tableNumber: tableNumber || null, notes: notes || null, total, status: "pending", paymentStatus: "pending" }).returning();
    const order = orderResult[0];
    for (const item of resolvedItems) {
      await db.insert(orderItems).values({ ...item, orderId: order.id });
    }
    const createdItems = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    res.status(201).json({ ...order, items: createdItems });
  } catch (err) { console.error("Error creating order:", err); res.status(500).json({ error: "Failed to create order" }); }
});

router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const valid = ["pending", "preparing", "ready", "completed"];
    if (!valid.includes(status)) { res.status(400).json({ error: `Invalid status. Must be: ${valid.join(", ")}` }); return; }
    const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    if (result.length === 0) { res.status(404).json({ error: "Order not found" }); return; }
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: "Failed to update order status" }); }
});

export default router;
