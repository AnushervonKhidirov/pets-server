-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `password` VARCHAR(191) NULL,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NULL,
    `avatar` VARCHAR(191) NULL,
    `contacts` JSON NULL,
    `authType` ENUM('Local', 'Google', 'Yandex') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,
    `role` ENUM('User', 'Admin') NOT NULL DEFAULT 'User',

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `user_id` INTEGER NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `country_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,

    UNIQUE INDEX `address_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token` (
    `refreshToken` VARCHAR(250) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `expired_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `token_refreshToken_key`(`refreshToken`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `about` TEXT NULL,
    `sex` ENUM('Male', 'Female') NULL,
    `birthday` DATETIME(3) NULL,
    `microchip_id` VARCHAR(191) NULL,
    `petTypeId` INTEGER NOT NULL,
    `breedId` INTEGER NULL,
    `userId` INTEGER NOT NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lost_info` (
    `lostAt` DATETIME(3) NOT NULL,
    `details` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `petId` INTEGER NOT NULL,

    UNIQUE INDEX `lost_info_petId_key`(`petId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `en` VARCHAR(50) NOT NULL,
    `ru` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `pet_type_en_key`(`en`),
    UNIQUE INDEX `pet_type_ru_key`(`ru`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `breed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `en` VARCHAR(50) NOT NULL,
    `ru` VARCHAR(50) NOT NULL,
    `pet_type_id` INTEGER NOT NULL,

    UNIQUE INDEX `breed_en_key`(`en`),
    UNIQUE INDEX `breed_ru_key`(`ru`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vet_clinic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name_en` VARCHAR(50) NOT NULL,
    `name_ru` VARCHAR(50) NOT NULL,
    `country_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `address_en` VARCHAR(255) NOT NULL,
    `address_ru` VARCHAR(255) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `contacts` JSON NOT NULL,
    `about_en` TEXT NULL,
    `about_ru` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `topic` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `message` TEXT NOT NULL,
    `watched` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verify_mail` (
    `email` VARCHAR(255) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expired_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `verify_mail_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reset_password_url` (
    `email` VARCHAR(255) NOT NULL,
    `pageId` VARCHAR(36) NOT NULL,
    `expired_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `reset_password_url_email_key`(`email`),
    UNIQUE INDEX `reset_password_url_pageId_key`(`pageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `en` VARCHAR(191) NOT NULL,
    `ru` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `country_id_key`(`id`),
    UNIQUE INDEX `country_en_key`(`en`),
    UNIQUE INDEX `country_ru_key`(`ru`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `en` VARCHAR(191) NOT NULL,
    `ru` VARCHAR(191) NOT NULL,
    `country_id` INTEGER NOT NULL,

    UNIQUE INDEX `city_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `token` ADD CONSTRAINT `token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pets` ADD CONSTRAINT `pets_petTypeId_fkey` FOREIGN KEY (`petTypeId`) REFERENCES `pet_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pets` ADD CONSTRAINT `pets_breedId_fkey` FOREIGN KEY (`breedId`) REFERENCES `breed`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pets` ADD CONSTRAINT `pets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lost_info` ADD CONSTRAINT `lost_info_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `breed` ADD CONSTRAINT `breed_pet_type_id_fkey` FOREIGN KEY (`pet_type_id`) REFERENCES `pet_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vet_clinic` ADD CONSTRAINT `vet_clinic_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vet_clinic` ADD CONSTRAINT `vet_clinic_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
