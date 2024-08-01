import { prisma } from "@/common/utils/prismaInstance";
import { Theme, ThemeCreatePayload, ThemeUpdatePayload } from "./themeModel";

export class themeRepository {
  async findAllAsync() {
    return await prisma.theme.findMany();
  }

  async findByIdAsync(id: string): Promise<Theme | null> {
    return (await prisma.theme.findUnique({ where: { id } })) || null;
  }

  async create(payload: ThemeCreatePayload) {
    return await prisma.theme.create({
      data: payload,
    });
  }

  async updateById(payload: ThemeUpdatePayload, id: string) {
    return await prisma.theme.update({
      where: { id },
      data: payload,
    });
  }

  async deleteById(id: string) {
    return await prisma.theme.delete({
      where: { id },
    });
  }
}
