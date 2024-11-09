import { Hono } from "hono";
import auth from "./routes/auth";
import { authMiddleware } from "./middleware/auth";
import roomRouter from "./routes/rooms";
import matchRouter from "./routes/matches";
import usersRouter from "./routes/users";
import chatRouter from "./routes/chat";
import reportRouter from "./routes/report";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    DIRECT_DATABASE_URL: string;
  };
}>();

// Apply global CORS middleware
app.use(cors({
  origin: 'https://nestmate.netlify.app', // or '*' for open access
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

// Custom middleware to handle OPTIONS preflight requests
app.use((c, next) => {
  if (c.req.method === 'OPTIONS') {
    // Respond with the correct headers for preflight requests
    c.header('Access-Control-Allow-Origin', 'https://nestmate.netlify.app');
    c.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header, Upgrade-Insecure-Requests');
    c.header('Access-Control-Expose-Headers', 'Content-Length, X-Kuma-Revision');
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header('Access-Control-Max-Age', '600');
    return c.text('', 204); // No content response for OPTIONS requests
  }
  return next(); // Proceed to the next middleware if not OPTIONS
});

// Define routes
// app.use(authMiddleware);
app.route("/auth", auth);
app.route("/users", usersRouter);
app.route("/rooms", roomRouter);
app.route("/matches", matchRouter);
app.route("/chats", chatRouter);
app.route("/reports", reportRouter);

export default app;
