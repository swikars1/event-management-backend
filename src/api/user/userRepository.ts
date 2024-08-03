import { prisma } from "@/common/utils/prismaInstance";
import { User, UserCreatePayload, UserUpdatePayload } from "./userModel";

export class userRepository {
  async findAllAsync() {
    return await prisma.user.findMany();
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
