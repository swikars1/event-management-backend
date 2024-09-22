import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import bodyParser from "body-parser";
import { cateringRouter } from "./api/catering/cateringRouter";
import { decorRouter } from "./api/decor/decorRouter";
import { eventRouter } from "./api/event/eventRouter";
import { ticketRouter } from "./api/ticket/ticketRouter";
import { themeRouter } from "./api/theme/themeRouter";
import { entertainmentRouter } from "./api/entertainment/entertainmentRouter";
import { accommodationRouter } from "./api/accommodation/accommodationRouter";
import { createServer } from "http";
import { initSockets } from "./common/utils/socket";
import { chatRouter } from "./api/chat/chatRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

const httpServer = createServer(app);

initSockets(httpServer);

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Middlewares
app.use(cors({ origin: "*" }));
app.use(helmet());
// app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);
app.use("/caterings", cateringRouter);
app.use("/decors", decorRouter);
app.use("/events", eventRouter);
app.use("/tickets", ticketRouter);
app.use("/themes", themeRouter);
app.use("/entertainments", entertainmentRouter);
app.use("/accommodations", accommodationRouter);
app.use("/chat", chatRouter);

// Swagger UI

// Error handlers
app.use(errorHandler());

export { httpServer, logger };
