import { Router, Request, Response } from "express";
import { db } from "../db/index.js";
import { menuItems } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, available } = req.query;
    const conditions = [];
    if (category && typeof category === "string") conditions.push(eq(menuItems.category, category));
    if (available !== undefined) conditions.push(eq(menuItems.available, available === "true"));

    const items = conditions.length > 0
      ? await db.select().from(menuItems).where(and(...conditions))
      : await db.select().from(menuItems);
    res.json(items);
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const result = await db.selectDistinct({ category: menuItems.category }).from(menuItems);
    res.json(result.map((r) => r.category));
  } catch (err) { res.status(500).json({ error: "Failed to fetch categories" }); }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const rows = await db.select().from(menuItems).where(eq(menuItems.id, id));
    if (rows.length === 0) { res.status(404).json({ error: "Menu item not found" }); return; }
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: "Failed to fetch menu item" }); }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, available, imageUrl } = req.body;
    if (!name || !description || price == null || !category) { res.status(400).json({ error: "Missing required fields" }); return; }
    const result = await db.insert(menuItems).values({ name, description, price: parseFloat(price), category, available: available !== false, imageUrl: imageUrl || null }).returning();
    res.status(201).json(result[0]);
  } catch (err) { console.error("Error creating menu item:", err); res.status(500).json({ error: "Failed to create menu item" }); }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, category, available, imageUrl } = req.body;
    const result = await db.update(menuItems).set({ name, description, price: price != null ? parseFloat(price) : undefined, category, available, imageUrl }).where(eq(menuItems.id, id)).returning();
    if (result.length === 0) { res.status(404).json({ error: "Menu item not found" }); return; }
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: "Failed to update menu item" }); }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(menuItems).where(eq(menuItems.id, id));
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Failed to delete menu item" }); }
});

router.patch("/:id/availability", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { available } = req.body;
    const result = await db.update(menuItems).set({ available }).where(eq(menuItems.id, id)).returning();
    if (result.length === 0) { res.status(404).json({ error: "Menu item not found" }); return; }
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: "Failed to update availability" }); }
});

export default router;
