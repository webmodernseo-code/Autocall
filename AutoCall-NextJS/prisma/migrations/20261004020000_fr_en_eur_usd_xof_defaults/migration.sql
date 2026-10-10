-- French-first regional defaults for the initial commercial launch.
-- Existing explicit user preferences are preserved; only NULL preferences are initialized.

ALTER TABLE `tenants`
    MODIFY `default_locale` VARCHAR(10) NOT NULL DEFAULT 'fr';

ALTER TABLE `websites`
    MODIFY `default_locale` VARCHAR(10) NOT NULL DEFAULT 'fr';

UPDATE `currencies`
SET `enabled` = false, `is_default` = false, `updated_at` = CURRENT_TIMESTAMP
WHERE `code` NOT IN ('EUR', 'USD', 'XOF');

INSERT INTO `currencies`
    (`code`, `symbol`, `decimals`, `exchange_rate`, `is_default`, `enabled`, `created_at`, `updated_at`)
VALUES
    ('EUR', '€', 2, 1.00000000, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('USD', '$', 2, 0.92590000, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('XOF', 'F CFA', 0, 0.00152449, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    `symbol` = VALUES(`symbol`),
    `decimals` = VALUES(`decimals`),
    `exchange_rate` = VALUES(`exchange_rate`),
    `is_default` = VALUES(`is_default`),
    `enabled` = true,
    `updated_at` = CURRENT_TIMESTAMP;

UPDATE `locales`
SET `enabled` = false, `is_default` = false, `updated_at` = CURRENT_TIMESTAMP
WHERE `code` NOT IN ('fr', 'en');

INSERT INTO `locales`
    (`code`, `name`, `native_name`, `flag`, `enabled`, `is_default`, `is_rtl`, `sort_order`, `created_at`, `updated_at`)
VALUES
    ('fr', 'French', 'Français', NULL, true, true, false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('en', 'English', 'English', NULL, true, false, false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `native_name` = VALUES(`native_name`),
    `enabled` = true,
    `is_default` = VALUES(`is_default`),
    `is_rtl` = false,
    `sort_order` = VALUES(`sort_order`),
    `updated_at` = CURRENT_TIMESTAMP;

UPDATE `users`
SET `locale` = COALESCE(`locale`, 'fr'),
    `display_currency` = COALESCE(`display_currency`, 'EUR'),
    `updated_at` = CURRENT_TIMESTAMP
WHERE `locale` IS NULL OR `display_currency` IS NULL;

UPDATE `general_settings`
SET `default_locale` = 'fr',
    `default_currency` = 'EUR',
    `timezone` = 'Europe/Paris',
    `updated_at` = CURRENT_TIMESTAMP;
