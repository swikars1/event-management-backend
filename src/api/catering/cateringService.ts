import { StatusCodes } from "http-status-codes";

import type {
  Catering,
  CateringCreatePayload,
  CateringUpdatePayload,
} from "@/api/catering/cateringModel";
import { cateringRepository } from "@/api/catering/cateringRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class cateringService {
  private cateringRepository: cateringRepository;

  constructor(repository: cateringRepository = new cateringRepository()) {
    this.cateringRepository = repository;
  }

  // Retrieves all caterings from the database
  async findAll(): Promise<ServiceResponse<Catering[] | null>> {
    try {
      const caterings = await this.cateringRepository.findAllAsync();
      if (!caterings || caterings.length === 0) {
        return ServiceResponse.failure(
          "No Caterings found",
          null,
          StatusCodes.OK
        );
      }
      return ServiceResponse.success<Catering[]>("Caterings found", caterings);
    } catch (ex) {
      const errorMessage = `Error finding all caterings: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving caterings.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single catering by their ID
  async findById(id: string): Promise<ServiceResponse<Catering | null>> {
    try {
      const catering = await this.cateringRepository.findByIdAsync(id);
      if (!catering) {
        return ServiceResponse.failure(
          "Catering not found",
          null,
          StatusCodes.OK
        );
      }
      return ServiceResponse.success<Catering>("Catering found", catering);
    } catch (ex) {
      const errorMessage = `Error finding catering with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding catering.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    payload: CateringCreatePayload
  ): Promise<ServiceResponse<Catering | null>> {
    try {
      const catering = await this.cateringRepository.create(payload);
      return ServiceResponse.success<Catering>("Catering created", catering);
    } catch (ex) {
      const errorMessage = `Error creating catering: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating catering.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateById(
    payload: CateringUpdatePayload,
    id: string
  ): Promise<ServiceResponse<Catering | null>> {
    try {
      const catering = await this.cateringRepository.findByIdAsync(id);
      if (!catering) {
        return ServiceResponse.failure(
          "Catering not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.cateringRepository.updateById(payload, id);
      return ServiceResponse.success<Catering>("Catering updated", catering);
    } catch (ex) {
      const errorMessage = `Error updating catering: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating catering.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteById(id: string): Promise<ServiceResponse<Catering | null>> {
    try {
      const catering = await this.cateringRepository.findByIdAsync(id);
      if (!catering) {
        return ServiceResponse.failure(
          "Catering not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.cateringRepository.deleteById(id);
      return ServiceResponse.success<Catering>("Catering deleted", catering);
    } catch (ex) {
      const errorMessage = `Error deleting catering: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting catering.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const cateringServiceInstance = new cateringService();
