import { Router, Request, Response } from "express";

const router = Router();

// POST /api/auth/login
router.post("/login", (req: Request, res: Response) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "bhukad@admin123";

  if (password === adminPassword) {
    req.session.isAdmin = true;
    res.json({ success: true, message: "Logged in as admin" });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Failed to logout" });
      return;
    }
    res.clearCookie("bhukad.sid");
    res.json({ success: true });
  });
});

// GET /api/auth/me — check auth status
router.get("/me", (req: Request, res: Response) => {
  res.json({ isAdmin: req.session?.isAdmin === true });
});

export default router;
