import { StatusCodes } from "http-status-codes";

import type {
  Event,
  EventCreatePayload,
  EventUpdatePayload,
} from "@/api/event/eventModel";
import { eventRepository } from "@/api/event/eventRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class eventService {
  private eventRepository: eventRepository;

  constructor(repository: eventRepository = new eventRepository()) {
    this.eventRepository = repository;
  }

  // Retrieves all events from the database
  async findAll(): Promise<ServiceResponse<Event[] | null>> {
    try {
      const events = await this.eventRepository.findAllAsync();
      if (!events || events.length === 0) {
        return ServiceResponse.failure("No Events found", null, StatusCodes.OK);
      }
      return ServiceResponse.success<Event[]>("Events found", events);
    } catch (ex) {
      const errorMessage = `Error finding all events: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving events.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single event by their ID
  async findById(id: string): Promise<ServiceResponse<Event | null>> {
    try {
      const event = await this.eventRepository.findByIdAsync(id);
      if (!event) {
        return ServiceResponse.failure("Event not found", null, StatusCodes.OK);
      }
      return ServiceResponse.success<Event>("Event found", event);
    } catch (ex) {
      const errorMessage = `Error finding event with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding event.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    payload: EventCreatePayload
  ): Promise<ServiceResponse<Event | null>> {
    try {
      const event = await this.eventRepository.create(payload);
      return ServiceResponse.success("Event created", null);
    } catch (ex) {
      const errorMessage = `Error creating event: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating event.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateById(
    payload: EventUpdatePayload,
    id: string
  ): Promise<ServiceResponse<Event | null>> {
    try {
      const event = await this.eventRepository.findByIdAsync(id);
      if (!event) {
        return ServiceResponse.failure(
          "Event not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.eventRepository.updateById(payload, id);
      return ServiceResponse.success<Event>("Event updated", event);
    } catch (ex) {
      const errorMessage = `Error updating event: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating event.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteById(id: string): Promise<ServiceResponse<Event | null>> {
    try {
      const event = await this.eventRepository.findByIdAsync(id);
      if (!event) {
        return ServiceResponse.failure(
          "Event not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.eventRepository.deleteById(id);
      return ServiceResponse.success<Event>("Event deleted", event);
    } catch (ex) {
      const errorMessage = `Error deleting event: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting event.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const eventServiceInstance = new eventService();
