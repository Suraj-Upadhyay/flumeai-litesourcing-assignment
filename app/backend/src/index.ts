import fastify from "fastify";
import cookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";

import { CreateRequestContext, errorHandler } from "@/middlewares";
import { v1Router } from "./routes";

const PORT = Number(process.env.PORT) || 3001;

const app = fastify({
  logger: true,
  ajv: {
    customOptions: {
      allowUnionTypes: true,
    },
  },
});

// Request Context Middleware
await app.register(CreateRequestContext);

// CORS
await app.register(fastifyCors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      "http://localhost:3000",
      process.env.FRONTEND_ORIGIN,
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
});

// Cookies
await app.register(cookie);

// v1 routes
await app.register(v1Router, { prefix: "/api/v1" });

// Health check route
app.get("/", async (_, reply) => {
  return reply.status(200).send("Welcome to LiteSourcing!");
});

// Error handler
app.register(errorHandler);

try {
  if (process.env.NODE_ENV !== "test") {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    await app.ready();
    console.log(`🚀 Server listening on port ${PORT}`);
  }
} catch (error) {
  console.log("error: ", error);
}

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION", err);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION", err);
});

export default app;
