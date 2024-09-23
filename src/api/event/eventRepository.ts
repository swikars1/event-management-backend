import { prisma } from "@/common/utils/prismaInstance";
import { Event, EventCreatePayload, EventUpdatePayload } from "./eventModel";
import { User } from "@prisma/client";

export interface UserBooking {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  catering: {
    name: string;
  } | null;
  accommodation: {
    name: string;
  } | null;
  theme: {
    name: string;
  } | null;
  entertainment: {
    name: string;
  } | null;
  decor: {
    name: string;
  } | null;

  status: string;
}

export class eventRepository {
  async findAllAsync() {
    return await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        location: true,
        status: true,
        createdAt: true,
        catering: {
          select: {
            name: true,
          },
        },
        accommodation: {
          select: {
            name: true,
          },
        },
        theme: {
          select: {
            name: true,
          },
        },
        entertainment: {
          select: {
            name: true,
          },
        },
        decor: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAllBookings(userId: string): Promise<UserBooking[]> {
    return await prisma.event.findMany({
      where: {
        organizerId: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        location: true,
        status: true,
        catering: {
          select: {
            name: true,
          },
        },
        accommodation: {
          select: {
            name: true,
          },
        },
        theme: {
          select: {
            name: true,
          },
        },
        entertainment: {
          select: {
            name: true,
          },
        },
        decor: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findByIdAsync(id: string): Promise<Event | null> {
    return (await prisma.event.findUnique({ where: { id } })) || null;
  }

  async findByUserIdAsync(id: string, userId: string): Promise<Event | null> {
    return (
      (await prisma.event.findUnique({ where: { id, organizerId: userId } })) ||
      null
    );
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
