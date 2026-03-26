-- AlterTable
ALTER TABLE `vet_clinic`
    ADD COLUMN `about` JSON NULL,
    ADD COLUMN `address` JSON NULL,
    ADD COLUMN `name` JSON NULL;

UPDATE `vet_clinic` SET
    `name` = JSON_OBJECT('en', `name_en`, 'ru', `name_ru`),
    `address` = JSON_OBJECT('en', `address_en`, 'ru', `address_ru`),
    `about` = CASE 
        WHEN `about_en` IS NULL AND `about_ru` IS NULL THEN NULL 
        ELSE JSON_OBJECT('en', `about_en`, 'ru', `about_ru`) 
    END;

ALTER TABLE `vet_clinic`
    MODIFY COLUMN `address` JSON NOT NULL,
    MODIFY COLUMN `name` JSON NOT NULL;

ALTER TABLE `vet_clinic`
    DROP COLUMN `about_en`,
    DROP COLUMN `about_ru`,
    DROP COLUMN `address_en`,
    DROP COLUMN `address_ru`,
    DROP COLUMN `name_en`,
    DROP COLUMN `name_ru`;