-- ----------------------------
-- Table structure for qrcode_product
-- ----------------------------
DROP TABLE IF EXISTS `qrcode_product`;
CREATE TABLE `qrcode_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '名称',
  `code` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '编码',
  `partNo` varchar(50) DEFAULT NULL COMMENT '料号',
  `size` varchar(50) DEFAULT NULL COMMENT '尺寸',
  `weight` varchar(50) DEFAULT NULL COMMENT '重量',
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `code` (`code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
