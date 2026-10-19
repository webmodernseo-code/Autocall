-- CreateTable
CREATE TABLE `client_onboardings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'not_started',
    `current_step` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    `max_step_reached` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    `version` VARCHAR(16) NOT NULL DEFAULT 'v1',
    `data` JSON NULL,
    `started_at` TIMESTAMP(0) NULL,
    `completed_at` TIMESTAMP(0) NULL,
    `dismissed_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `client_onboardings_client_id_unique`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `client_onboardings` ADD CONSTRAINT `client_onboardings_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
