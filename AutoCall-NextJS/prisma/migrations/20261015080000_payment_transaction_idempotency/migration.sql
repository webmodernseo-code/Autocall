-- Prevent concurrent webhook deliveries from recording the same gateway transaction twice.
DROP INDEX `payment_transactions_gateway_gateway_transaction_id_index` ON `payment_transactions`;
CREATE UNIQUE INDEX `payment_transactions_gateway_gateway_transaction_id_unique`
    ON `payment_transactions`(`gateway`, `gateway_transaction_id`);
