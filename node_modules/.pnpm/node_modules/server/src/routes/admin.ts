import { Router, Request, Response } from "express";
import { db } from "../db/index.js";
import { orders, menuItems } from "../db/schema.js";
import { sql, eq, count, sum } from "drizzle-orm";
import { requireAdminAuth } from "../middleware/admin-auth.js";

const router = Router();
router.use(requireAdminAuth);

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const [totalStats] = await db.select({ totalOrders: count(orders.id), totalRevenue: sum(orders.total) }).from(orders);
    const [todayStats] = await db.select({ todayOrders: count(orders.id), todayRevenue: sum(orders.total) }).from(orders).where(sql`date(${orders.createdAt}) = ${today}`);
    const [pendingStats] = await db.select({ pendingOrders: count(orders.id) }).from(orders).where(eq(orders.status, "pending"));
    const [menuStats] = await db.select({ menuItemCount: count(menuItems.id), availableMenuItems: sum(sql`CASE WHEN ${menuItems.available} = 1 THEN 1 ELSE 0 END`) }).from(menuItems);

    res.json({
      totalOrders: totalStats?.totalOrders || 0,
      totalRevenue: parseFloat(String(totalStats?.totalRevenue || 0)),
      todayOrders: todayStats?.todayOrders || 0,
      todayRevenue: parseFloat(String(todayStats?.todayRevenue || 0)),
      pendingOrders: pendingStats?.pendingOrders || 0,
      menuItemCount: menuStats?.menuItemCount || 0,
      availableMenuItems: parseInt(String(menuStats?.availableMenuItems || 0)),
    });
  } catch (err) { console.error("Error fetching admin stats:", err); res.status(500).json({ error: "Failed to fetch stats" }); }
});

router.get("/billing", async (req: Request, res: Response) => {
  try {
    const days = parseInt((req.query.days as string) || "14");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];
    const result = await db.select({
      date: sql<string>`date(${orders.createdAt})`.as("date"),
      revenue: sum(orders.total).as("revenue"),
      orderCount: count(orders.id).as("order_count"),
    }).from(orders).where(sql`date(${orders.createdAt}) >= ${startDateStr}`).groupBy(sql`date(${orders.createdAt})`).orderBy(sql`date(${orders.createdAt})`);

    res.json(result.map((r) => ({ date: r.date, revenue: parseFloat(String(r.revenue || 0)), orderCount: r.orderCount })));
  } catch (err) { console.error("Error fetching billing:", err); res.status(500).json({ error: "Failed to fetch billing data" }); }
});

export default router;
