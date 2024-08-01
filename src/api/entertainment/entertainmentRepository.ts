import { prisma } from "@/common/utils/prismaInstance";
import {
  Entertainment,
  EntertainmentCreatePayload,
  EntertainmentUpdatePayload,
} from "./entertainmentModel";

export class entertainmentRepository {
  async findAllAsync() {
    return await prisma.entertainment.findMany();
  }

  async findByIdAsync(id: string): Promise<Entertainment | null> {
    return (await prisma.entertainment.findUnique({ where: { id } })) || null;
  }

  async create(payload: EntertainmentCreatePayload) {
    return await prisma.entertainment.create({
      data: payload,
    });
  }

  async updateById(payload: EntertainmentUpdatePayload, id: string) {
    return await prisma.entertainment.update({
      where: { id },
      data: payload,
    });
  }

  async deleteById(id: string) {
    return await prisma.entertainment.delete({
      where: { id },
    });
  }
}
