/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50719
Source Host           : localhost:3306
Source Database       : qym

Target Server Type    : MYSQL
Target Server Version : 50719
File Encoding         : 65001

Date: 2018-10-12 01:30:25
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for company
-- ----------------------------
DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `alias` varchar(50) DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of company
-- ----------------------------
INSERT INTO `company` VALUES ('1', '情义明木业有限公司', '情义明', '1', '1539106236226', null, '0');
INSERT INTO `company` VALUES ('6', '骆驼集团襄阳蓄电池有限公司', '骆驼', '0', '1539150339197', null, '0');
INSERT INTO `company` VALUES ('7', '湖北回天新材料股份有限公司', '回天', '0', '1539150294048', null, '0');

-- ----------------------------
-- Table structure for counter
-- ----------------------------
DROP TABLE IF EXISTS `counter`;
CREATE TABLE `counter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL DEFAULT '1',
  `type` varchar(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of counter
-- ----------------------------

-- ----------------------------
-- Table structure for delivery
-- ----------------------------
DROP TABLE IF EXISTS `delivery`;
CREATE TABLE `delivery` (
  `id` varchar(50) NOT NULL,
  `prd` int(11) DEFAULT NULL,
  `prdm` varchar(50) DEFAULT NULL,
  `cust` int(11) DEFAULT NULL,
  `custm` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `nun` varchar(50) DEFAULT NULL,
  `unit` int(11) DEFAULT NULL,
  `unitm` varchar(50) DEFAULT NULL,
  `qty` varchar(50) DEFAULT NULL COMMENT '数量',
  `qtyR` varchar(50) DEFAULT NULL COMMENT '实收数量',
  `ptime` bigint(20) DEFAULT NULL COMMENT '生产时间',
  `lot` varchar(50) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL COMMENT '发货时间',
  `no` int(11) DEFAULT NULL COMMENT 'number',
  `counter` int(11) DEFAULT NULL COMMENT 'number ID',
  `createTime` bigint(20) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of delivery
-- ----------------------------

-- ----------------------------
-- Table structure for deliverygrp
-- ----------------------------
DROP TABLE IF EXISTS `deliverygrp`;
CREATE TABLE `deliverygrp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `delivery` varchar(50) NOT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of deliverygrp
-- ----------------------------

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `model` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `unitId` int(11) NOT NULL,
  `provider` int(11) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `unit` (`unitId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES ('13', '木托盘', '1#', '11', '1', '1539106370011', null, '0');
INSERT INTO `product` VALUES ('14', '木托盘', '2#', '11', '1', '1539106370015', null, '0');
INSERT INTO `product` VALUES ('15', '木托盘', '3#', '11', '1', '1539106370019', null, '0');
INSERT INTO `product` VALUES ('16', '木托盘', '3-1#', '11', '1', '1539106370024', null, '0');
INSERT INTO `product` VALUES ('17', '木托盘', '3-2#', '11', '1', '1539106370027', null, '0');
INSERT INTO `product` VALUES ('18', '木托盘', '3-3#', '11', '1', '1539106370032', null, '0');
INSERT INTO `product` VALUES ('19', '木托盘', '4#', '11', '1', '1539106370036', null, '0');
INSERT INTO `product` VALUES ('20', '木托盘', '5#', '11', '1', '1539106370039', null, '0');
INSERT INTO `product` VALUES ('21', '木托盘', '6#', '11', '1', '1539106370043', null, '0');
INSERT INTO `product` VALUES ('22', '木托盘', '7#', '11', '1', '1539106391119', null, '0');
INSERT INTO `product` VALUES ('23', '木托盘', '8#', '11', '1', '1539106391123', null, '0');
INSERT INTO `product` VALUES ('24', '木托盘', '10#', '11', '1', '1539106522660', null, '0');
INSERT INTO `product` VALUES ('25', '木托盘', '10-1#', '11', '1', '1539106522664', null, '0');
INSERT INTO `product` VALUES ('26', '木托盘', '17#', '11', '1', '1539106522669', null, '0');
INSERT INTO `product` VALUES ('27', '木托盘', '18#', '11', '1', '1539106522675', null, '0');
INSERT INTO `product` VALUES ('28', '木托盘', '19#', '11', '1', '1539106522679', null, '0');
INSERT INTO `product` VALUES ('29', '木托盘', '20#', '11', '1', '1539106522683', null, '0');
INSERT INTO `product` VALUES ('30', '木托盘', '22#', '11', '1', '1539106522686', null, '0');
INSERT INTO `product` VALUES ('31', '木托盘', '23#', '11', '1', '1539106522690', null, '0');
INSERT INTO `product` VALUES ('32', '木托盘', '24#', '11', '1', '1539106522693', null, '0');
INSERT INTO `product` VALUES ('33', '木托盘', '29#', '11', '1', '1539106522697', null, '0');
INSERT INTO `product` VALUES ('34', '木托盘', '30#', '11', '1', '1539106522700', null, '0');
INSERT INTO `product` VALUES ('35', '木托盘', '31#', '11', '1', '1539106522704', null, '0');
INSERT INTO `product` VALUES ('36', '木托盘', '37#', '11', '1', '1539106522708', null, '0');
INSERT INTO `product` VALUES ('37', '木托盘', '43#', '11', '1', '1539106522712', null, '0');
INSERT INTO `product` VALUES ('38', '木托盘', '44#', '11', '1', '1539106522715', null, '0');
INSERT INTO `product` VALUES ('39', '木托盘', '806Z折边胶木托盘', '11', '1', '1539228040123', null, '0');
INSERT INTO `product` VALUES ('40', '木托盘', '906Z双桶木箱', '14', '1', '1539228040127', null, '0');
INSERT INTO `product` VALUES ('41', '木托盘', '906Z双桶木托盘', '11', '1', '1539228166351', null, '0');
INSERT INTO `product` VALUES ('42', '木托盘', '906Z单桶木箱', '14', '1', '1539228166356', null, '0');
INSERT INTO `product` VALUES ('43', '木托盘', '906Z单桶木托盘', '11', '1', '1539228166359', null, '0');
INSERT INTO `product` VALUES ('44', '木托盘', '周转用木托盘1150*1000', '11', '1', '1539228166362', null, '0');
INSERT INTO `product` VALUES ('45', '木托盘', '623专用木托盘1150*1000', '11', '1', '1539228166370', null, '0');
INSERT INTO `product` VALUES ('46', '木托盘', 'CP3木托盘', '11', '1', '1539228798974', null, '0');
INSERT INTO `product` VALUES ('47', '木托盘', '开口桶木托盘', '11', '1', '1539228798979', null, '0');
INSERT INTO `product` VALUES ('48', '木托盘', 'PUR产品专用木托盘920*920', '11', '1', '1539228798983', null, '0');
INSERT INTO `product` VALUES ('49', '木托盘', '8264水务胶专用木托盘1000*1000', '11', '1', '1539228798986', null, '0');
INSERT INTO `product` VALUES ('50', '木托盘', 'CP4木托盘1200*1150', '11', '1', '1539228798991', null, '0');
INSERT INTO `product` VALUES ('51', '木托盘', '松芝专用木托盘1150*1000', '11', '1', '1539228798994', null, '0');
INSERT INTO `product` VALUES ('52', '木托盘', '松芝专用木托盘1350*1150', '11', '1', '1539228798997', null, '0');
INSERT INTO `product` VALUES ('53', '木托盘', '外贸免熏蒸木托盘1140*1140', '11', '1', '1539228952593', null, '0');
INSERT INTO `product` VALUES ('54', '木托盘', '外贸免熏蒸木托盘1200*1150', '11', '1', '1539228952860', null, '0');
INSERT INTO `product` VALUES ('55', '木托盘', '外贸免熏蒸木托盘1150*900', '11', '1', '1539228952865', null, '0');
INSERT INTO `product` VALUES ('56', '木托盘', '外贸免熏蒸木托盘1100*800', '11', '1', '1539228952908', null, '0');
INSERT INTO `product` VALUES ('57', '木托盘', '外贸免熏蒸双桶盘1250*680', '11', '1', '1539228952912', null, '0');
INSERT INTO `product` VALUES ('58', '木托盘', '外贸免熏蒸木压板1200*1150', '13', '1', '1539229090194', null, '0');
INSERT INTO `product` VALUES ('59', '木托盘', '外贸免熏蒸木压板1140*1140', '13', '1', '1539229090198', null, '0');
INSERT INTO `product` VALUES ('60', '木托盘', '外贸免熏蒸木压板1100*800', '13', '1', '1539229090202', null, '0');
INSERT INTO `product` VALUES ('61', '木托盘', '外贸免熏蒸木压板1150*900', '13', '1', '1539229090205', null, '0');

-- ----------------------------
-- Table structure for supply
-- ----------------------------
DROP TABLE IF EXISTS `supply`;
CREATE TABLE `supply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer` int(11) NOT NULL,
  `product` int(11) NOT NULL,
  `nun` varchar(50) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `product` (`product`) USING BTREE,
  KEY `customer` (`customer`) USING BTREE,
  CONSTRAINT `customer` FOREIGN KEY (`customer`) REFERENCES `company` (`id`),
  CONSTRAINT `product` FOREIGN KEY (`product`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of supply
-- ----------------------------
INSERT INTO `supply` VALUES ('7', '6', '13', '26060001', '1539106635420', null, '0');
INSERT INTO `supply` VALUES ('8', '6', '14', '26060002', '1539106635425', null, '0');
INSERT INTO `supply` VALUES ('9', '6', '15', '26060003', '1539106635429', null, '0');
INSERT INTO `supply` VALUES ('10', '6', '16', '26060017', '1539106635434', null, '0');
INSERT INTO `supply` VALUES ('11', '6', '17', '26060018', '1539106635438', null, '0');
INSERT INTO `supply` VALUES ('12', '6', '18', '26060019', '1539106635441', null, '0');
INSERT INTO `supply` VALUES ('13', '6', '19', '26060004', '1539106635448', null, '0');
INSERT INTO `supply` VALUES ('14', '6', '20', '26060005', '1539106635454', null, '0');
INSERT INTO `supply` VALUES ('15', '6', '21', '26060006', '1539106635463', null, '0');
INSERT INTO `supply` VALUES ('16', '6', '22', '26060007', '1539106635476', null, '0');
INSERT INTO `supply` VALUES ('17', '6', '23', '26060008', '1539106635483', null, '0');
INSERT INTO `supply` VALUES ('18', '6', '24', '26060010', '1539106635488', null, '0');
INSERT INTO `supply` VALUES ('27', '6', '25', '26060025', '1539226780264', null, '0');
INSERT INTO `supply` VALUES ('28', '6', '26', '26060028', '1539227036986', null, '0');
INSERT INTO `supply` VALUES ('29', '6', '27', '26060027', '1539227037002', null, '0');
INSERT INTO `supply` VALUES ('30', '6', '28', '26060029', '1539227037006', null, '0');
INSERT INTO `supply` VALUES ('31', '6', '29', '26060041', '1539227037014', null, '0');
INSERT INTO `supply` VALUES ('32', '6', '30', '26060042', '1539227037018', null, '0');
INSERT INTO `supply` VALUES ('33', '6', '31', '26060043', '1539227037021', null, '0');
INSERT INTO `supply` VALUES ('34', '6', '32', '26060044', '1539227037025', null, '0');
INSERT INTO `supply` VALUES ('35', '6', '33', '26060050', '1539227037029', null, '0');
INSERT INTO `supply` VALUES ('36', '6', '34', '26060051', '1539227037033', null, '0');
INSERT INTO `supply` VALUES ('37', '6', '35', '26060067', '1539227037037', null, '0');
INSERT INTO `supply` VALUES ('38', '6', '36', '26060037', '1539227037040', null, '0');
INSERT INTO `supply` VALUES ('39', '6', '37', '26060172', '1539227037044', null, '0');
INSERT INTO `supply` VALUES ('40', '6', '38', '26060173', '1539227037048', null, '0');
INSERT INTO `supply` VALUES ('41', '7', '39', '', '1539230307161', null, '0');
INSERT INTO `supply` VALUES ('42', '7', '40', '', '1539230307166', null, '0');
INSERT INTO `supply` VALUES ('43', '7', '41', '', '1539230307170', null, '0');
INSERT INTO `supply` VALUES ('44', '7', '42', '', '1539230307173', null, '0');
INSERT INTO `supply` VALUES ('45', '7', '43', '', '1539230307176', null, '0');

-- ----------------------------
-- Table structure for unit
-- ----------------------------
DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `sign` varchar(20) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of unit
-- ----------------------------
INSERT INTO `unit` VALUES ('11', '个', '', '1539106290655', null, '0');
INSERT INTO `unit` VALUES ('13', '块', '', '1539183768077', null, '0');
INSERT INTO `unit` VALUES ('14', '套', '', '1539227991486', null, '0');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `account` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `root` int(11) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '陈亮', '236338364', 'f889134a41063043803618b18908b6bd6d57b027', '1', '1539190580107', null, '0');
INSERT INTO `user` VALUES ('2', '陈强', 'qym', '728250251ef3659132b784e179fa7e8e14625b11', '1', '1539226533705', null, '0');
INSERT INTO `user` VALUES ('3', 'de', '2', '77de68daecd823babbb58edb1c8e14d7106e83bb', '0', '1539228036566', null, '0');
