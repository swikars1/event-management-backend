import { prisma } from "@/common/utils/prismaInstance";
import { Decor, DecorCreatePayload, DecorUpdatePayload } from "./decorModel";

export class decorRepository {
  async findAllAsync() {
    return await prisma.decor.findMany();
  }

  async findByIdAsync(id: string): Promise<Decor | null> {
    return (await prisma.decor.findUnique({ where: { id } })) || null;
  }

  async create(payload: DecorCreatePayload) {
    return await prisma.decor.create({
      data: payload,
    });
  }

  async updateById(payload: DecorUpdatePayload, id: string) {
    return await prisma.decor.update({
      where: { id },
      data: payload,
    });
  }

  async deleteById(id: string) {
    return await prisma.decor.delete({
      where: { id },
    });
  }
}
