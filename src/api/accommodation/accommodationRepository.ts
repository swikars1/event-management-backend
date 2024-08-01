import { prisma } from "@/common/utils/prismaInstance";
import {
  Accommodation,
  AccommodationCreatePayload,
  AccommodationUpdatePayload,
} from "./accommodationModel";

export class accommodationRepository {
  async findAllAsync() {
    return await prisma.accommodation.findMany();
  }

  async findByIdAsync(id: string): Promise<Accommodation | null> {
    return (await prisma.accommodation.findUnique({ where: { id } })) || null;
  }

  async create(payload: AccommodationCreatePayload) {
    return await prisma.accommodation.create({
      data: payload,
    });
  }

  async updateById(payload: AccommodationUpdatePayload, id: string) {
    return await prisma.accommodation.update({
      where: { id },
      data: payload,
    });
  }

  async deleteById(id: string) {
    return await prisma.accommodation.delete({
      where: { id },
    });
  }
}
