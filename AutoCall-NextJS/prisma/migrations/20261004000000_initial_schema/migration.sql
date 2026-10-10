-- CreateTable
CREATE TABLE `admin_role` (
    `admin_user_id` BIGINT UNSIGNED NOT NULL,
    `role_id` BIGINT UNSIGNED NOT NULL,

    INDEX `admin_role_role_id_foreign`(`role_id`),
    PRIMARY KEY (`admin_user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `admin_users_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agents` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `voice_id` BIGINT UNSIGNED NULL,
    `language` VARCHAR(16) NOT NULL DEFAULT 'en',
    `llm_model` VARCHAR(64) NOT NULL DEFAULT 'gpt-4o-mini',
    `engine` VARCHAR(40) NOT NULL DEFAULT 'elevenlabs_twilio',
    `temperature` DECIMAL(2, 1) NOT NULL DEFAULT 0.7,
    `tone` VARCHAR(64) NULL,
    `personality` VARCHAR(64) NULL,
    `system_prompt` LONGTEXT NULL,
    `greeting` TEXT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'draft',
    `elevenlabs_agent_id` VARCHAR(255) NULL,
    `cost_per_minute_cents` INTEGER UNSIGNED NOT NULL DEFAULT 107,
    `meta` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `agents_client_status_idx`(`client_id`, `status`),
    INDEX `agents_user_id_foreign`(`user_id`),
    INDEX `agents_voice_id_foreign`(`voice_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_requests` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `website_id` BIGINT UNSIGNED NULL,
    `step` VARCHAR(64) NULL,
    `prompt` TEXT NULL,
    `response` LONGTEXT NULL,
    `tokens_used` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `cost` DECIMAL(10, 6) NOT NULL DEFAULT 0.000000,
    `credits_used` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
    `job_id` VARCHAR(64) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `ai_requests_job_id_index`(`job_id`),
    INDEX `ai_requests_user_id_created_at_index`(`user_id`, `created_at`),
    INDEX `ai_requests_website_id_foreign`(`website_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_audit_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `api_key_id` BIGINT UNSIGNED NULL,
    `client_id` BIGINT UNSIGNED NULL,
    `method` VARCHAR(8) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `status_code` SMALLINT UNSIGNED NULL,
    `ip` VARCHAR(45) NULL,
    `duration_ms` INTEGER UNSIGNED NULL,
    `request_id` VARCHAR(36) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `api_audit_logs_api_key_id_foreign`(`api_key_id`),
    INDEX `api_audit_logs_client_id_created_at_index`(`client_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_keys` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `prefix` VARCHAR(16) NOT NULL,
    `key_hash` VARCHAR(255) NOT NULL,
    `scopes` JSON NULL,
    `ip_whitelist` JSON NULL,
    `rate_limit_per_min` INTEGER UNSIGNED NOT NULL DEFAULT 100,
    `last_used_at` TIMESTAMP(0) NULL,
    `expires_at` TIMESTAMP(0) NULL,
    `revoked_at` TIMESTAMP(0) NULL,
    `created_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `api_keys_prefix_unique`(`prefix`),
    INDEX `api_keys_client_id_foreign`(`client_id`),
    INDEX `api_keys_created_by_foreign`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `contact_id` BIGINT UNSIGNED NULL,
    `agent_id` BIGINT UNSIGNED NULL,
    `title` VARCHAR(255) NOT NULL,
    `contact_name` VARCHAR(255) NULL,
    `contact_phone` VARCHAR(255) NULL,
    `contact_email` VARCHAR(255) NULL,
    `scheduled_at` TIMESTAMP(0) NOT NULL,
    `duration_minutes` SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    `status` VARCHAR(255) NOT NULL DEFAULT 'scheduled',
    `source` VARCHAR(255) NOT NULL DEFAULT 'manual',
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `appointments_agent_id_foreign`(`agent_id`),
    INDEX `appointments_client_id_status_index`(`client_id`, `status`),
    INDEX `appointments_contact_id_foreign`(`contact_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `actor_admin_id` BIGINT UNSIGNED NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `client_id` BIGINT UNSIGNED NULL,
    `action` VARCHAR(64) NOT NULL,
    `auditable_type` VARCHAR(128) NULL,
    `auditable_id` BIGINT UNSIGNED NULL,
    `old_values` JSON NULL,
    `new_values` JSON NULL,
    `meta` JSON NULL,
    `ip` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `url` VARCHAR(512) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `audit_logs_actor_admin_id_foreign`(`actor_admin_id`),
    INDEX `audit_logs_auditable_type_auditable_id_index`(`auditable_type`, `auditable_id`),
    INDEX `audit_logs_client_created_idx`(`client_id`, `created_at`),
    INDEX `audit_logs_user_id_created_at_index`(`user_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cache` (
    `key` VARCHAR(255) NOT NULL,
    `value` MEDIUMTEXT NOT NULL,
    `expiration` INTEGER NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cache_locks` (
    `key` VARCHAR(255) NOT NULL,
    `owner` VARCHAR(255) NOT NULL,
    `expiration` INTEGER NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `call_queue_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `campaign_id` BIGINT UNSIGNED NOT NULL,
    `contact_id` BIGINT UNSIGNED NOT NULL,
    `agent_id` BIGINT UNSIGNED NULL,
    `phone_number_id` BIGINT UNSIGNED NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
    `scheduled_for` TIMESTAMP(0) NULL,
    `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `max_retries` TINYINT UNSIGNED NOT NULL DEFAULT 3,
    `last_error` TEXT NULL,
    `locked_at` TIMESTAMP(0) NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `call_queue_jobs_agent_id_foreign`(`agent_id`),
    INDEX `call_queue_jobs_campaign_id_foreign`(`campaign_id`),
    INDEX `call_queue_jobs_client_id_foreign`(`client_id`),
    INDEX `call_queue_jobs_contact_id_foreign`(`contact_id`),
    INDEX `call_queue_jobs_phone_number_id_foreign`(`phone_number_id`),
    INDEX `call_queue_jobs_status_scheduled_for_index`(`status`, `scheduled_for`),
    INDEX `cqj_status_scheduled_idx`(`status`, `scheduled_for`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calls` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `campaign_id` BIGINT UNSIGNED NULL,
    `agent_id` BIGINT UNSIGNED NULL,
    `contact_id` BIGINT UNSIGNED NULL,
    `phone_number_id` BIGINT UNSIGNED NULL,
    `twilio_call_sid` VARCHAR(255) NULL,
    `direction` VARCHAR(16) NOT NULL DEFAULT 'outbound',
    `engine` VARCHAR(40) NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'queued',
    `started_at` TIMESTAMP(0) NULL,
    `ended_at` TIMESTAMP(0) NULL,
    `duration_seconds` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `recording_url` VARCHAR(255) NULL,
    `recording_sid` VARCHAR(255) NULL,
    `transcript` LONGTEXT NULL,
    `summary` TEXT NULL,
    `sentiment` VARCHAR(16) NULL,
    `qualification` VARCHAR(16) NULL,
    `outcome` VARCHAR(255) NULL,
    `voice_cost_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `llm_cost_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `credits_charged` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `retry_of` BIGINT UNSIGNED NULL,
    `meta` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `calls_agent_id_foreign`(`agent_id`),
    INDEX `calls_campaign_id_foreign`(`campaign_id`),
    INDEX `calls_client_id_created_at_index`(`client_id`, `created_at`),
    INDEX `calls_client_qual_idx`(`client_id`, `qualification`),
    INDEX `calls_client_status_idx`(`client_id`, `status`),
    INDEX `calls_contact_id_foreign`(`contact_id`),
    INDEX `calls_phone_number_id_foreign`(`phone_number_id`),
    INDEX `calls_retry_of_foreign`(`retry_of`),
    INDEX `calls_twilio_call_sid_index`(`twilio_call_sid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_contact` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `campaign_id` BIGINT UNSIGNED NOT NULL,
    `contact_id` BIGINT UNSIGNED NOT NULL,
    `call_status` VARCHAR(32) NOT NULL DEFAULT 'pending',
    `last_call_id` BIGINT UNSIGNED NULL,
    `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `campaign_contact_contact_id_foreign`(`contact_id`),
    INDEX `campaign_contact_last_call_id_foreign`(`last_call_id`),
    UNIQUE INDEX `campaign_contact_campaign_id_contact_id_unique`(`campaign_id`, `contact_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaigns` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(32) NOT NULL DEFAULT 'lead_qualification',
    `goal` TEXT NULL,
    `agent_id` BIGINT UNSIGNED NULL,
    `phone_number_id` BIGINT UNSIGNED NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'draft',
    `schedule_start` TIMESTAMP(0) NULL,
    `schedule_end` TIMESTAMP(0) NULL,
    `daily_call_cap` INTEGER UNSIGNED NULL,
    `max_retries` TINYINT UNSIGNED NOT NULL DEFAULT 3,
    `retry_delay_minutes` INTEGER UNSIGNED NOT NULL DEFAULT 60,
    `timezone` VARCHAR(64) NULL,
    `stats` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `campaigns_agent_id_foreign`(`agent_id`),
    INDEX `campaigns_client_status_idx`(`client_id`, `status`),
    INDEX `campaigns_phone_number_id_foreign`(`phone_number_id`),
    INDEX `campaigns_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_permissions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `module` VARCHAR(64) NOT NULL,
    `action` VARCHAR(16) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `client_permissions_key_unique`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_role_permission` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_role_id` BIGINT UNSIGNED NOT NULL,
    `client_permission_id` BIGINT UNSIGNED NOT NULL,

    INDEX `client_role_permission_client_permission_id_foreign`(`client_permission_id`),
    UNIQUE INDEX `crp_unique`(`client_role_id`, `client_permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_roles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `key` VARCHAR(64) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `is_system` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `client_roles_client_id_key_unique`(`client_id`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_subscriptions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `plan_id` BIGINT UNSIGNED NOT NULL,
    `billing_cycle` VARCHAR(16) NOT NULL,
    `starts_at` TIMESTAMP(0) NULL,
    `ends_at` TIMESTAMP(0) NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'active',
    `assigned_by_admin_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `client_subscriptions_assigned_by_admin_id_foreign`(`assigned_by_admin_id`),
    INDEX `client_subscriptions_client_id_status_index`(`client_id`, `status`),
    INDEX `client_subscriptions_plan_id_foreign`(`plan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_user_role` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `client_role_id` BIGINT UNSIGNED NOT NULL,

    INDEX `client_user_role_client_role_id_foreign`(`client_role_id`),
    UNIQUE INDEX `client_user_role_user_id_client_role_id_unique`(`user_id`, `client_role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(64) NULL,
    `address` TEXT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'active',
    `kyc_status` VARCHAR(16) NOT NULL DEFAULT 'unverified',
    `base_currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
    `currency_symbol` VARCHAR(16) NOT NULL DEFAULT '$',
    `currency_position` VARCHAR(32) NOT NULL DEFAULT 'before',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `clients_email_index`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_list_contact` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `contact_list_id` BIGINT UNSIGNED NOT NULL,
    `contact_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `contact_list_contact_contact_id_foreign`(`contact_id`),
    UNIQUE INDEX `contact_list_contact_contact_list_id_contact_id_unique`(`contact_list_id`, `contact_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_lists` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `contact_lists_client_id_foreign`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NULL,
    `phone` VARCHAR(32) NOT NULL,
    `email` VARCHAR(255) NULL,
    `company` VARCHAR(255) NULL,
    `tags` JSON NULL,
    `custom_fields` JSON NULL,
    `source` VARCHAR(32) NOT NULL DEFAULT 'manual',
    `pipeline_stage` VARCHAR(255) NULL DEFAULT 'new',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `contacts_client_id_pipeline_stage_index`(`client_id`, `pipeline_stage`),
    UNIQUE INDEX `contacts_client_id_phone_unique`(`client_id`, `phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `contact_id` BIGINT UNSIGNED NULL,
    `whatsapp_account_id` BIGINT UNSIGNED NULL,
    `channel` VARCHAR(16) NOT NULL DEFAULT 'whatsapp',
    `wa_phone` VARCHAR(32) NOT NULL,
    `name` VARCHAR(255) NULL,
    `last_message_at` TIMESTAMP(0) NULL,
    `window_expires_at` TIMESTAMP(0) NULL,
    `unread_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `status` VARCHAR(16) NOT NULL DEFAULT 'open',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `conversations_contact_id_foreign`(`contact_id`),
    INDEX `conversations_whatsapp_account_id_foreign`(`whatsapp_account_id`),
    UNIQUE INDEX `conversations_client_id_channel_wa_phone_unique`(`client_id`, `channel`, `wa_phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credit_ledger` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `delta` INTEGER NOT NULL,
    `balance_after` INTEGER NOT NULL,
    `reason` VARCHAR(32) NOT NULL,
    `reference_type` VARCHAR(255) NULL,
    `reference_id` BIGINT UNSIGNED NULL,
    `note` VARCHAR(255) NULL,
    `created_by_admin_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `credit_ledger_client_id_id_index`(`client_id`, `id`),
    INDEX `credit_ledger_created_by_admin_id_foreign`(`created_by_admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credit_packages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `credits` INTEGER UNSIGNED NOT NULL,
    `price_cents` BIGINT UNSIGNED NOT NULL,
    `currency_code` VARCHAR(10) NOT NULL DEFAULT 'USD',
    `is_popular` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credit_purchases` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `credit_package_id` BIGINT UNSIGNED NULL,
    `credits` INTEGER UNSIGNED NOT NULL,
    `amount_cents` BIGINT UNSIGNED NOT NULL,
    `currency_code` VARCHAR(10) NOT NULL DEFAULT 'USD',
    `gateway` VARCHAR(32) NULL,
    `gateway_reference` VARCHAR(255) NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `credit_purchases_client_id_foreign`(`client_id`),
    INDEX `credit_purchases_credit_package_id_foreign`(`credit_package_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `currencies` (
    `code` VARCHAR(10) NOT NULL,
    `symbol` VARCHAR(10) NOT NULL,
    `decimals` TINYINT UNSIGNED NOT NULL DEFAULT 2,
    `exchange_rate` DECIMAL(18, 8) NOT NULL DEFAULT 1.00000000,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_support_ticket_messages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL,
    `sender_type` VARCHAR(32) NOT NULL,
    `sender_name` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `is_internal` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `customer_support_ticket_messages_ticket_id_created_at_index`(`ticket_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_support_tickets` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `requester_name` VARCHAR(255) NULL,
    `requester_email` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'open',
    `priority` VARCHAR(32) NOT NULL DEFAULT 'medium',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `customer_support_tickets_client_id_status_index`(`client_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `domains` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `website_id` BIGINT UNSIGNED NOT NULL,
    `domain` VARCHAR(253) NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
    `verification_token` VARCHAR(64) NULL,
    `ssl_status` VARCHAR(32) NULL,
    `verified_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `domains_domain_unique`(`domain`),
    INDEX `domains_website_id_foreign`(`website_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `elevenlabs_keys` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(255) NOT NULL,
    `api_key` TEXT NOT NULL,
    `max_concurrency` INTEGER UNSIGNED NOT NULL DEFAULT 30,
    `current_load` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `status` VARCHAR(32) NOT NULL DEFAULT 'active',
    `last_health_check_at` TIMESTAMP(0) NULL,
    `agents_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `meta` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flow_execution_steps` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `flow_execution_id` BIGINT UNSIGNED NOT NULL,
    `node_id` VARCHAR(255) NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL DEFAULT 'action',
    `status` VARCHAR(255) NOT NULL DEFAULT 'pending',
    `output` JSON NULL,
    `started_at` TIMESTAMP(0) NULL,
    `finished_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `flow_execution_steps_flow_execution_id_index`(`flow_execution_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flow_executions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `flow_id` BIGINT UNSIGNED NOT NULL,
    `status` VARCHAR(255) NOT NULL DEFAULT 'running',
    `trigger_source` VARCHAR(255) NOT NULL DEFAULT 'manual',
    `context` JSON NULL,
    `error` TEXT NULL,
    `started_at` TIMESTAMP(0) NULL,
    `finished_at` TIMESTAMP(0) NULL,
    `duration_ms` INTEGER UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `flow_executions_client_id_status_index`(`client_id`, `status`),
    INDEX `flow_executions_flow_id_status_index`(`flow_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flows` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `status` VARCHAR(255) NOT NULL DEFAULT 'draft',
    `trigger_type` VARCHAR(255) NULL,
    `definition` JSON NULL,
    `template_key` VARCHAR(255) NULL,
    `last_run_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `flows_client_id_status_index`(`client_id`, `status`),
    INDEX `flows_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `form_submissions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `form_id` BIGINT UNSIGNED NOT NULL,
    `data` JSON NULL,
    `contact_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `form_submissions_client_id_form_id_index`(`client_id`, `form_id`),
    INDEX `form_submissions_contact_id_foreign`(`contact_id`),
    INDEX `form_submissions_form_id_foreign`(`form_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forms` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `fields` JSON NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'active',
    `public_token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `forms_public_token_unique`(`public_token`),
    INDEX `forms_client_id_status_index`(`client_id`, `status`),
    INDEX `forms_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `general_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `system_title` VARCHAR(191) NULL,
    `company_name` VARCHAR(191) NULL,
    `tagline` TEXT NULL,
    `email` VARCHAR(191) NULL,
    `timezone` VARCHAR(128) NOT NULL DEFAULT 'UTC',
    `default_locale` VARCHAR(32) NULL,
    `country` VARCHAR(2) NULL,
    `default_currency` VARCHAR(8) NULL,
    `primary_color` VARCHAR(32) NULL,
    `favicon_path` VARCHAR(255) NULL,
    `site_logo_path` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `google_sheet_connections` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `connected` BOOLEAN NOT NULL DEFAULT false,
    `account_email` VARCHAR(255) NULL,
    `spreadsheet_id` VARCHAR(255) NULL,
    `spreadsheet_url` VARCHAR(255) NULL,
    `sync_forms` BOOLEAN NOT NULL DEFAULT false,
    `sync_appointments` BOOLEAN NOT NULL DEFAULT false,
    `rows_synced` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `last_synced_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `google_sheet_connections_client_id_unique`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inbound_routes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `phone_number_id` BIGINT UNSIGNED NULL,
    `agent_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `action` VARCHAR(255) NOT NULL DEFAULT 'connect_agent',
    `forward_to` VARCHAR(255) NULL,
    `priority` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `inbound_routes_agent_id_foreign`(`agent_id`),
    INDEX `inbound_routes_client_id_enabled_index`(`client_id`, `enabled`),
    INDEX `inbound_routes_phone_number_id_foreign`(`phone_number_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `integration_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `config` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `integration_settings_key_unique`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_batches` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `total_jobs` INTEGER NOT NULL,
    `pending_jobs` INTEGER NOT NULL,
    `failed_jobs` INTEGER NOT NULL,
    `failed_job_ids` LONGTEXT NOT NULL,
    `options` MEDIUMTEXT NULL,
    `cancelled_at` INTEGER NULL,
    `created_at` INTEGER NOT NULL,
    `finished_at` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `queue` VARCHAR(255) NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `attempts` TINYINT UNSIGNED NOT NULL,
    `reserved_at` INTEGER UNSIGNED NULL,
    `available_at` INTEGER UNSIGNED NOT NULL,
    `created_at` INTEGER UNSIGNED NOT NULL,

    INDEX `jobs_queue_index`(`queue`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_base_items` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `agent_id` BIGINT UNSIGNED NULL,
    `type` VARCHAR(16) NOT NULL DEFAULT 'text',
    `title` VARCHAR(255) NOT NULL,
    `source_url` VARCHAR(255) NULL,
    `file_path` VARCHAR(255) NULL,
    `file_size_bytes` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `content` LONGTEXT NULL,
    `tokens` INTEGER UNSIGNED NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `knowledge_base_items_agent_id_foreign`(`agent_id`),
    INDEX `knowledge_base_items_client_id_foreign`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kyc_documents` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `type` VARCHAR(48) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'pending',
    `note` VARCHAR(255) NULL,
    `reviewed_by_admin_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `kyc_documents_reviewed_by_admin_id_foreign`(`reviewed_by_admin_id`),
    UNIQUE INDEX `kyc_documents_client_id_type_unique`(`client_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locales` (
    `code` VARCHAR(10) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `native_name` VARCHAR(255) NULL,
    `flag` VARCHAR(20) NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `is_rtl` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marketing_gift_cards` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `code` VARCHAR(96) NOT NULL,
    `initial_amount` DECIMAL(14, 2) NOT NULL,
    `balance` DECIMAL(14, 2) NOT NULL,
    `recipient_name` VARCHAR(255) NULL,
    `recipient_email` VARCHAR(255) NULL,
    `personal_message` TEXT NULL,
    `theme` VARCHAR(32) NOT NULL DEFAULT 'default',
    `expires_at` TIMESTAMP(0) NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'active',
    `delivery_status` VARCHAR(16) NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `marketing_gift_cards_client_id_code_unique`(`client_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marketing_referral_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `reward_type` VARCHAR(16) NOT NULL DEFAULT 'percentage',
    `reward_value` DECIMAL(12, 2) NOT NULL DEFAULT 10.00,
    `referred_user_discount` DECIMAL(8, 2) NOT NULL DEFAULT 10.00,
    `min_order_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `expiry_days` INTEGER UNSIGNED NOT NULL DEFAULT 90,
    `terms` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `marketing_referral_settings_client_id_unique`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marketing_referrals` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `referral_code` VARCHAR(64) NOT NULL,
    `referrer_email` VARCHAR(255) NULL,
    `referred_email` VARCHAR(255) NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
    `reward_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `converted_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `marketing_referrals_client_id_foreign`(`client_id`),
    INDEX `marketing_referrals_referral_code_index`(`referral_code`),
    INDEX `marketing_referrals_status_index`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marketing_vouchers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `code` VARCHAR(64) NOT NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'active',
    `discount_type` VARCHAR(16) NOT NULL,
    `discount_value` DECIMAL(12, 4) NOT NULL,
    `description` TEXT NULL,
    `min_purchase` DECIMAL(14, 4) NOT NULL DEFAULT 0.0000,
    `max_discount_cap` DECIMAL(14, 4) NULL,
    `total_usage_limit` INTEGER UNSIGNED NULL,
    `per_user_limit` INTEGER UNSIGNED NOT NULL DEFAULT 100,
    `valid_from` DATETIME(0) NOT NULL,
    `valid_until` DATETIME(0) NOT NULL,
    `first_time_only` BOOLEAN NOT NULL DEFAULT false,
    `stackable` BOOLEAN NOT NULL DEFAULT false,
    `usage_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `total_discount_amount` DECIMAL(14, 4) NOT NULL DEFAULT 0.0000,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `marketing_vouchers_client_id_code_unique`(`client_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message_templates` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `channel` VARCHAR(16) NOT NULL DEFAULT 'email',
    `name` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NULL,
    `design_json` LONGTEXT NULL,
    `html` LONGTEXT NULL,
    `variables` JSON NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `message_templates_client_id_foreign`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `conversation_id` BIGINT UNSIGNED NULL,
    `contact_id` BIGINT UNSIGNED NULL,
    `channel` VARCHAR(16) NOT NULL,
    `direction` VARCHAR(8) NOT NULL,
    `type` VARCHAR(16) NOT NULL DEFAULT 'text',
    `subject` VARCHAR(255) NULL,
    `body` LONGTEXT NULL,
    `media_url` VARCHAR(255) NULL,
    `template_id` BIGINT UNSIGNED NULL,
    `provider` VARCHAR(16) NULL,
    `provider_message_id` VARCHAR(255) NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'queued',
    `error` TEXT NULL,
    `call_id` BIGINT UNSIGNED NULL,
    `sent_by` VARCHAR(255) NULL,
    `meta` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `messages_call_id_foreign`(`call_id`),
    INDEX `messages_client_id_channel_created_at_index`(`client_id`, `channel`, `created_at`),
    INDEX `messages_contact_id_foreign`(`contact_id`),
    INDEX `messages_conversation_id_foreign`(`conversation_id`),
    INDEX `messages_provider_message_id_index`(`provider_message_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messaging_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `provider_mode` VARCHAR(16) NOT NULL DEFAULT 'disabled',
    `meta_app_id` VARCHAR(255) NULL,
    `meta_app_secret` TEXT NULL,
    `meta_config_id` VARCHAR(255) NULL,
    `verify_token` VARCHAR(255) NULL,
    `embedded_signup_enabled` BOOLEAN NOT NULL DEFAULT false,
    `coexistence_enabled` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `level` VARCHAR(16) NOT NULL DEFAULT 'info',
    `created_by_admin_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `notifications_client_id_created_at_index`(`client_id`, `created_at`),
    INDEX `notifications_created_by_admin_id_foreign`(`created_by_admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_revisions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `page_id` BIGINT UNSIGNED NOT NULL,
    `version` INTEGER UNSIGNED NOT NULL,
    `data_json` JSON NOT NULL,
    `created_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `page_revisions_created_by_foreign`(`created_by`),
    UNIQUE INDEX `page_revisions_page_id_version_unique`(`page_id`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `website_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `seo_meta` JSON NULL,
    `data_json` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `pages_website_id_slug_unique`(`website_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_gateway_configs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `gateway` VARCHAR(32) NOT NULL,
    `test_mode` BOOLEAN NOT NULL DEFAULT true,
    `enabled` BOOLEAN NOT NULL DEFAULT false,
    `credentials` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `payment_gateway_configs_gateway_unique`(`gateway`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_transactions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `subscription_id` BIGINT UNSIGNED NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `gateway` VARCHAR(32) NOT NULL,
    `gateway_transaction_id` VARCHAR(255) NULL,
    `amount_cents` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `currency_code` VARCHAR(10) NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
    `payload` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `payment_transactions_gateway_gateway_transaction_id_index`(`gateway`, `gateway_transaction_id`),
    INDEX `payment_transactions_gateway_transaction_id_index`(`gateway_transaction_id`),
    INDEX `payment_transactions_subscription_id_foreign`(`subscription_id`),
    INDEX `payment_transactions_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `permissions_key_unique`(`key`),
    INDEX `permissions_category_index`(`category`),
    INDEX `permissions_key_index`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phone_numbers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NULL,
    `twilio_sid` VARCHAR(255) NULL,
    `e164_number` VARCHAR(32) NOT NULL,
    `friendly_name` VARCHAR(255) NULL,
    `type` VARCHAR(32) NOT NULL DEFAULT 'local',
    `source` VARCHAR(16) NOT NULL DEFAULT 'twilio',
    `sip_trunk_id` BIGINT UNSIGNED NULL,
    `agent_id` BIGINT UNSIGNED NULL,
    `direction` VARCHAR(16) NOT NULL DEFAULT 'outbound',
    `country` VARCHAR(8) NULL,
    `monthly_cost_credits` INTEGER UNSIGNED NOT NULL DEFAULT 50,
    `purchased_at` TIMESTAMP(0) NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'active',
    `capabilities` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `phone_numbers_agent_id_foreign`(`agent_id`),
    INDEX `phone_numbers_client_status_idx`(`client_id`, `status`),
    INDEX `phone_numbers_e164_number_index`(`e164_number`),
    INDEX `phone_numbers_sip_trunk_id_foreign`(`sip_trunk_id`),
    INDEX `phone_numbers_twilio_sid_index`(`twilio_sid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plans` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price_cents` BIGINT UNSIGNED NOT NULL,
    `currency_code` VARCHAR(10) NOT NULL,
    `monthly_price_cents` BIGINT UNSIGNED NULL,
    `yearly_price_cents` BIGINT UNSIGNED NULL,
    `trial_days` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `stripe_monthly_id` VARCHAR(255) NULL,
    `stripe_yearly_id` VARCHAR(255) NULL,
    `features` JSON NULL,
    `limits` JSON NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `popular` BOOLEAN NOT NULL DEFAULT false,
    `ai_credits` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `websites_limit` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `export_enabled` BOOLEAN NOT NULL DEFAULT false,
    `custom_domain_enabled` BOOLEAN NOT NULL DEFAULT false,
    `white_label_enabled` BOOLEAN NOT NULL DEFAULT false,
    `agents_limit` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `campaigns_limit` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `contacts_limit` INTEGER UNSIGNED NOT NULL DEFAULT 5,
    `numbers_limit` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `kb_mb_limit` INTEGER UNSIGNED NOT NULL DEFAULT 20,
    `monthly_bonus_credits` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `priority_support` BOOLEAN NOT NULL DEFAULT false,
    `messaging_enabled` BOOLEAN NOT NULL DEFAULT false,
    `whatsapp_enabled` BOOLEAN NOT NULL DEFAULT false,
    `monthly_email_limit` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `monthly_whatsapp_limit` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `api_enabled` BOOLEAN NOT NULL DEFAULT false,
    `api_keys_limit` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `api_rate_limit_per_min` INTEGER UNSIGNED NOT NULL DEFAULT 100,
    `team_seats_limit` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `custom_roles_enabled` BOOLEAN NOT NULL DEFAULT false,
    `sip_enabled` BOOLEAN NOT NULL DEFAULT false,
    `sip_trunks_limit` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `sip_numbers_limit` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `sip_concurrency_limit` INTEGER UNSIGNED NOT NULL DEFAULT 5,
    `interval` VARCHAR(20) NOT NULL DEFAULT 'month',
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `plans_slug_unique`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prompt_templates` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `category` VARCHAR(255) NOT NULL DEFAULT 'general',
    `content` TEXT NOT NULL,
    `variables` JSON NULL,
    `is_system` BOOLEAN NOT NULL DEFAULT false,
    `usage_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `prompt_templates_client_id_category_index`(`client_id`, `category`),
    INDEX `prompt_templates_is_system_index`(`is_system`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permission` (
    `role_id` BIGINT UNSIGNED NOT NULL,
    `permission_id` BIGINT UNSIGNED NOT NULL,

    INDEX `role_permission_permission_id_foreign`(`permission_id`),
    PRIMARY KEY (`role_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `is_system` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `roles_key_unique`(`key`),
    INDEX `roles_key_index`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `payload` LONGTEXT NOT NULL,
    `last_activity` INTEGER NOT NULL,

    INDEX `sessions_last_activity_index`(`last_activity`),
    INDEX `sessions_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sip_trunks` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `provider` VARCHAR(32) NOT NULL DEFAULT 'generic',
    `engine` VARCHAR(16) NOT NULL DEFAULT 'elevenlabs',
    `sip_host` VARCHAR(255) NOT NULL,
    `sip_port` SMALLINT UNSIGNED NOT NULL DEFAULT 5060,
    `transport` VARCHAR(8) NOT NULL DEFAULT 'udp',
    `username` TEXT NULL,
    `password` TEXT NULL,
    `auth_id` TEXT NULL,
    `inbound_enabled` BOOLEAN NOT NULL DEFAULT true,
    `outbound_enabled` BOOLEAN NOT NULL DEFAULT true,
    `concurrency_limit` INTEGER UNSIGNED NOT NULL DEFAULT 5,
    `status` VARCHAR(16) NOT NULL DEFAULT 'active',
    `webhook_secret` VARCHAR(255) NULL,
    `meta` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `sip_trunks_client_id_foreign`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `smtp_configurations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `host` VARCHAR(255) NOT NULL,
    `port` SMALLINT UNSIGNED NOT NULL DEFAULT 587,
    `username` VARCHAR(255) NOT NULL,
    `password` TEXT NOT NULL,
    `encryption` VARCHAR(16) NOT NULL DEFAULT 'tls',
    `from_email` VARCHAR(255) NOT NULL,
    `from_name` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `plan_id` BIGINT UNSIGNED NOT NULL,
    `status` VARCHAR(32) NOT NULL,
    `starts_at` TIMESTAMP(0) NULL,
    `ends_at` TIMESTAMP(0) NULL,
    `gateway` VARCHAR(32) NOT NULL,
    `gateway_subscription_id` VARCHAR(255) NULL,
    `renews_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `subscriptions_gateway_subscription_id_index`(`gateway_subscription_id`),
    INDEX `subscriptions_plan_id_foreign`(`plan_id`),
    INDEX `subscriptions_user_id_status_index`(`user_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(128) NOT NULL,
    `value` TEXT NULL,
    `is_secret` BOOLEAN NOT NULL DEFAULT false,
    `group` VARCHAR(64) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `system_settings_key_unique`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `templates` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(128) NOT NULL,
    `subject` VARCHAR(255) NULL,
    `type` VARCHAR(32) NOT NULL DEFAULT 'email',
    `content` TEXT NULL,
    `meta` JSON NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `templates_slug_unique`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenant_user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `role` VARCHAR(32) NOT NULL DEFAULT 'member',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `tenant_user_user_id_foreign`(`user_id`),
    UNIQUE INDEX `tenant_user_tenant_id_user_id_unique`(`tenant_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenants` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `owner_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `default_locale` VARCHAR(10) NOT NULL DEFAULT 'en',
    `currency_code` VARCHAR(10) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `tenants_owner_id_foreign`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `translations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `group` VARCHAR(64) NOT NULL DEFAULT 'app',
    `key` VARCHAR(255) NOT NULL,
    `locale_code` VARCHAR(10) NOT NULL,
    `value` LONGTEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `translations_key_index`(`key`),
    INDEX `translations_locale_code_index`(`locale_code`),
    UNIQUE INDEX `translations_group_key_locale_code_unique`(`group`, `key`, `locale_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NULL,
    `tenant_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `role` VARCHAR(32) NOT NULL DEFAULT 'client',
    `status` VARCHAR(32) NOT NULL DEFAULT 'active',
    `client_role` VARCHAR(32) NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `locale` VARCHAR(10) NULL,
    `display_currency` VARCHAR(10) NULL,
    `theme` ENUM('dark', 'light') NOT NULL DEFAULT 'dark',
    `notifications_read_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    INDEX `users_client_id_index`(`client_id`),
    INDEX `users_tenant_id_foreign`(`tenant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voices` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `external_id` VARCHAR(255) NULL,
    `name` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(32) NULL,
    `age_group` VARCHAR(32) NULL,
    `tone` VARCHAR(64) NULL,
    `best_for` VARCHAR(64) NULL,
    `accent` VARCHAR(64) NULL,
    `language` VARCHAR(16) NULL,
    `preview_url` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `elevenlabs_key_id` BIGINT UNSIGNED NULL,
    `meta` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `voices_elevenlabs_key_id_foreign`(`elevenlabs_key_id`),
    INDEX `voices_external_id_index`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webhook_deliveries` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `webhook_id` BIGINT UNSIGNED NOT NULL,
    `event` VARCHAR(255) NOT NULL,
    `payload` JSON NULL,
    `response_code` SMALLINT UNSIGNED NULL,
    `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `webhook_deliveries_webhook_id_foreign`(`webhook_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webhooks` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `target_url` VARCHAR(255) NOT NULL,
    `campaign_id` BIGINT UNSIGNED NULL,
    `events` JSON NULL,
    `secret` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_delivery_at` TIMESTAMP(0) NULL,
    `last_status` VARCHAR(32) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `webhooks_campaign_id_foreign`(`campaign_id`),
    INDEX `webhooks_client_id_foreign`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `website_templates` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `industry` VARCHAR(64) NULL,
    `preview_images` JSON NULL,
    `pages_json` JSON NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `website_widgets` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `agent_id` BIGINT UNSIGNED NULL,
    `title` VARCHAR(255) NOT NULL DEFAULT 'Chat with us',
    `welcome_message` VARCHAR(255) NULL,
    `primary_color` VARCHAR(255) NOT NULL DEFAULT '#6d3fea',
    `position` VARCHAR(255) NOT NULL DEFAULT 'bottom-right',
    `enabled` BOOLEAN NOT NULL DEFAULT false,
    `public_token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `website_widgets_client_id_unique`(`client_id`),
    UNIQUE INDEX `website_widgets_public_token_unique`(`public_token`),
    INDEX `website_widgets_agent_id_foreign`(`agent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `websites` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'draft',
    `published_url` VARCHAR(255) NULL,
    `custom_domain` VARCHAR(255) NULL,
    `default_locale` VARCHAR(10) NOT NULL DEFAULT 'en',
    `default_currency` VARCHAR(10) NULL,
    `industry` VARCHAR(64) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `websites_tenant_id_slug_unique`(`tenant_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whatsapp_accounts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `provider` VARCHAR(16) NOT NULL DEFAULT 'meta',
    `label` VARCHAR(255) NULL,
    `waba_id` VARCHAR(255) NULL,
    `phone_number_id` VARCHAR(255) NULL,
    `display_number` VARCHAR(255) NULL,
    `access_token` TEXT NULL,
    `api_key` TEXT NULL,
    `base_url` VARCHAR(255) NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'connected',
    `quality_rating` VARCHAR(255) NULL,
    `messaging_tier` VARCHAR(255) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `meta` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `whatsapp_accounts_client_id_foreign`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whatsapp_templates` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `whatsapp_account_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `language` VARCHAR(16) NOT NULL DEFAULT 'en_US',
    `category` VARCHAR(255) NULL,
    `components` JSON NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'approved',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `whatsapp_templates_client_id_foreign`(`client_id`),
    INDEX `whatsapp_templates_whatsapp_account_id_foreign`(`whatsapp_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_role` ADD CONSTRAINT `admin_role_admin_user_id_foreign` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `admin_role` ADD CONSTRAINT `admin_role_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `agents` ADD CONSTRAINT `agents_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `agents` ADD CONSTRAINT `agents_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `agents` ADD CONSTRAINT `agents_voice_id_foreign` FOREIGN KEY (`voice_id`) REFERENCES `voices`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ai_requests` ADD CONSTRAINT `ai_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ai_requests` ADD CONSTRAINT `ai_requests_website_id_foreign` FOREIGN KEY (`website_id`) REFERENCES `websites`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `api_audit_logs` ADD CONSTRAINT `api_audit_logs_api_key_id_foreign` FOREIGN KEY (`api_key_id`) REFERENCES `api_keys`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `api_audit_logs` ADD CONSTRAINT `api_audit_logs_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `api_keys` ADD CONSTRAINT `api_keys_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `api_keys` ADD CONSTRAINT `api_keys_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_actor_admin_id_foreign` FOREIGN KEY (`actor_admin_id`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `call_queue_jobs` ADD CONSTRAINT `call_queue_jobs_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `call_queue_jobs` ADD CONSTRAINT `call_queue_jobs_campaign_id_foreign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `call_queue_jobs` ADD CONSTRAINT `call_queue_jobs_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `call_queue_jobs` ADD CONSTRAINT `call_queue_jobs_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `call_queue_jobs` ADD CONSTRAINT `call_queue_jobs_phone_number_id_foreign` FOREIGN KEY (`phone_number_id`) REFERENCES `phone_numbers`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_campaign_id_foreign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_phone_number_id_foreign` FOREIGN KEY (`phone_number_id`) REFERENCES `phone_numbers`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_retry_of_foreign` FOREIGN KEY (`retry_of`) REFERENCES `calls`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `campaign_contact` ADD CONSTRAINT `campaign_contact_campaign_id_foreign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `campaign_contact` ADD CONSTRAINT `campaign_contact_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `campaign_contact` ADD CONSTRAINT `campaign_contact_last_call_id_foreign` FOREIGN KEY (`last_call_id`) REFERENCES `calls`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_phone_number_id_foreign` FOREIGN KEY (`phone_number_id`) REFERENCES `phone_numbers`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `client_role_permission` ADD CONSTRAINT `client_role_permission_client_permission_id_foreign` FOREIGN KEY (`client_permission_id`) REFERENCES `client_permissions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `client_role_permission` ADD CONSTRAINT `client_role_permission_client_role_id_foreign` FOREIGN KEY (`client_role_id`) REFERENCES `client_roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `client_roles` ADD CONSTRAINT `client_roles_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `client_subscriptions` ADD CONSTRAINT `client_subscriptions_assigned_by_admin_id_foreign` FOREIGN KEY (`assigned_by_admin_id`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `client_subscriptions` ADD CONSTRAINT `client_subscriptions_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `client_subscriptions` ADD CONSTRAINT `client_subscriptions_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `client_user_role` ADD CONSTRAINT `client_user_role_client_role_id_foreign` FOREIGN KEY (`client_role_id`) REFERENCES `client_roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `client_user_role` ADD CONSTRAINT `client_user_role_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contact_list_contact` ADD CONSTRAINT `contact_list_contact_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contact_list_contact` ADD CONSTRAINT `contact_list_contact_contact_list_id_foreign` FOREIGN KEY (`contact_list_id`) REFERENCES `contact_lists`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contact_lists` ADD CONSTRAINT `contact_lists_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_whatsapp_account_id_foreign` FOREIGN KEY (`whatsapp_account_id`) REFERENCES `whatsapp_accounts`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credit_ledger` ADD CONSTRAINT `credit_ledger_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credit_ledger` ADD CONSTRAINT `credit_ledger_created_by_admin_id_foreign` FOREIGN KEY (`created_by_admin_id`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credit_purchases` ADD CONSTRAINT `credit_purchases_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credit_purchases` ADD CONSTRAINT `credit_purchases_credit_package_id_foreign` FOREIGN KEY (`credit_package_id`) REFERENCES `credit_packages`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `customer_support_ticket_messages` ADD CONSTRAINT `customer_support_ticket_messages_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `customer_support_tickets`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `customer_support_tickets` ADD CONSTRAINT `customer_support_tickets_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `domains` ADD CONSTRAINT `domains_website_id_foreign` FOREIGN KEY (`website_id`) REFERENCES `websites`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `flow_execution_steps` ADD CONSTRAINT `flow_execution_steps_flow_execution_id_foreign` FOREIGN KEY (`flow_execution_id`) REFERENCES `flow_executions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `flow_executions` ADD CONSTRAINT `flow_executions_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `flow_executions` ADD CONSTRAINT `flow_executions_flow_id_foreign` FOREIGN KEY (`flow_id`) REFERENCES `flows`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `flows` ADD CONSTRAINT `flows_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `flows` ADD CONSTRAINT `flows_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_form_id_foreign` FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `forms` ADD CONSTRAINT `forms_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `forms` ADD CONSTRAINT `forms_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `google_sheet_connections` ADD CONSTRAINT `google_sheet_connections_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inbound_routes` ADD CONSTRAINT `inbound_routes_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inbound_routes` ADD CONSTRAINT `inbound_routes_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inbound_routes` ADD CONSTRAINT `inbound_routes_phone_number_id_foreign` FOREIGN KEY (`phone_number_id`) REFERENCES `phone_numbers`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `knowledge_base_items` ADD CONSTRAINT `knowledge_base_items_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `knowledge_base_items` ADD CONSTRAINT `knowledge_base_items_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kyc_documents` ADD CONSTRAINT `kyc_documents_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kyc_documents` ADD CONSTRAINT `kyc_documents_reviewed_by_admin_id_foreign` FOREIGN KEY (`reviewed_by_admin_id`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `marketing_gift_cards` ADD CONSTRAINT `marketing_gift_cards_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `marketing_referral_settings` ADD CONSTRAINT `marketing_referral_settings_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `marketing_referrals` ADD CONSTRAINT `marketing_referrals_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `marketing_vouchers` ADD CONSTRAINT `marketing_vouchers_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `message_templates` ADD CONSTRAINT `message_templates_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_call_id_foreign` FOREIGN KEY (`call_id`) REFERENCES `calls`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_created_by_admin_id_foreign` FOREIGN KEY (`created_by_admin_id`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `page_revisions` ADD CONSTRAINT `page_revisions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `page_revisions` ADD CONSTRAINT `page_revisions_page_id_foreign` FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pages` ADD CONSTRAINT `pages_website_id_foreign` FOREIGN KEY (`website_id`) REFERENCES `websites`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_subscription_id_foreign` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `phone_numbers` ADD CONSTRAINT `phone_numbers_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `phone_numbers` ADD CONSTRAINT `phone_numbers_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `phone_numbers` ADD CONSTRAINT `phone_numbers_sip_trunk_id_foreign` FOREIGN KEY (`sip_trunk_id`) REFERENCES `sip_trunks`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `prompt_templates` ADD CONSTRAINT `prompt_templates_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sip_trunks` ADD CONSTRAINT `sip_trunks_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tenant_user` ADD CONSTRAINT `tenant_user_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tenant_user` ADD CONSTRAINT `tenant_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tenants` ADD CONSTRAINT `tenants_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `voices` ADD CONSTRAINT `voices_elevenlabs_key_id_foreign` FOREIGN KEY (`elevenlabs_key_id`) REFERENCES `elevenlabs_keys`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `webhook_deliveries` ADD CONSTRAINT `webhook_deliveries_webhook_id_foreign` FOREIGN KEY (`webhook_id`) REFERENCES `webhooks`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `webhooks` ADD CONSTRAINT `webhooks_campaign_id_foreign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `webhooks` ADD CONSTRAINT `webhooks_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `website_widgets` ADD CONSTRAINT `website_widgets_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `website_widgets` ADD CONSTRAINT `website_widgets_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `websites` ADD CONSTRAINT `websites_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `whatsapp_accounts` ADD CONSTRAINT `whatsapp_accounts_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `whatsapp_templates` ADD CONSTRAINT `whatsapp_templates_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `whatsapp_templates` ADD CONSTRAINT `whatsapp_templates_whatsapp_account_id_foreign` FOREIGN KEY (`whatsapp_account_id`) REFERENCES `whatsapp_accounts`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
