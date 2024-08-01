import { prisma } from "@/common/utils/prismaInstance";
import {
  Catering,
  CateringCreatePayload,
  CateringUpdatePayload,
} from "./cateringModel";

export class cateringRepository {
  async findAllAsync() {
    return await prisma.catering.findMany();
  }

  async findByIdAsync(id: string): Promise<Catering | null> {
    return (await prisma.catering.findUnique({ where: { id } })) || null;
  }

  async create(payload: CateringCreatePayload) {
    return await prisma.catering.create({
      data: payload,
    });
  }

  async updateById(payload: CateringUpdatePayload, id: string) {
    return await prisma.catering.update({
      where: { id },
      data: payload,
    });
  }

  async deleteById(id: string) {
    return await prisma.catering.delete({
      where: { id },
    });
  }
}
