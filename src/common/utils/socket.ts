import type http from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "./envConfig";
import { ExtendedError } from "socket.io/dist/namespace";

export const initSockets = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const authMiddleware = (
    socket: Socket,
    next: (err?: ExtendedError) => void
  ) => {
    const token = socket.handshake.auth.token;
    console.log({ token });

    if (!token) {
      next(new Error("no token"));
      return;
    }

    const verifiedJwt = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      role: "ADMIN" | "USER";
    };
    console.log({ role: verifiedJwt?.role });
    if (verifiedJwt?.role === "ADMIN" || verifiedJwt?.role === "USER") {
      next();
    } else {
      console.log("next vayena");
      next(new Error("invalid token"));
    }
  };

  io.use(authMiddleware);

  io.on("connection", (socket) => {
    socket.on("register", (data) => {
      console.log({ data });
    });

    socket.on("msg_sent_from_admin", (data) => {
      console.log({ data });
      io.emit("send_msg_to_user", data);
    });

    socket.on("msg_sent_from_user", (data) => {
      console.log({ data });
      io.emit("send_msg_to_admin", data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });

  io.engine.on("connection_error", (err) => {
    console.log("Error", err.req, err.message, err.context);
  });
};
