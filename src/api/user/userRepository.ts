import { prisma } from "@/common/utils/prismaInstance";
import { User, UserCreatePayload, UserUpdatePayload } from "./userModel";

export class userRepository {
  async findAllAsync() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true,
        password: true,
        events: {
          select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
            endDate: true,
            location: true,
            status: true,
            createdAt: true,
            theme: {
              select: {
                name: true,
                id: true,
              },
            },
            catering: {
              select: {
                name: true,
                id: true,
              },
            },
            entertainment: {
              select: {
                name: true,
                id: true,
              },
            },
            decor: {
              select: {
                name: true,
                id: true,
              },
            },
            accommodation: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });
  }

  async findByIdAsync(id: string): Promise<User | null> {
    return (await prisma.user.findUnique({ where: { id } })) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return (await prisma.user.findUnique({ where: { email } })) || null;
  }

  async create(payload: UserCreatePayload) {
    return await prisma.user.create({
      data: payload,
    });
  }

  async updateById(payload: UserUpdatePayload, id: string) {
    return await prisma.user.update({
      where: { id },
      data: payload,
    });
  }

  async deleteById(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
