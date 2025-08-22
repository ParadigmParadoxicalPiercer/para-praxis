-- CreateTable
CREATE TABLE `WorkoutTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `equipment` ENUM('BODYWEIGHT', 'DUMBBELL', 'GYM') NOT NULL,
    `goal` ENUM('LOSE_WEIGHT', 'FITNESS', 'BULK', 'V_TAPER') NOT NULL,
    `category` ENUM('FULL_BODY', 'UPPER', 'LOWER', 'CORE', 'CARDIO') NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutTemplateExercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `reps` INTEGER NULL,
    `sets` INTEGER NULL,
    `order` INTEGER NULL DEFAULT 0,
    `templateId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutTemplate` ADD CONSTRAINT `WorkoutTemplate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutTemplateExercise` ADD CONSTRAINT `WorkoutTemplateExercise_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `WorkoutTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
