-- 给ord表增加remark字段
-- 执行时间: 2026-04-09

ALTER TABLE `ord` ADD COLUMN `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注' AFTER `qty`;
