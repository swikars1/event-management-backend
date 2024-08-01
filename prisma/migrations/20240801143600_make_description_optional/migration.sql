-- AlterTable
ALTER TABLE `Accommodation` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Catering` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `menu` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Decor` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Entertainment` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `type` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Theme` MODIFY `description` VARCHAR(191) NULL;
