import { StatusCodes } from "http-status-codes";

import type {
  User,
  UserCreatePayload,
  UserLoginPayload,
  UserUpdatePayload,
} from "@/api/user/userModel";
import { userRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@/common/utils/envConfig";

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
        return ServiceResponse.failure("No Users found", null, StatusCodes.OK);
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
        return ServiceResponse.failure("User not found", null, StatusCodes.OK);
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

  async login(
    payload: UserLoginPayload
  ): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findByEmail(payload.email);
      if (!user) {
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }
      const isPasswordSame = await bcrypt.compare(
        payload.password,
        user.password
      );

      if (!isPasswordSame) {
        return ServiceResponse.failure(
          "Invalid credentials",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      const bearerToken = jwt.sign(
        { id: user.id, email: user.email },
        env.JWT_SECRET,
        {
          expiresIn: "180d",
        }
      );
      return ServiceResponse.success<User & { bearerToken: string }>(
        "User Logged In",
        {
          ...user,
          bearerToken,
        }
      );
    } catch (ex) {
      const errorMessage = `Error Logging in user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while logging in user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async signUp(
    payload: UserCreatePayload
  ): Promise<ServiceResponse<User | null>> {
    try {
      // hash and salt password using bcrypt
      const hashedPassword = await bcrypt.hash(payload.password, 10);

      const user = await this.userRepository.create({
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: "USER",
      });
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
