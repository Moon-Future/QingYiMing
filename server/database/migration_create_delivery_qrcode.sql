-- ----------------------------
-- Table structure for delivery_qrcode
-- ----------------------------
DROP TABLE IF EXISTS `delivery_qrcode`;
CREATE TABLE `delivery_qrcode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qrcodeProductId` int(11) NOT NULL COMMENT '二维码产品ID',
  `versionNo` varchar(50) NOT NULL COMMENT '版本号',
  `seq1` varchar(10) NOT NULL DEFAULT '01' COMMENT '序号1',
  `seq2` varchar(10) NOT NULL DEFAULT '0001' COMMENT '序号2',
  `qrContent` varchar(255) NOT NULL COMMENT 'QR码内容',
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
