import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { securityHeaders, apiRateLimiter, inputSanitizationMiddleware } from "./security";
import { initializeAITables } from "./db";
import { createServer } from "http";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

let appPromise: Promise<express.Express> | null = null;

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function createApp(): Promise<express.Express> {
  if (appPromise) {
    return appPromise;
  }

  appPromise = (async () => {
    const app = express();

    app.use(cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use(securityHeaders);
    app.use('/api', apiRateLimiter);
    app.use(inputSanitizationMiddleware);

    // Middleware to handle Vercel's pre-parsed JSON body
    app.use((req, res, next) => {
      // If Vercel already parsed the body into an object, preserve it
      if (req.body && typeof req.body === 'object' && req.headers['content-type']?.includes('application/json')) {
        // Body is already parsed, skip further parsing
        return next();
      }
      
      // Otherwise, proceed with normal JSON parsing
      next();
    });

    app.use(
      express.json({
        verify: (req, _res, buf) => {
          req.rawBody = buf;
        },
      }),
    );

    app.use(express.urlencoded({ extended: false }));

    // Middleware to handle cases where body might not be parsed correctly (serverless environments)
    app.use((req, res, next) => {
      // If body is a string and looks like JSON, parse it
      if (typeof req.body === 'string' && req.body.startsWith('{')) {
        try {
          req.body = JSON.parse(req.body);
        } catch {
          // If parsing fails, leave as is
        }
      }
      next();
    });

    app.use((req, res, next) => {
      const start = Date.now();
      const path = req.path;
      let capturedJsonResponse: Record<string, any> | undefined = undefined;

      const originalResJson = res.json;
      res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
      };

      res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
          let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
          if (capturedJsonResponse) {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          }
          log(logLine);
        }
      });

      next();
    });

    await initializeAITables();
    
    const httpServer = createServer(app);
    await registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    return app;
  })();

  return appPromise;
}
