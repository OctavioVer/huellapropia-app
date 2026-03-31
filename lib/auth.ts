import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  nombre: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "30d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: Request): TokenPayload | null {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return verifyToken(auth.split(" ")[1]);
}
