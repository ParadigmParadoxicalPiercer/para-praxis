/*
  Warnings:

  - The values [V_TAPER] on the enum `WorkoutPlan_goal` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `WorkoutPlan` ADD COLUMN `gymType` ENUM('V_TAPER') NULL,
    MODIFY `goal` ENUM('LOSE_WEIGHT', 'FITNESS', 'BULK') NULL;
