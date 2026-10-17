-- Keep the public registration offers and the billable plans in sync.
INSERT INTO `plans`
    (`name`, `slug`, `description`, `price_cents`, `currency_code`, `monthly_price_cents`, `yearly_price_cents`, `trial_days`, `ai_credits`, `agents_limit`, `campaigns_limit`, `contacts_limit`, `numbers_limit`, `monthly_bonus_credits`, `priority_support`, `messaging_enabled`, `whatsapp_enabled`, `white_label_enabled`, `featured`, `popular`, `interval`, `sort_order`, `enabled`, `created_at`, `updated_at`)
VALUES
    ('Découverte', 'free', 'Testez la voix IA en direct sans carte bancaire.', 0, 'EUR', 0, 0, 0, 10, 1, 0, 10, 0, 0, false, false, false, false, false, false, 'month', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Starter', 'starter', 'Idéal pour indépendants, artisans et praticiens solos.', 3900, 'EUR', 3900, 38400, 0, 80, 1, 0, 500, 1, 80, false, true, false, false, false, false, 'month', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Pro', 'pro', 'Pour cabinets, PME, commerces et agences.', 8900, 'EUR', 8900, 88800, 0, 250, 3, 20, 10000, 2, 250, true, true, true, false, true, true, 'month', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Agency / Scale', 'agency', 'Pour agences, réseaux d’entreprises et centres d’appels.', 19900, 'EUR', 19900, 199200, 0, 750, 99999, 99999, 999999, 20, 750, true, true, true, true, false, false, 'month', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `description` = VALUES(`description`),
    `price_cents` = VALUES(`price_cents`),
    `currency_code` = VALUES(`currency_code`),
    `monthly_price_cents` = VALUES(`monthly_price_cents`),
    `yearly_price_cents` = VALUES(`yearly_price_cents`),
    `ai_credits` = VALUES(`ai_credits`),
    `agents_limit` = VALUES(`agents_limit`),
    `campaigns_limit` = VALUES(`campaigns_limit`),
    `contacts_limit` = VALUES(`contacts_limit`),
    `numbers_limit` = VALUES(`numbers_limit`),
    `monthly_bonus_credits` = VALUES(`monthly_bonus_credits`),
    `priority_support` = VALUES(`priority_support`),
    `messaging_enabled` = VALUES(`messaging_enabled`),
    `whatsapp_enabled` = VALUES(`whatsapp_enabled`),
    `white_label_enabled` = VALUES(`white_label_enabled`),
    `featured` = VALUES(`featured`),
    `popular` = VALUES(`popular`),
    `sort_order` = VALUES(`sort_order`),
    `enabled` = true,
    `updated_at` = CURRENT_TIMESTAMP;
