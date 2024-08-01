import { StatusCodes } from "http-status-codes";

import type {
  Theme,
  ThemeCreatePayload,
  ThemeUpdatePayload,
} from "@/api/theme/themeModel";
import { themeRepository } from "@/api/theme/themeRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class themeService {
  private themeRepository: themeRepository;

  constructor(repository: themeRepository = new themeRepository()) {
    this.themeRepository = repository;
  }

  // Retrieves all themes from the database
  async findAll(): Promise<ServiceResponse<Theme[] | null>> {
    try {
      const themes = await this.themeRepository.findAllAsync();
      if (!themes || themes.length === 0) {
        return ServiceResponse.failure("No Themes found", null, StatusCodes.OK);
      }
      return ServiceResponse.success<Theme[]>("Themes found", themes);
    } catch (ex) {
      const errorMessage = `Error finding all themes: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving themes.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single theme by their ID
  async findById(id: string): Promise<ServiceResponse<Theme | null>> {
    try {
      const theme = await this.themeRepository.findByIdAsync(id);
      if (!theme) {
        return ServiceResponse.failure("Theme not found", null, StatusCodes.OK);
      }
      return ServiceResponse.success<Theme>("Theme found", theme);
    } catch (ex) {
      const errorMessage = `Error finding theme with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding theme.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    payload: ThemeCreatePayload
  ): Promise<ServiceResponse<Theme | null>> {
    try {
      const theme = await this.themeRepository.create(payload);
      return ServiceResponse.success<Theme>("Theme created", theme);
    } catch (ex) {
      const errorMessage = `Error creating theme: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating theme.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateById(
    payload: ThemeUpdatePayload,
    id: string
  ): Promise<ServiceResponse<Theme | null>> {
    try {
      const theme = await this.themeRepository.findByIdAsync(id);
      if (!theme) {
        return ServiceResponse.failure(
          "Theme not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.themeRepository.updateById(payload, id);
      return ServiceResponse.success<Theme>("Theme updated", theme);
    } catch (ex) {
      const errorMessage = `Error updating theme: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating theme.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteById(id: string): Promise<ServiceResponse<Theme | null>> {
    try {
      const theme = await this.themeRepository.findByIdAsync(id);
      if (!theme) {
        return ServiceResponse.failure(
          "Theme not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.themeRepository.deleteById(id);
      return ServiceResponse.success<Theme>("Theme deleted", theme);
    } catch (ex) {
      const errorMessage = `Error deleting theme: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting theme.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const themeServiceInstance = new themeService();
