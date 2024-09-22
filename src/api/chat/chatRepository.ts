import { prisma } from "@/common/utils/prismaInstance";
import { Chat, ChatCreatePayload, ChatUpdatePayload } from "./chatModel";
import { logger } from "@/server";

export interface UserChat {
  id: string;
  email: string;
  lastMessage: string | null;
  lastMessageTime: Date | null;
}

export interface ChatHistoryMessage {
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

export class chatRepository {
  async findAllAsync() {
    return await prisma.chat.findMany();
  }

  async findByIdAsync(id: string): Promise<Chat | null> {
    return (await prisma.chat.findUnique({ where: { id } })) || null;
  }

  async create(payload: ChatCreatePayload) {
    return await prisma.chat.create({
      data: {
        usersChats: {
          create: [
            {
              userId: payload.userA,
            },
            { userId: payload.userB },
          ],
        },
      },
    });
  }

  async updateById(payload: ChatUpdatePayload, id: string) {
    return await prisma.chat.update({
      where: { id },
      data: payload,
    });
  }

  async deleteById(id: string) {
    return await prisma.chat.delete({
      where: { id },
    });
  }

  async createNewChat(senderId: string, recipientId: string) {
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

  async findExistingChat(senderId: string, recipientId: string) {
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

  async createNewMessage(chatId: string, senderId: string, message: string) {
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

  async getUserChatsForAdmin(): Promise<UserChat[]> {
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

  async getChatHistory(
    senderId: string,
    receiverId: string
  ): Promise<ChatHistoryMessage[]> {
    const chatHistory = await prisma.message.findMany({
      where: {
        chat: {
          usersChats: {
            every: {
              userId: {
                in: [senderId, receiverId],
              },
            },
          },
        },
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
    logger.info("Chat history fetched:", { senderId, receiverId, chatHistory });
    return chatHistory;
  }
}
