import { prisma } from "@/common/utils/prismaInstance";
import { Chat, ChatCreatePayload, ChatUpdatePayload } from "./chatModel";

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
}
