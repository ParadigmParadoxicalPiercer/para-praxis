-- CreateTable
CREATE TABLE `WorkoutExerciseLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workoutExerciseId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `completedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutExerciseLog` ADD CONSTRAINT `WorkoutExerciseLog_workoutExerciseId_fkey` FOREIGN KEY (`workoutExerciseId`) REFERENCES `WorkoutExercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutExerciseLog` ADD CONSTRAINT `WorkoutExerciseLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
