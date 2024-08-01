import { StatusCodes } from "http-status-codes";

import type {
  Ticket,
  TicketCreatePayload,
  TicketUpdatePayload,
} from "@/api/ticket/ticketModel";
import { ticketRepository } from "@/api/ticket/ticketRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class ticketService {
  private ticketRepository: ticketRepository;

  constructor(repository: ticketRepository = new ticketRepository()) {
    this.ticketRepository = repository;
  }

  // Retrieves all tickets from the database
  async findAll(): Promise<ServiceResponse<Ticket[] | null>> {
    try {
      const tickets = await this.ticketRepository.findAllAsync();
      if (!tickets || tickets.length === 0) {
        return ServiceResponse.failure(
          "No Tickets found",
          null,
          StatusCodes.OK
        );
      }
      return ServiceResponse.success<Ticket[]>("Tickets found", tickets);
    } catch (ex) {
      const errorMessage = `Error finding all tickets: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving tickets.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single ticket by their ID
  async findById(id: string): Promise<ServiceResponse<Ticket | null>> {
    try {
      const ticket = await this.ticketRepository.findByIdAsync(id);
      if (!ticket) {
        return ServiceResponse.failure(
          "Ticket not found",
          null,
          StatusCodes.OK
        );
      }
      return ServiceResponse.success<Ticket>("Ticket found", ticket);
    } catch (ex) {
      const errorMessage = `Error finding ticket with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding ticket.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    payload: TicketCreatePayload
  ): Promise<ServiceResponse<Ticket | null>> {
    try {
      const ticket = await this.ticketRepository.create(payload);
      return ServiceResponse.success<Ticket>("Ticket created", ticket);
    } catch (ex) {
      const errorMessage = `Error creating ticket: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating ticket.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateById(
    payload: TicketUpdatePayload,
    id: string
  ): Promise<ServiceResponse<Ticket | null>> {
    try {
      const ticket = await this.ticketRepository.findByIdAsync(id);
      if (!ticket) {
        return ServiceResponse.failure(
          "Ticket not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.ticketRepository.updateById(payload, id);
      return ServiceResponse.success<Ticket>("Ticket updated", ticket);
    } catch (ex) {
      const errorMessage = `Error updating ticket: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating ticket.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteById(id: string): Promise<ServiceResponse<Ticket | null>> {
    try {
      const ticket = await this.ticketRepository.findByIdAsync(id);
      if (!ticket) {
        return ServiceResponse.failure(
          "Ticket not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.ticketRepository.deleteById(id);
      return ServiceResponse.success<Ticket>("Ticket deleted", ticket);
    } catch (ex) {
      const errorMessage = `Error deleting ticket: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting ticket.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const ticketServiceInstance = new ticketService();
