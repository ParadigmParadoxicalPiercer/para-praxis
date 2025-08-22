/*
  Warnings:

  - You are about to drop the column `gymType` on the `WorkoutPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `WorkoutPlan` DROP COLUMN `gymType`,
    MODIFY `equipment` ENUM('BODYWEIGHT', 'DUMBBELL', 'GYM') NULL,
    MODIFY `goal` ENUM('LOSE_WEIGHT', 'FITNESS', 'BULK', 'V_TAPER') NULL;
