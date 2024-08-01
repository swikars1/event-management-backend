import { StatusCodes } from "http-status-codes";

import type {
  Accommodation,
  AccommodationCreatePayload,
  AccommodationUpdatePayload,
} from "@/api/accommodation/accommodationModel";
import { accommodationRepository } from "@/api/accommodation/accommodationRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class accommodationService {
  private accommodationRepository: accommodationRepository;

  constructor(
    repository: accommodationRepository = new accommodationRepository()
  ) {
    this.accommodationRepository = repository;
  }

  // Retrieves all accommodations from the database
  async findAll(): Promise<ServiceResponse<Accommodation[] | null>> {
    try {
      const accommodations = await this.accommodationRepository.findAllAsync();
      if (!accommodations || accommodations.length === 0) {
        return ServiceResponse.failure(
          "No Accommodations found",
          null,
          StatusCodes.OK
        );
      }
      return ServiceResponse.success<Accommodation[]>(
        "Accommodations found",
        accommodations
      );
    } catch (ex) {
      const errorMessage = `Error finding all accommodations: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving accommodations.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single accommodation by their ID
  async findById(id: string): Promise<ServiceResponse<Accommodation | null>> {
    try {
      const accommodation = await this.accommodationRepository.findByIdAsync(
        id
      );
      if (!accommodation) {
        return ServiceResponse.failure(
          "Accommodation not found",
          null,
          StatusCodes.OK
        );
      }
      return ServiceResponse.success<Accommodation>(
        "Accommodation found",
        accommodation
      );
    } catch (ex) {
      const errorMessage = `Error finding accommodation with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding accommodation.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    payload: AccommodationCreatePayload
  ): Promise<ServiceResponse<Accommodation | null>> {
    try {
      const accommodation = await this.accommodationRepository.create(payload);
      return ServiceResponse.success<Accommodation>(
        "Accommodation created",
        accommodation
      );
    } catch (ex) {
      const errorMessage = `Error creating accommodation: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating accommodation.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateById(
    payload: AccommodationUpdatePayload,
    id: string
  ): Promise<ServiceResponse<Accommodation | null>> {
    try {
      const accommodation = await this.accommodationRepository.findByIdAsync(
        id
      );
      if (!accommodation) {
        return ServiceResponse.failure(
          "Accommodation not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.accommodationRepository.updateById(payload, id);
      return ServiceResponse.success<Accommodation>(
        "Accommodation updated",
        accommodation
      );
    } catch (ex) {
      const errorMessage = `Error updating accommodation: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating accommodation.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteById(id: string): Promise<ServiceResponse<Accommodation | null>> {
    try {
      const accommodation = await this.accommodationRepository.findByIdAsync(
        id
      );
      if (!accommodation) {
        return ServiceResponse.failure(
          "Accommodation not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.accommodationRepository.deleteById(id);
      return ServiceResponse.success<Accommodation>(
        "Accommodation deleted",
        accommodation
      );
    } catch (ex) {
      const errorMessage = `Error deleting accommodation: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting accommodation.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const accommodationServiceInstance = new accommodationService();
