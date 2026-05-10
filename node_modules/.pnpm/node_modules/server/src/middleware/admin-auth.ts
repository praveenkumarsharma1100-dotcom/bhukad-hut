import { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

export function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.session && req.session.isAdmin === true) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized — admin login required" });
  }
}
