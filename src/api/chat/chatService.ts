import { StatusCodes } from "http-status-codes";

import type {
  Chat,
  ChatCreatePayload,
  ChatUpdatePayload,
} from "@/api/chat/chatModel";
import { chatRepository } from "@/api/chat/chatRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class chatService {
  private chatRepository: chatRepository;

  constructor(repository: chatRepository = new chatRepository()) {
    this.chatRepository = repository;
  }

  // Retrieves all chats from the database
  async findAll(): Promise<ServiceResponse<Chat[] | null>> {
    try {
      const chats = await this.chatRepository.findAllAsync();
      if (!chats || chats.length === 0) {
        return ServiceResponse.failure("No Chats found", null, StatusCodes.OK);
      }
      return ServiceResponse.success<Chat[]>("Chats found", chats);
    } catch (ex) {
      const errorMessage = `Error finding all chats: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving chats.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single chat by their ID
  async findById(id: string): Promise<ServiceResponse<Chat | null>> {
    try {
      const chat = await this.chatRepository.findByIdAsync(id);
      if (!chat) {
        return ServiceResponse.failure("Chat not found", null, StatusCodes.OK);
      }
      return ServiceResponse.success<Chat>("Chat found", chat);
    } catch (ex) {
      const errorMessage = `Error finding chat with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding chat.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    payload: ChatCreatePayload
  ): Promise<ServiceResponse<Chat | null>> {
    try {
      const chat = await this.chatRepository.create(payload);
      return ServiceResponse.success<Chat>("Chat created", chat);
    } catch (ex) {
      const errorMessage = `Error creating chat: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating chat.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateById(
    payload: ChatUpdatePayload,
    id: string
  ): Promise<ServiceResponse<Chat | null>> {
    try {
      const chat = await this.chatRepository.findByIdAsync(id);
      if (!chat) {
        return ServiceResponse.failure(
          "Chat not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.chatRepository.updateById(payload, id);
      return ServiceResponse.success<Chat>("Chat updated", chat);
    } catch (ex) {
      const errorMessage = `Error updating chat: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating chat.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteById(id: string): Promise<ServiceResponse<Chat | null>> {
    try {
      const chat = await this.chatRepository.findByIdAsync(id);
      if (!chat) {
        return ServiceResponse.failure(
          "Chat not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.chatRepository.deleteById(id);
      return ServiceResponse.success<Chat>("Chat deleted", chat);
    } catch (ex) {
      const errorMessage = `Error deleting chat: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting chat.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const chatServiceInstance = new chatService();
