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

  // Update the Map to store user info
  const onlineUsers = new Map<
    string,
    { socket: Socket; email: string; role: "ADMIN" | "USER" }
  >();

  const authMiddleware = (
    socket: Socket,
    next: (err?: ExtendedError) => void
  ) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication failed: No token provided"));
    }

    try {
      const verifiedJwt = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        email: string;
        role: "ADMIN" | "USER";
      };

      if (verifiedJwt.role !== "ADMIN" && verifiedJwt.role !== "USER") {
        return next(new Error("Authentication failed: Invalid role"));
      }

      socket.data.user = verifiedJwt;
      next();
    } catch (error) {
      return next(new Error("Authentication failed: Invalid token"));
    }
  };
  io.use(authMiddleware);

  io.on("connection", (socket) => {
    const user = socket.data.user as {
      id: string;
      email: string;
      role: "ADMIN" | "USER";
    };

    socket.on("register", (data) => {
      console.log({ register: user });
      // Add user to the onlineUsers map
      onlineUsers.set(user.id, { socket, email: user.email, role: user.role });
      // Emit updated online users list to all connected clients
      io.emit(
        "online_users",
        Array.from(onlineUsers.entries()).map(([id, { email, role }]) => ({
          id,
          email,
          role,
        }))
      );
    });

    socket.on("msg_sent_from_admin", (data) => {
      console.log({ msg_sent_from_admin: data });
    });

    socket.on("msg_sent_from_user", (data) => {
      console.log({ msg_sent_from_user: data });
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      // Remove user from the onlineUsers map
      onlineUsers.delete(user.id);
      // Emit updated online users list to all connected clients
      io.emit(
        "online_users",
        Array.from(onlineUsers.entries()).map(([id, { email, role }]) => ({
          id,
          email,
          role,
        }))
      );
    });
  });

  io.engine.on("connection_error", (err) => {
    console.log("Error", err.req, err.message, err.context);
  });
};
