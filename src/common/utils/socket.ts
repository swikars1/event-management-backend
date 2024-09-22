import type http from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "./envConfig";
import { ExtendedError } from "socket.io/dist/namespace";
import { prisma } from "./prismaInstance";
import { logger } from "@/server";

// Types for socket emit events
interface OnlineUser {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface MessageData {
  id: string;
  senderId: string;
  senderEmail: string;
  senderRole: "ADMIN" | "USER";
  message: string;
  timestamp: string;
  recipientId?: string; // Only for ADMIN
}

interface UserChat {
  id: string;
  email: string;
  lastMessage: string | null;
  lastMessageTime: Date | null;
}

interface ChatHistoryMessage {
  id: string;
  chatId: string;
  senderId: string;
  message: string;
  createdAt: Date;
  sender: {
    id: string;
    email: string;
    role: "ADMIN" | "USER";
  };
}

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
      logger.warn("Authentication failed: No token provided");
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
      logger.info(`User authenticated: ${verifiedJwt.email}`);
      next();
    } catch (error) {
      logger.error("Authentication failed: Invalid token", { error });
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
    logger.info(`New socket connection: ${user.email}`, {
      userId: user.id,
      role: user.role,
    });

    socket.on("register", (data) => {
      logger.info(`User registered: ${user.email}`, {
        userId: user.id,
        role: user.role,
      });
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

    // New chat events
    socket.on(
      "send_message_from_admin",
      async (data: { recipientId: string; message: string }) => {
        const { recipientId, message } = data;
        const sender = onlineUsers.get(user.id);
        const recipient = onlineUsers.get(recipientId);

        if (sender && recipient) {
          try {
            // Refactored data layer logic
            const newMessage = await createOrUpdateChatAndMessage(
              user.id,
              recipientId,
              message
            );

            const messageData = formatMessageData(newMessage, user);

            // Send message to recipient
            recipient.socket.emit("receive_message", messageData);

            // If sender is ADMIN, also emit the message back to them
            if (user.role === "ADMIN") {
              sender.socket.emit("receive_message", {
                ...messageData,
                recipientId,
              });
            }
            logger.info(
              `Message sent from ${user.email} to ${recipient.email}`,
              {
                senderId: user.id,
                recipientId: data.recipientId,
              }
            );
          } catch (error) {
            logger.error("Error sending message:", {
              error,
              userId: user.id,
              recipientId: data.recipientId,
            });
            socket.emit("error", "Failed to send message");
          }
        } else {
          if (sender && !recipient) {
            try {
              const newMessage = await createOrUpdateChatAndMessage(
                user.id,
                recipientId,
                message
              );
            } catch (e) {
              logger.error("Error create Or Update Chat And Message :", {
                e,
                userId: user.id,
                recipientId: recipientId,
              });
            }
          }
          logger.warn(
            "Message saved but not sent: Sender or recipient not found",
            {
              senderId: user.id,
              recipientId: data.recipientId,
            }
          );
        }
      }
    );

    socket.on("send_message_from_user", async (data: { message: string }) => {
      const { message } = data;
      const sender = onlineUsers.get(user.id);

      const admin = await prisma.user.findFirst({
        where: {
          role: "ADMIN",
        },
      });

      const recipientId = admin?.id;

      logger.info("recipientId", {
        recipientId,
      });

      if (!recipientId) {
        logger.warn("Message not sent: Recipient id not found", {
          senderId: user.id,
        });
        return;
      }

      const recipient = onlineUsers.get(recipientId);

      if (sender && recipient) {
        try {
          // Refactored data layer logic
          const newMessage = await createOrUpdateChatAndMessage(
            user.id,
            recipientId,
            message
          );

          const messageData = formatMessageData(newMessage, user);

          // Send message to recipient
          recipient.socket.emit("receive_message", messageData);

          logger.info(`Message sent from ${user.email} to ${recipient.email}`, {
            senderId: user.id,
            recipientId: recipientId,
          });
        } catch (error) {
          logger.error("Error sending message:", {
            error,
            userId: user.id,
            recipientId: recipientId,
          });
          socket.emit("error", "Failed to send message");
        }
      } else {
        if (sender && !recipient) {
          try {
            const newMessage = await createOrUpdateChatAndMessage(
              user.id,
              recipientId,
              message
            );
          } catch (e) {
            logger.error("Error create Or Update Chat And Message :", {
              e,
              userId: user.id,
              recipientId: recipientId,
            });
          }
        }

        logger.warn("Message not sent: Sender or recipient not found", {
          senderId: user.id,
          recipientId: recipientId,
        });
      }
    });
    socket.on("get_chat_history", async (chatId: string) => {
      try {
        const messages = await getChatHistory(chatId);
        socket.emit("chat_history", messages);
        logger.info(`${user.email} fetched chat history`, {
          chatId,
        });
      } catch (error) {
        handleSocketError(socket, "Error fetching chat history:", error);
      }
    });

    // Admin-specific events
    if (user.role === "ADMIN") {
      socket.on("get_user_chats", async () => {
        try {
          const userChats = await getUserChatsForAdmin();
          socket.emit("user_chats", userChats);
          logger.info(`Admin ${user.email} fetched user chats`);
        } catch (error) {
          handleSocketError(socket, "Error fetching user chats:", error);
        }
      });
    }

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${user.email}`, { userId: user.id });
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
    logger.error("Socket connection error", {
      error: err.message,
      context: err.context,
    });
  });
};

// New helper functions
async function createOrUpdateChatAndMessage(
  senderId: string,
  recipientId: string,
  message: string
) {
  let chat = await findExistingChat(senderId, recipientId);

  if (!chat) {
    chat = await createNewChat(senderId, recipientId);
  }

  const newMessage = await createNewMessage(chat.id, senderId, message);
  logger.info("New message created:", { newMessage });
  return newMessage;
}

async function findExistingChat(senderId: string, recipientId: string) {
  const chat = await prisma.chat.findFirst({
    where: {
      usersChats: {
        every: {
          userId: {
            in: [senderId, recipientId],
          },
        },
      },
    },
  });
  logger.info("Existing chat found:", { chat });
  return chat;
}

async function createNewChat(senderId: string, recipientId: string) {
  const newChat = await prisma.chat.create({
    data: {
      usersChats: {
        create: [{ userId: senderId }, { userId: recipientId }],
      },
    },
  });
  logger.info("New chat created:", { newChat });
  return newChat;
}

async function createNewMessage(
  chatId: string,
  senderId: string,
  message: string
) {
  const newMessage = await prisma.message.create({
    data: {
      chatId,
      senderId,
      message,
    },
  });
  logger.info("New message created:", { newMessage });
  return newMessage;
}

function formatMessageData(
  newMessage: any,
  user: { id: string; email: string; role: "ADMIN" | "USER" }
) {
  return {
    id: newMessage.id,
    senderId: user.id,
    senderEmail: user.email,
    senderRole: user.role,
    message: newMessage.message,
    timestamp: newMessage.createdAt.toISOString(),
  };
}

// Helper functions
async function getUserChatsForAdmin(): Promise<UserChat[]> {
  const userChats = await prisma.user.findMany({
    where: {
      role: "USER",
      usersChats: {
        some: {
          chat: {
            usersChats: {
              some: {
                user: {
                  role: "ADMIN",
                },
              },
            },
          },
        },
      },
    },
    select: {
      id: true,
      email: true,
      usersChats: {
        select: {
          chat: {
            select: {
              id: true,
              messages: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
                select: {
                  message: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      },
    },
  });
  logger.info("User chats for admin fetched:", { userChats });

  const formattedUserChats = userChats.map((user) => ({
    id: user.id,
    email: user.email,
    lastMessage: user.usersChats[0]?.chat.messages[0]?.message || null,
    lastMessageTime: user.usersChats[0]?.chat.messages[0]?.createdAt || null,
  }));
  logger.info("Formatted user chats:", { formattedUserChats });
  return formattedUserChats;
}

async function getChatHistory(chatId: string): Promise<ChatHistoryMessage[]> {
  const chatHistory = await prisma.message.findMany({
    where: {
      chatId: chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });
  logger.info("Chat history fetched:", { chatId, chatHistory });
  return chatHistory;
}

function handleSocketError(socket: Socket, message: string, error: unknown) {
  logger.error(message, { error });
  socket.emit("error", `Failed to ${message.toLowerCase()}`);
}
