import { StatusCodes } from "http-status-codes";

import type {
  Decor,
  DecorCreatePayload,
  DecorUpdatePayload,
} from "@/api/decor/decorModel";
import { decorRepository } from "@/api/decor/decorRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class decorService {
  private decorRepository: decorRepository;

  constructor(repository: decorRepository = new decorRepository()) {
    this.decorRepository = repository;
  }

  // Retrieves all decors from the database
  async findAll(): Promise<ServiceResponse<Decor[] | null>> {
    try {
      const decors = await this.decorRepository.findAllAsync();
      if (!decors || decors.length === 0) {
        return ServiceResponse.failure("No Decors found", null, StatusCodes.OK);
      }
      return ServiceResponse.success<Decor[]>("Decors found", decors);
    } catch (ex) {
      const errorMessage = `Error finding all decors: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving decors.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single decor by their ID
  async findById(id: string): Promise<ServiceResponse<Decor | null>> {
    try {
      const decor = await this.decorRepository.findByIdAsync(id);
      if (!decor) {
        return ServiceResponse.failure("Decor not found", null, StatusCodes.OK);
      }
      return ServiceResponse.success<Decor>("Decor found", decor);
    } catch (ex) {
      const errorMessage = `Error finding decor with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding decor.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    payload: DecorCreatePayload
  ): Promise<ServiceResponse<Decor | null>> {
    try {
      const decor = await this.decorRepository.create(payload);
      return ServiceResponse.success<Decor>("Decor created", decor);
    } catch (ex) {
      const errorMessage = `Error creating decor: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating decor.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateById(
    payload: DecorUpdatePayload,
    id: string
  ): Promise<ServiceResponse<Decor | null>> {
    try {
      const decor = await this.decorRepository.findByIdAsync(id);
      if (!decor) {
        return ServiceResponse.failure(
          "Decor not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.decorRepository.updateById(payload, id);
      return ServiceResponse.success<Decor>("Decor updated", decor);
    } catch (ex) {
      const errorMessage = `Error updating decor: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating decor.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteById(id: string): Promise<ServiceResponse<Decor | null>> {
    try {
      const decor = await this.decorRepository.findByIdAsync(id);
      if (!decor) {
        return ServiceResponse.failure(
          "Decor not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.decorRepository.deleteById(id);
      return ServiceResponse.success<Decor>("Decor deleted", decor);
    } catch (ex) {
      const errorMessage = `Error deleting decor: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting decor.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const decorServiceInstance = new decorService();
