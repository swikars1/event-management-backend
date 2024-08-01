import { StatusCodes } from "http-status-codes";

import type {
  Entertainment,
  EntertainmentCreatePayload,
  EntertainmentUpdatePayload,
} from "@/api/entertainment/entertainmentModel";
import { entertainmentRepository } from "@/api/entertainment/entertainmentRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class entertainmentService {
  private entertainmentRepository: entertainmentRepository;

  constructor(
    repository: entertainmentRepository = new entertainmentRepository()
  ) {
    this.entertainmentRepository = repository;
  }

  // Retrieves all entertainments from the database
  async findAll(): Promise<ServiceResponse<Entertainment[] | null>> {
    try {
      const entertainments = await this.entertainmentRepository.findAllAsync();
      if (!entertainments || entertainments.length === 0) {
        return ServiceResponse.failure(
          "No Entertainments found",
          null,
          StatusCodes.OK
        );
      }
      return ServiceResponse.success<Entertainment[]>(
        "Entertainments found",
        entertainments
      );
    } catch (ex) {
      const errorMessage = `Error finding all entertainments: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving entertainments.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single entertainment by their ID
  async findById(id: string): Promise<ServiceResponse<Entertainment | null>> {
    try {
      const entertainment = await this.entertainmentRepository.findByIdAsync(
        id
      );
      if (!entertainment) {
        return ServiceResponse.failure(
          "Entertainment not found",
          null,
          StatusCodes.OK
        );
      }
      return ServiceResponse.success<Entertainment>(
        "Entertainment found",
        entertainment
      );
    } catch (ex) {
      const errorMessage = `Error finding entertainment with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding entertainment.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    payload: EntertainmentCreatePayload
  ): Promise<ServiceResponse<Entertainment | null>> {
    try {
      const entertainment = await this.entertainmentRepository.create(payload);
      return ServiceResponse.success<Entertainment>(
        "Entertainment created",
        entertainment
      );
    } catch (ex) {
      const errorMessage = `Error creating entertainment: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating entertainment.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateById(
    payload: EntertainmentUpdatePayload,
    id: string
  ): Promise<ServiceResponse<Entertainment | null>> {
    try {
      const entertainment = await this.entertainmentRepository.findByIdAsync(
        id
      );
      if (!entertainment) {
        return ServiceResponse.failure(
          "Entertainment not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.entertainmentRepository.updateById(payload, id);
      return ServiceResponse.success<Entertainment>(
        "Entertainment updated",
        entertainment
      );
    } catch (ex) {
      const errorMessage = `Error updating entertainment: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating entertainment.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteById(id: string): Promise<ServiceResponse<Entertainment | null>> {
    try {
      const entertainment = await this.entertainmentRepository.findByIdAsync(
        id
      );
      if (!entertainment) {
        return ServiceResponse.failure(
          "Entertainment not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.entertainmentRepository.deleteById(id);
      return ServiceResponse.success<Entertainment>(
        "Entertainment deleted",
        entertainment
      );
    } catch (ex) {
      const errorMessage = `Error deleting entertainment: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting entertainment.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const entertainmentServiceInstance = new entertainmentService();
