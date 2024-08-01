import { StatusCodes } from "http-status-codes";

import type {
  User,
  UserCreatePayload,
  UserUpdatePayload,
} from "@/api/user/userModel";
import { userRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class userService {
  private userRepository: userRepository;

  constructor(repository: userRepository = new userRepository()) {
    this.userRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<User[] | null>> {
    try {
      const users = await this.userRepository.findAllAsync();
      if (!users || users.length === 0) {
        return ServiceResponse.failure(
          "No Users found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<User[]>("Users found", users);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: string): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<User>("User found", user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    payload: UserCreatePayload
  ): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.create(payload);
      return ServiceResponse.success<User>("User created", user);
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateById(
    payload: UserUpdatePayload,
    id: string
  ): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.userRepository.updateById(payload, id);
      return ServiceResponse.success<User>("User updated", user);
    } catch (ex) {
      const errorMessage = `Error updating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteById(id: string): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.userRepository.deleteById(id);
      return ServiceResponse.success<User>("User deleted", user);
    } catch (ex) {
      const errorMessage = `Error deleting user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const userServiceInstance = new userService();
