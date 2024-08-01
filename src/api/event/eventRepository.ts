import { prisma } from "@/common/utils/prismaInstance";
import { Event, EventCreatePayload, EventUpdatePayload } from "./eventModel";

export class eventRepository {
  async findAllAsync() {
    return await prisma.event.findMany();
  }

  async findByIdAsync(id: string): Promise<Event | null> {
    return (await prisma.event.findUnique({ where: { id } })) || null;
  }

  async create(payload: EventCreatePayload) {
    return await prisma.event.create({
      data: payload,
    });
  }

  async updateById(payload: EventUpdatePayload, id: string) {
    return await prisma.event.update({
      where: { id },
      data: payload,
    });
  }

  async deleteById(id: string) {
    return await prisma.event.delete({
      where: { id },
    });
  }
}
