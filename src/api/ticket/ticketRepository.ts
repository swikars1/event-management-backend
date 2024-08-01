import { prisma } from "@/common/utils/prismaInstance";
import {
  Ticket,
  TicketCreatePayload,
  TicketUpdatePayload,
} from "./ticketModel";

export class ticketRepository {
  async findAllAsync() {
    return await prisma.ticket.findMany();
  }

  async findByIdAsync(id: string): Promise<Ticket | null> {
    return (await prisma.ticket.findUnique({ where: { id } })) || null;
  }

  async create(payload: TicketCreatePayload) {
    return await prisma.ticket.create({
      data: payload,
    });
  }

  async updateById(payload: TicketUpdatePayload, id: string) {
    return await prisma.ticket.update({
      where: { id },
      data: payload,
    });
  }

  async deleteById(id: string) {
    return await prisma.ticket.delete({
      where: { id },
    });
  }
}
