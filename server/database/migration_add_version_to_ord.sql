-- 给ord表和delivery表增加version字段
-- 执行时间: 2026-03-17

ALTER TABLE `ord` ADD COLUMN `version` VARCHAR(50) DEFAULT NULL COMMENT '版本' AFTER `model`;
ALTER TABLE `delivery` ADD COLUMN `version` VARCHAR(50) DEFAULT NULL COMMENT '版本' AFTER `model`;
